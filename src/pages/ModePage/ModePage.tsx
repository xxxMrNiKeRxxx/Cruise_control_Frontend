// src/pages/ModePage.tsx

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addModeToMockCart,
  getMockMode,
} from "../../modules/mock";
import {
  fallbackImageUrl,
  resolveMediaUrl,
  type Service,
} from "../../modules/modeApi";
import "./ModePage.css";

export default function ModePage() {
  const { id } = useParams();
  const [mode, setMode] = useState<Service | null>(null);
  const [mediaError, setMediaError] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    const numId = Number(id);
    const resolved = getMockMode(numId) ?? null;
    setMode(resolved);
    setMediaError(false);
  }, [id]);

  const videoUrl = useMemo(
    () => (mode?.videoKey ? resolveMediaUrl(mode.videoKey) : ""),
    [mode]
  );
  const posterUrl = useMemo(
    () => (mode?.imageKey ? resolveMediaUrl(mode.imageKey) : fallbackImageUrl()),
    [mode]
  );
  const showVideo = Boolean(mode?.videoKey?.trim()) && !mediaError;

  const handleAdd = async () => {
    if (!mode) return;
    setAdding(true);
    try {
      await addModeToMockCart(mode.id);
    } finally {
      setAdding(false);
    }
  };

  if (!id || !mode) {
    return (
      <div className="vibes-page vibes-page--full-height">
        <div className="component-not-found">
          <h1>Режим не найден</h1>
        </div>
      </div>
    );
  }

  // Бейдж типа
  const badgeClass =
    mode.drivingType === "city"
      ? "mode-badge city"
      : mode.drivingType === "highway"
      ? "mode-badge highway"
      : "mode-badge mixed";
  const badgeText =
    mode.drivingType === "city" ? "ГОРОД"
    : mode.drivingType === "highway" ? "ТРАССА"
    : "СМЕШАННЫЙ";

  return (
    <div className="vibes-page vibes-page--full-height">
      <div className="vibes-hero">
        <div className="vibes-viewport">
          {/* Видео/изображение на всю высоту */}
          <div className="vibes-media-full">
            {showVideo ? (
              <video
                className="vibes-video-full"
                autoPlay
                muted
                loop
                playsInline
                poster={posterUrl}
                onError={() => setMediaError(true)}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div
                className="vibes-fallback-full"
                style={{ backgroundImage: `url(${posterUrl})` }}
              />
            )}
            <div className="vibes-overlay" aria-hidden />

            {/* Бейдж */}
            <div className={badgeClass}>{badgeText}</div>

            {/* Контент поверх */}
            <div className="vibes-content">
              <h1 className="vibes-title">{mode.name}</h1>
              <div className="vibes-meta">
                <div>⛽ {mode.baseConsumption} л/100км</div>
                <div>💰 Экономия: {mode.economyPercent}%</div>
                <div>₽ {mode.price} ₽</div>
              </div>
              <p className="vibes-description">{mode.description}</p>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}