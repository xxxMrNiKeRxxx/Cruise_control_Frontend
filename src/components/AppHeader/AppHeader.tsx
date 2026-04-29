// src/components/AppHeader.tsx

import { Link } from "react-router-dom";
import cartIcon from "../../assets/logo.png";
import "./AppHeader.css";

export const AppHeader = () => {
    return (
        <header className="app-header">
            <div className="app-header__logo">
                {/* Логотип — кликабельная ссылка на /modes */}
                <Link to="/modes" aria-label="Главная" className="app-header__logo-link">
                    <img
                        src={cartIcon}
                        alt="Логотип"
                        className="app-header__logo-icon"
                    />
                </Link>
                <span className="app-header__logo-text">CRUISE CONTROL</span>
            </div>
        </header>
    );
};