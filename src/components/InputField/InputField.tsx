// src/components/SearchField/SearchField.tsx

import type React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./InputField.css"; // измените имя файла стилей

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
      // ✅ Класс search-form на самом Form для правильного применения стилей
      <Form onSubmit={handleSubmit} className="search-form">
        <Form.Control
            type="text"
            name="query"
            className="search-input" // ✅ Заменён form-control на search-input
            placeholder="Поиск по режимам движения"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
        />
        <Button type="submit" className="search-btn">
          Найти
        </Button>
      </Form>
  );
}