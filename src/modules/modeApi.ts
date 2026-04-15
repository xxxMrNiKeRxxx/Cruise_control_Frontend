// Типы для режимов движения и заявок на расчёт экономии топлива

export interface Mode {
  id: number;
  name: string;
  description: string;
  baseConsumption: number; // Базовое потребление (л/100км)
  economyPercent: number;  // Процент экономии (%)
  drivingType: 'city' | 'highway' | 'mixed'; // Тип движения
  imageKey?: string;       // Ключ для изображения (может быть пустым)
  videoKey?: string;       // Ключ для видео (может быть пустым)
  price: number;           // Цена услуги
  createdAt: string;       // Дата создания (ISO строка или YYYY-MM-DD)
}

export interface Cart {
  has_draft: boolean;        // Есть ли черновик заявки
  modes_count: number;       // Кол-во режимов в корзине
  incomplete_items_count: number; // Кол-во неполных записей
  consumption_id?: number;   // ID черновика (если есть)
}

// Тип для деталей заявки на расчёт
export interface FuelConsumptionJSON {
  consumption_id: number;
  status: 'черновик' | 'сформирован' | 'завершён' | 'удалён' | 'отклонён';
  created_at: string;        // Дата создания
  date_formed?: string | null; // Дата формирования (если сформирован)
  date_completed?: string | null; // Дата завершения (если завершён)
  creator_login: string;     // Логин создателя
  moderator_login?: string | null; // Логин модератора (если завершён/отклонён)
  origin: string;            // Откуда (город)
  destination: string;       // Куда (город)
  fuel_price: number;        // Цена топлива
  total_saved: number;       // Общая экономия (л)
  incomplete_items_count: number; // Кол-во неполных записей
}

// Тип для одной записи в заявке (режим + маршрут)
export interface FuelModeJSON {
  id: number;                // ID записи связи
  mode_id: number;           // ID режима
  mode_name: string;         // Название режима
  base_consumption: number;  // Базовое потребление
  economy_percent: number;   // Процент экономии
  image_key: string;         // Изображение режима
  route_distance: number;    // Пройденное расстояние (км)
  fuel_saved: number;        // Экономия на этом участке (л)
}

// Ответ на детали заявки
export interface FuelConsumptionDetailResponse {
  consumption: FuelConsumptionJSON;
  modes: FuelModeJSON[];
}

// Функции для работы с изображениями/медиа
export function fallbackImageUrl(): string {
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"><rect width="100%" height="100%" fill="#e8e8ec"/></svg>',
    )
  );
}

export function resolveMediaUrl(key: string): string {
  if (!key) return fallbackImageUrl();
  if (
    key.startsWith("http://") ||
    key.startsWith("https://") ||
    key.startsWith("/") ||
    key.startsWith("blob:") ||
    key.startsWith("data:")
  ) {
    return key;
  }
  // В реальном проекте: return `${MINIO_BASE_URL}/${key}`;
  return fallbackImageUrl();
}