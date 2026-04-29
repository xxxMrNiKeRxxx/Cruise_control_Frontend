// src/pages/ModePage/ModePage.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { resolveMediaUrl, type DrivingMode, getDrivingMode } from "../../modules/modeApi"; // замените на ваш путь к API
import { getMockMode, DrivingModeS_MOCK } from "../../modules/mock";
import defaultImage from "../../assets/default_image.png"; // замените на ваше изображение по умолчанию
import "./ModePage.css";

export default function ModePage() {
  const { id } = useParams();

  const [mode, setMode] = useState<DrivingMode | null>(null);
  const [mediaError, setMediaError] = useState(false);
  const [loading, setLoading] = useState(true); // состояние загрузки

  useEffect(() => {
    if (!id) {
      setMode(null);
      setLoading(false);
      return;
    }

    setMediaError(false);
    setLoading(true);
    const modeId = Number(id);

    // Попытка получить данные с бэкенда, fallback на mock
    getDrivingMode(modeId) // заменено с getTire
        .then(data => {
          if (data) {
            setMode(data);
          } else {
            // Fallback на mock, если бэкенд вернул null
            const resolved = getMockMode(modeId) ?? DrivingModeS_MOCK.find((m) => m.mode_id === modeId) ?? null; // заменено с tire
            setMode(resolved);
          }
        })
        .catch(() => {
          // Fallback на mock при ошибке сети
          const resolved = getMockMode(modeId) ?? DrivingModeS_MOCK.find((m) => m.mode_id === modeId) ?? null; // заменено с tire
          setMode(resolved);
        })
        .finally(() => {
          setLoading(false);
        });

  }, [id]);

  // Видео и изображение теперь из mode
  const videoUrl = mode?.video_key ? resolveMediaUrl(mode.video_key) : ""; // заменено с video
  const fallbackUrl = mode?.image_key ? resolveMediaUrl(mode.image_key) : defaultImage; // заменено с photo
  const showVideo = Boolean(videoUrl) && !mediaError;

  if (loading) {
    return (
        <div className="vibes-page vibes-page--scroll">
          <div className="mode-not-found"> {/* заменён класс */}
            <h1>Загрузка...</h1>
          </div>
        </div>
    );
  }

  if (!id || !mode) {
    return (
        <div className="vibes-page vibes-page--scroll">
          <div className="mode-not-found"> {/* заменён класс */}
            <h1>Режим не найден</h1> {/* заменён текст */}
          </div>
        </div>
    );
  }

  return (
      <div className="vibes-page vibes-page--scroll">
        <div className="vibes-viewport">
          <div className="vibes-media">
            {showVideo ? (
                <video
                    className="vibes-video"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={fallbackUrl}
                    onError={() => setMediaError(true)}
                >
                  <source src={videoUrl} type="video/mp4" />
                  <img src={fallbackUrl} alt={mode.mode_name} /> {/* заменено с tire.tire_title */}
                </video>
            ) : (
                <div
                    className="vibes-fallback"
                    style={{ backgroundImage: `url(${fallbackUrl})` }}
                    aria-label={mode.mode_name}
                />
            )}
            <div className="vibes-overlay" aria-hidden />
          </div>

          <div className="vibes-content">
            <h1 className="vibes-title">{mode.mode_name}</h1> {/* заменено с tire.tire_title */}

            {/* Описание показывается полностью */}
            <p className="vibes-description">
              {mode.description ?? ''}
            </p>

            <div className="vibes-manager">
              <span className="vibes-manager__label">Потребление</span> {/* заменён текст */}
              <span className="vibes-manager__name">{mode.base_consumption} л/100км</span> {/* заменено с tire_material_coefficient */}
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>
              <span className="vibes-manager__label">Экономия</span> {/* заменён текст */}
              <span className="vibes-manager__name">{mode.economy_percent}%</span> {/* новое поле */}
            </div>

            {/* Добавим тип движения */}
            <div className="vibes-manager">
              <span className="vibes-manager__label">Тип</span>
              <span className="vibes-manager__name">
              {mode.driving_type === "city" && "Город"}
                {mode.driving_type === "highway" && "Трасса"}
                {mode.driving_type === "mixed" && "Смешанный"}
            </span>
            </div>

          </div>
        </div>
      </div>
  );
}