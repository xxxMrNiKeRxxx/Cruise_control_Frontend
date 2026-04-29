// src/components/ModeCard/ModeCard.tsx

import { Link } from "react-router-dom";
import type { DrivingMode } from "../../modules/modeApi";
import { resolveMediaUrl } from "../../modules/modeApi";
import defaultImage from "../../assets/default_image.png";
import "./ModeCard.css";

interface ModeCardProps {
    mode: DrivingMode;
}

export default function ModeCard({ mode }: ModeCardProps) {
    const imageUrl = mode.image_key ? resolveMediaUrl(mode.image_key) : defaultImage;

    // Бейдж типа
    const badgeClass =
        mode.driving_type === "city"
            ? "mode-badge mode-badge--city"
            : mode.driving_type === "highway"
                ? "mode-badge mode-badge--highway"
                : "mode-badge mode-badge--mixed";

    const badgeText =
        mode.driving_type === "city" ? "ГОРОД"
            : mode.driving_type === "highway" ? "ТРАССА"
                : "СМЕШАННЫЙ";

    return (
        <div className="mode-card">
            {/* Изображение + бейдж */}
            <div className="mode-card__image-wrapper">
                <img
                    src={imageUrl}
                    alt={mode.mode_name || "Режим"}
                    className="mode-card__image"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultImage;
                    }}
                />
                <span className={badgeClass}>{badgeText}</span>
            </div>

            {/* Информация */}
            <div className="mode-card__content">
                <h3 className="mode-card__title">
                    <Link to={`/mode/${mode.mode_id}`} className="mode-card__link">
                        {mode.mode_name || `Режим #${mode.mode_id}`}
                    </Link>
                </h3>

                <div className="mode-card__specs">
                    <div className="spec-item">
                        <span className="spec-icon">Экономия топлива</span>
                        <span className="spec-value">
              {mode.base_consumption} л/100км
            </span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-icon">Экономия</span>
                        <span className="spec-value">
              {mode.economy_percent}%
            </span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-icon">Экономия в рублях</span>
                        <span className="spec-value">
              {mode.price} ₽
            </span>
                    </div>
                </div>

                {mode.description && (
                    <p className="mode-card__description">{mode.description}</p>
                )}

                {/* Кнопка — как на скрине: красная, с закруглённым низом */}
                <button className="mode-card__btn">
                    Чтобы добавить в заявку, необходимо Войти
                </button>
            </div>
        </div>
    );
}