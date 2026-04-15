// src/components/ModeCard/ModeCard.tsx

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fallbackImageUrl, resolveMediaUrl } from "../../modules/modeApi";
import { addModeToMockCart } from "../../modules/mock";
import type { Mode } from "../../modules/modeApi";
import "./ModeCard.css";

interface ModeCardProps {
  mode: Mode;
}

export const ModeCard = ({ mode }: ModeCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    mode.imageKey ? resolveMediaUrl(mode.imageKey) : fallbackImageUrl()
  );
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const url = mode.imageKey ? resolveMediaUrl(mode.imageKey) : fallbackImageUrl();
    setImageUrl(url);
    setImageError(false);
  }, [mode.imageKey]);

  const handleImageError = () => {
    setImageError(true);
    setImageUrl(fallbackImageUrl());
  };

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addModeToMockCart(mode.id);
    } finally {
      setAdding(false);
    }
  };

  const badgeClass =
    mode.drivingType === "city"
      ? "mode-badge--city"
      : mode.drivingType === "highway"
      ? "mode-badge--highway"
      : "mode-badge--mixed";
  const badgeText =
    mode.drivingType === "city" ? "ГОРОД"
    : mode.drivingType === "highway" ? "ТРАССА"
    : "СМЕШАННЫЙ";

  return (
    <div className="mode-card">
      <Link to={`/mode/${mode.id}`} className="mode-card__link">
        <div className="mode-card__image-wrapper">
          {imageError ? (
            <div className="mode-card__fallback"></div>
          ) : (
            <img
              src={imageUrl}
              alt={mode.name}
              className="mode-card__image"
              onError={handleImageError}
            />
          )}
          <span className={`mode-badge ${badgeClass}`}>{badgeText}</span>
        </div>

        <div className="mode-card__content">
          <h3 className="mode-card__title">{mode.name}</h3>
          <div className="mode-card__specs">
            <div className="spec-item">
              <span className="spec-icon">⛽</span>
              <span className="spec-value">{mode.baseConsumption} л/100км</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">💰</span>
              <span className="spec-value">Экономия: {mode.economyPercent}%</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">₽</span>
              <span className="spec-value">{mode.price} ₽</span>
            </div>
          </div>
        </div>
      </Link>

      <button
        className="mode-card__btn"
        onClick={handleAdd}
        disabled={adding}
      >
        {adding ? "Неудача..." : "Войдите, чтобы добавить"}
      </button>
    </div>
  );
};