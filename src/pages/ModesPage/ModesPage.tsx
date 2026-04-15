// src/pages/ModesPage.tsx

import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import Search from "../../components/InputField/InputField";
import {ModesList} from "../../components/ModesList/ModesList";
import type { Mode } from "../../modules/modeApi";
import { MOCK_DRIVING_MODES, filterMockModesByName } from "../../modules/mock";
import "./ModesPage.css";

export const ModesPage = () => {
  const [modes, setModes] = useState<Mode[]>(MOCK_DRIVING_MODES);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Загружаем mock-данные при монтировании
  useEffect(() => {
    const timer = setTimeout(() => {
      setModes(MOCK_DRIVING_MODES);
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    setLoading(true);
    try {
      const filtered = filterMockModesByName(searchQuery);
      setModes(filtered);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modes-page">
      {/* Поиск */}
      <div className="modes-page__search">
        <Search
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>

      {/* Заголовок */}
      <h1 className="modes-page__title">КАТАЛОГ РЕЖИМОВ ДВИЖЕНИЯ</h1>

      {/* Сетка карточек */}
      <div className="modes-grid">
        {loading ? (
          <div className="modes-grid__loader">Загрузка...</div>
        ) : modes.length > 0 ? (
          <ModesList modes={modes} />
        ) : (
          <div className="modes-grid__empty">
            {searchQuery
              ? `По запросу «${searchQuery}» ничего не найдено`
              : "Ничего не найдено"}
          </div>
        )}
      </div>
    </div>
  );
};