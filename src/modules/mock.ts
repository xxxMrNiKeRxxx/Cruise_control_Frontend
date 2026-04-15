import {
  type Mode,
  type Cart,
  type FuelConsumptionDetailResponse,
} from "./modeApi"; // Используем ваш тип Mode из предыдущего кода

// Импортируем изображения (замените на ваши реальные пути)
import firstPhoto from "../assets/car_city_compact.jpg";
import firstVideo from "../assets/car_city_compact.mp4";
import secondPhoto from "../assets/car_city_sedan.jpg";
import secondVideo from "../assets/car_city_sedan.mp4";
import thirdPhoto from "../assets/car_highway_compact.jpg";
import thirdVideo from "../assets/car_highway_compact.mp4";
import fourthPhoto from "../assets/car_highway_suv.jpg";
import fourthVideo from "../assets/car_highway_suv.mp4";
import fifthPhoto from "../assets/car_mixed_sedan.jpg";
import fifthVideo from "../assets/car_mixed_sedan.mp4";
import sixthPhoto from "../assets/car_mixed_truck.jpg";
import sixthVideo from "../assets/car_mixed_truck.mp4";

export const MOCK_DRIVING_MODES: Mode[] = [
  {
    id: 1,
    name: "Городской режим - Компактный",
    description: "Расчет экономии топлива для городского режима движения.",
    imageKey: firstPhoto, // используем imageKey из Mode
    videoKey: firstVideo, // если ваш тип Mode поддерживает videoKey
    baseConsumption: 8.0,
    economyPercent: 5.0,
    drivingType: "city",
    price: 55.0, // добавлено для согласования с Mode
    createdAt: new Date().toISOString().split('T')[0], // добавлено для согласования с Mode
  },
  {
    id: 2,
    name: "Городской режим - Седан",
    description: "Расчет экономии топлива для городского режима на седанах.",
    imageKey: secondPhoto,
    videoKey: secondVideo,
    baseConsumption: 10.0,
    economyPercent: 5.0,
    drivingType: "city",
    price: 55.0,
    createdAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 3,
    name: "Трасса - Компактный",
    description: "Расчет экономии топлива для трассы на компактных автомобилях.",
    imageKey: thirdPhoto,
    videoKey: thirdVideo,
    baseConsumption: 6.0,
    economyPercent: 15.0,
    drivingType: "highway",
    price: 62.5,
    createdAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 4,
    name: "Трасса - Внедорожник",
    description: "Расчет экономии топлива для трассы на внедорожниках.",
    imageKey: fourthPhoto,
    videoKey: fourthVideo,
    baseConsumption: 12.0,
    economyPercent: 15.0,
    drivingType: "highway",
    price: 62.5,
    createdAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 5,
    name: "Смешанный режим - Седан",
    description: "Расчет экономии топлива для смешанного режима движения.",
    imageKey: fifthPhoto,
    videoKey: fifthVideo,
    baseConsumption: 9.0,
    economyPercent: 10.0,
    drivingType: "mixed",
    price: 58.0,
    createdAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 6,
    name: "Смешанный режим - Грузовой",
    description: "Расчет экономии топлива для смешанного режима на грузовых автомобилях.",
    imageKey: sixthPhoto,
    videoKey: sixthVideo,
    baseConsumption: 15.0,
    economyPercent: 10.0,
    drivingType: "mixed",
    price: 58.0,
    createdAt: new Date().toISOString().split('T')[0],
  },
];  

// Заглушка для корзины, если используется
export const MOCK_CART = {
  has_draft: true,
  modes_count: 2, // поменяли на modes_count, как в вашем типе
  incomplete_items_count: 0,
  consumption_id: 1, // поменяли на consumption_id
};

// Функции для работы с mock-данными (для демонстрации)
export function getMockMode(id: number): Mode | undefined {
  return MOCK_DRIVING_MODES.find((m) => m.id === id);
}

export function filterMockModesByName(name: string): Mode[] {
  const t = name.trim().toLowerCase();
  if (!t) return [...MOCK_DRIVING_MODES];
  return MOCK_DRIVING_MODES.filter((m) => m.name.toLowerCase().includes(t));
}

// Функция добавления в корзину (заглушка)
export async function addModeToMockCart(
  modeId: number,
): Promise<{ ok: true } | { ok: false; message?: string }> {
  void modeId;
  await new Promise((r) => setTimeout(r, 200)); // имитация задержки
  return { ok: true };
}

// Заглушка для деталей заявки (если понадобится)

export const MOCK_FUEL_CONSUMPTION_DETAIL: FuelConsumptionDetailResponse = {
  consumption: {
    consumption_id: 1,
    status: "черновик",
    created_at: new Date().toISOString(),
    creator_login: "demo",
    incomplete_items_count: 0,
    origin: "Москва",
    destination: "Санкт-Петербург",
    fuel_price: 55.0,
    total_saved: 0, // ✅ ДОБАВЛЕНО
  },
  modes: [
    {
      id: 1,
      mode_id: 1,
      mode_name: "Городской режим - Компактный",
      base_consumption: 8.0,
      economy_percent: 5.0,
      image_key: "",
      route_distance: 300,
      fuel_saved: 120.5,
    },
    {
      id: 2,
      mode_id: 3,
      mode_name: "Трасса - Компактный",
      base_consumption: 6.0,
      economy_percent: 15.0,
      image_key: "",
      route_distance: 300,
      fuel_saved: 270.0,
    },
  ],
};