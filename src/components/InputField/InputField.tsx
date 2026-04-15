// src/components/SearchField/SearchField.tsx

import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "./InputField.css";
import { Link } from "react-router-dom";
import cartIcon from "../../assets/logo.png";

interface SearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
}

export default function Search({ query, onQueryChange, onSearch }: SearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="search-bar-global">
      {/* Чёрная панель*/}
      <div className="toolbar-black">
        <div className="container">
          <Form onSubmit={handleSubmit} className="search-form">
            <Form.Control
              type="text"
              name="query"
              className="search-input"
              placeholder="Поиск по режимам движения"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              aria-label="Поиск по каталогу"
            />
            <Button type="submit" className="search-btn">
              Найти
            </Button>
          </Form>

          {/* Кнопка заявки */}
          <Link to="/fuelconsumption/1" className="cart-icon" aria-label="Заявка">
            <img
              src={cartIcon}
              alt="Заявка"
              className="cart-icon__img"
            />
            <span className="cart-count">2</span>
        </Link>
        </div>
      </div>
    </div>
  );
}