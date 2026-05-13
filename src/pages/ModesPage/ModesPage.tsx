// src/pages/ModesPage/ModesPage.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, ProgressBar } from "react-bootstrap";
import Search from "../../components/InputField/InputField";
import CartRow from "../../components/CartRow/CartRow";
import ModeCard from "../../components/ModeCard/ModeCard";
import {
  DrivingModeClipDescription,
  fallbackImageUrl,
  listDrivingModes,
  objectUrlFromKey,
  type DrivingMode,
} from "../../modules/modeApi";
import { DrivingModeS_MOCK } from "../../modules/mock";
import { useModeImageSearch } from "../../hooks/useModeImageSearch";
import "./ModesPage.css";

// ✅ Хелпер для резолва путей к изображениям
function resolveThumb(key: string): string {
  if (!key) return fallbackImageUrl();
  if (
      key.startsWith("http://") ||
      key.startsWith("https://") ||
      key.startsWith("/") ||
      key.startsWith("blob:")
  ) {
    return key;
  }
  return objectUrlFromKey(key);
}

export default function ModesPage() {
  // === Состояния данных ===
  const [clipSourceModes, setClipSourceModes] = useState<DrivingMode[]>([]);
  const [displayModes, setDisplayModes] = useState<DrivingMode[]>([]);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(false);

  // === Состояния CLIP-поиска ===
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [clipSessionActive, setClipSessionActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === Загрузка данных (бэкенд → fallback на mock) ===
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (useMock) {
        if (!cancelled) {
          setClipSourceModes(DrivingModeS_MOCK);
          setDisplayModes(DrivingModeS_MOCK);
        }
        return;
      }
      try {
        const data = await listDrivingModes();
        if (cancelled) return;
        if (data.length > 0) {
          setClipSourceModes(data);
          setDisplayModes(data);
        } else {
          setClipSourceModes(DrivingModeS_MOCK);
          setDisplayModes(DrivingModeS_MOCK);
          setUseMock(true);
        }
      } catch {
        if (cancelled) return;
        setClipSourceModes(DrivingModeS_MOCK);
        setDisplayModes(DrivingModeS_MOCK);
        setUseMock(true);
      }
    };

    void run();
    return () => { cancelled = true; };
  }, [useMock]);

  // === Подготовка данных для CLIP: { id: mode_id, description: short_description_en } ===
  const clipItems = useMemo(
      () =>
          clipSourceModes.map((mode) => ({
            id: mode.mode_id,
            description: DrivingModeClipDescription(mode),
          })),
      [clipSourceModes],
  );

  // === Подключение хука поиска ===
  const {
    items: clipProcessed,
    ready: clipReady,
    progress: clipProgress,
    imageEmbedding,
    workerError,
    searchByImage,
    resetSearch,
  } = useModeImageSearch(clipItems, clipSessionActive);

  // === Мапа для быстрого доступа к полной сущности режима по id ===
  const modeById = useMemo(() => {
    const m = new Map<number, DrivingMode>();
    clipSourceModes.forEach((mode) => m.set(mode.mode_id, mode));
    return m;
  }, [clipSourceModes]);

  // === Обработчик текстового поиска ===
  const handleSearch = async () => {
    setLoading(true);
    try {
      const filtered = await listDrivingModes({ name: searchName });
      if (filtered.length > 0) {
        setDisplayModes(filtered);
        setUseMock(false);
      } else {
        if (useMock) {
          const filteredMock = DrivingModeS_MOCK.filter((mode) =>
              mode.mode_name.toLowerCase().includes(searchName.toLowerCase()),
          );
          setDisplayModes(filteredMock);
        } else {
          setDisplayModes([]);
        }
      }
    } catch {
      const filteredMock = DrivingModeS_MOCK.filter((mode) =>
          mode.mode_name.toLowerCase().includes(searchName.toLowerCase()),
      );
      setDisplayModes(filteredMock);
      setUseMock(true);
    } finally {
      setLoading(false);
    }
  };

  // === Обработчики загрузки изображения ===
  const handleUploadButtonClick = () => {
    if (!clipSessionActive) setClipSessionActive(true);
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (selectedImage?.startsWith("blob:")) URL.revokeObjectURL(selectedImage);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      searchByImage(file);
    }
  };

  const handleClearImage = () => {
    if (selectedImage?.startsWith("blob:")) URL.revokeObjectURL(selectedImage);
    setSelectedImage(null);
    resetSearch();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // === Флаги для UI ===
  const imageSearchActive = Boolean(imageEmbedding);
  const showClipProgress =
      clipSessionActive && clipItems.length > 0 && !clipReady && !workerError;
  const uploadLabel =
      clipSessionActive && !clipReady ? "Загрузка нейросети…" : "Загрузить фото";
  const isUploadDisabled =
      clipItems.length === 0 || (clipSessionActive && !clipReady);
  const canResetImage = Boolean(selectedImage);

  // === Результаты поиска по изображению (только видимые после порога) ===
  const visibleClipRows = imageSearchActive
      ? clipProcessed.filter((item) => item.isVisible)
      : [];

  return (
      <div className="modes-page">
        {/* === Чёрная панель с поиском и заявкой === */}
        <div className="toolbar">
          <div className="container">
            <Search query={searchName} onQueryChange={setSearchName} onSearch={handleSearch} />
            <CartRow />
          </div>
        </div>

        <div className="space">
          <main className="catalog-main">
            {/* === Секция CLIP-поиска === */}
            <section
                className="clip-card"
                aria-labelledby="clip-search-title"
            >
              <h2 id="clip-search-title" className="clip-card__title">
                Поиск режима по изображению
              </h2>

              {workerError ? (
                  <Alert variant="warning" className="clip-card__alert">
                    Не удалось загрузить модель или обработать запрос: {workerError}
                  </Alert>
              ) : null}

              {clipItems.length === 0 ? (
                  <p className="clip-card__empty">Загрузите каталог режимов…</p>
              ) : (
                  <div className="clip-card__content">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="clip-card__file-input"
                        onChange={handleImageUpload}
                    />

                    <div className="clip-card__preview">
                      {selectedImage ? (
                          <img src={selectedImage} alt="" className="clip-card__preview-img" />
                      ) : (
                          <div className="clip-card__placeholder">Нет фото</div>
                      )}
                    </div>

                    <div className="clip-card__actions">
                      <Button
                          className="clip-card__btn-upload"
                          variant="warning"
                          onClick={handleUploadButtonClick}
                          disabled={isUploadDisabled}
                      >
                        {uploadLabel}
                      </Button>

                      {showClipProgress ? (
                          <ProgressBar
                              className="clip-card__progress"
                              now={clipProgress}
                              label={`${Math.round(clipProgress)}%`}
                              animated
                          />
                      ) : null}

                      <Button
                          className="clip-card__btn-clear"
                          variant="outline-danger"
                          onClick={handleClearImage}
                          disabled={!canResetImage}
                      >
                        Сбросить
                      </Button>
                    </div>
                  </div>
              )}
            </section>

            {/* === Заголовок каталога === */}
            <div className="catalog-header">
              <h2 className="catalog-title">КАТАЛОГ РЕЖИМОВ ДВИЖЕНИЯ</h2>
            </div>

            {/* === Рендер результатов === */}
            {loading ? (
                <div>Загрузка...</div>
            ) : imageSearchActive ? (
                // 🔹 Режим CLIP-поиска: показываем только похожие режимы
                <div className="catalog-grid catalog-grid--clip">
                  {visibleClipRows.length === 0 ? (
                      <div className="catalog-empty">
                        Нет режимов выше порога сходства. Попробуйте другое изображение.
                      </div>
                  ) : (
                      <ul className="clip-results-list">
                        {visibleClipRows.map((item) => {
                          const m = modeById.get(item.id);
                          if (!m) return null;
                          const thumb = resolveThumb(m.image_key || "");
                          return (
                              <li key={item.id}>
                                <Link to={`/mode/${item.id}`} className="mode-row clip-result-row">
                                  <img src={thumb} alt="" className="row-image" />
                                  <div className="row-content">
                                    <h5>{m.mode_name}</h5>
                                    <p className="text-muted mb-1 clip-result-row__en">{item.description}</p>
                                    <p className="text-muted mb-0 small">{m.description}</p>
                                  </div>
                                  <div className="row-stats">
                                    <div>
                                      Сходство:{" "}
                                      <span className="similarity-value">
                                {(item.score * 100).toFixed(1)}%
                              </span>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                          );
                        })}
                      </ul>
                  )}
                </div>
            ) : (
                // 🔹 Обычный режим: сетка карточек с фильтрацией
                <div className="modes-grid">
                  {displayModes.length > 0 ? (
                      displayModes.map((mode) => <ModeCard key={mode.mode_id} mode={mode} />)
                  ) : (
                      <div className="modes-page__empty">
                        {searchName
                            ? `По запросу «${searchName}» ничего не найдено`
                            : "Режимы не найдены"}
                      </div>
                  )}
                </div>
            )}
          </main>
        </div>
      </div>
  );
}