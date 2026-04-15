// src/pages/FuelConsumptionPage.tsx

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fallbackImageUrl,
  resolveMediaUrl,
  type Mode,
  type FuelConsumptionDetailResponse,
  type FuelModeJSON,
} from "../../modules/modeApi";
import {
  MOCK_DRIVING_MODES, // ✅ Используем массив режимов
  MOCK_FUEL_CONSUMPTION_DETAIL,
} from "../../modules/mock";
import "./FuelConsumptionPage.css";

function cloneFuelConsumptionDetail(
  src: FuelConsumptionDetailResponse,
): FuelConsumptionDetailResponse {
  return JSON.parse(JSON.stringify(src)) as FuelConsumptionDetailResponse;
}

export default function FuelConsumptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<FuelConsumptionDetailResponse | null>(null);

  const loadMock = useCallback(() => {
    if (!id) return null;
    const n = Number(id);
    if (n === MOCK_FUEL_CONSUMPTION_DETAIL.consumption.consumption_id) {
      return cloneFuelConsumptionDetail(MOCK_FUEL_CONSUMPTION_DETAIL);
    }
    return null;
  }, [id]);

  useEffect(() => {
    setData(loadMock());
  }, [loadMock]);

  const modes = MOCK_DRIVING_MODES;

  const modeById = useMemo(() => {
    const m = new Map<number, Mode>();
    modes.forEach((d) => m.set(d.id, d)); 
    return m;
  }, [modes]);

  const sortedItems = useMemo(() => {
    if (!data?.modes) return [];
    return [...data.modes].sort((a, b) => a.mode_id - b.mode_id);
  }, [data?.modes]);

  const handleRouteDistanceChange = (mode: FuelModeJSON, value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const newModes = prev.modes.map((row) =>
        row.mode_id === mode.mode_id
          ? {
              ...row,
              route_distance: value === "" ? 0 : Number(value),
            }
          : row
      );
      return { ...prev, modes: newModes };
    });
  };

  const handleDeleteConsumption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("Удалить заявку?")) return;
    navigate("/");
  };

  if (!data) {
    return (
      <div className="fuel-consumption-page">
        <p className="fuel-consumption-not-found">Заявка не найдена.</p>
      </div>
    );
  }

  const consumption = data.consumption;

  return (
    <div className="fuel-consumption-page">
      <div className="fuel-consumption-detail">
        <div className="fuel-consumption-detail__header-card">
          <h1 className="fuel-consumption-detail__title">Заявка на расчёт экономии топлива</h1>
          <div className="fuel-consumption-detail__info">
            {[
              ["ID заявки", consumption.consumption_id],
              ["Количество режимов", data.modes.length],
              ["Статус", consumption.status],
              ["Маршрут", `${consumption.origin} → ${consumption.destination}`],
              ["Цена топлива", `${consumption.fuel_price} ₽/л`],
              ["Общая экономия", `${consumption.total_saved} л`],
            ].map(([label, value]) => (
              <div key={label} className="fuel-consumption-detail__info-item">
                <strong>{label}:</strong> {value}
              </div>
            ))}
          </div>
        </div>

        <div className="app-table-wrapper fuel-consumption-page__table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th className="app-table__col-photo">Фото</th>
                <th className="app-table__col-name">Наименование режима</th>
                <th className="app-table__col-type">Тип движения</th>
                <th className="app-table__col-consumption">Базовое потребление</th>
                <th className="app-table__col-economy">Экономия (%)</th>
                <th className="app-table__col-distance">Расстояние (км)</th>
                <th className="app-table__col-fuel">Экономия (л)</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => {
                const mode = modeById.get(item.mode_id);
                const photoUrl = mode ? resolveMediaUrl(mode.imageKey || "") : fallbackImageUrl();
                return (
                  <tr key={item.mode_id}>
                    <td className="app-table__col-photo">
                      <img src={photoUrl} alt="" className="service-thumb" />
                    </td>
                    <td className="app-table__col-name">{mode?.name ?? `ID ${item.mode_id}`}</td>
                    <td className="app-table__col-type">
                      {mode?.drivingType === "city" && <span className="mode-badge-small city">ГОРОД</span>}
                      {mode?.drivingType === "highway" && <span className="mode-badge-small highway">ТРАССА</span>}
                      {mode?.drivingType === "mixed" && <span className="mode-badge-small mixed">СМЕШАННЫЙ</span>}
                    </td>
                    <td className="app-table__col-consumption">{mode?.baseConsumption} л/100км</td>
                    <td className="app-table__col-economy">{mode?.economyPercent}%</td>
                    <td className="app-table__col-distance">
                      <input
                        type="number"
                        className="distance-input"
                        value={item.route_distance}
                        onChange={(e) => handleRouteDistanceChange(item, e.target.value)}
                        step="1"
                        min="0"
                        placeholder="км"
                      />
                    </td>
                    <td className="app-table__col-fuel">{item.fuel_saved.toFixed(2)} л</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <form className="fuel-consumption-page__delete-form" onSubmit={handleDeleteConsumption}>
          <button type="submit" className="search-btn fuel-consumption-page__delete-btn">
            Удалить заявку
          </button>
        </form>
      </div>
    </div>
  );
}