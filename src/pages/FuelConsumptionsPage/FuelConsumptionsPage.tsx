// src/pages/FuelConsumptionsPage/FuelConsumptionsPage.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Table, Button, Form } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchFuelConsumptionsList,
  finishFuelConsumptionApplication,
  setListFilters,
} from "../../store/slices/FuelConsumptionSlice";
import { ROUTES } from "../../Routes";
import "./FuelConsumptionsPage.css";

// 🔹 Расширяем тип для поддержки поля от бэкенда
interface ExtendedFuelConsumptionJSON {
  consumption_id?: number;
  status?: string;
  creator_login?: string;
  created_at?: string;
  origin?: string;
  destination?: string;
  fuel_price?: number;
  total_saved?: number;
  moderator_login?: string | null;
  // 🔹 Поддержка обоих имён поля для количества режимов
  modes_count?: number;
  fuel_entries_count?: number;
}

function statusLabel(s: string | undefined): string {
  const m: Record<string, string> = {
    "черновик": "Черновик",
    "сформирован": "Сформирована",
    "завершён": "Завершена",
    "отклонен": "Отклонена",
  };
  return s ? (m[s] ?? s) : "—";
}

// 🔹 Геттер для количества режимов: поддерживает оба имени поля
function getModesCount(row: ExtendedFuelConsumptionJSON): number {
  // Пробуем modes_count → fuel_entries_count → 0
  if (row.modes_count !== undefined && row.modes_count !== null) return row.modes_count;
  if (row.fuel_entries_count !== undefined && row.fuel_entries_count !== null) return row.fuel_entries_count;
  return 0;
}

// 🔹 Геттер для экономии
function getTotalSaved(row: ExtendedFuelConsumptionJSON): number {
  return row.total_saved ?? 0;
}

export default function FuelConsumptionsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isModerator, login } = useAppSelector((s) => s.user);
  const { list, listLoading, listError, filters, itemMutationLoading } = useAppSelector(
      (s) => s.fuelConsumption,
  );

  const [creatorFilter, setCreatorFilter] = useState("");
  const [draftFrom, setDraftFrom] = useState(filters.fromDate);
  const [draftTo, setDraftTo] = useState(filters.toDate);
  const [draftStatus, setDraftStatus] = useState(filters.status);

  useEffect(() => {
    setDraftFrom(filters.fromDate);
    setDraftTo(filters.toDate);
    setDraftStatus(filters.status);
  }, [filters.fromDate, filters.toDate, filters.status]);

  const load = useCallback(() => {
    void dispatch(fetchFuelConsumptionsList());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.SIGN_IN, { replace: true });
      return;
    }
    load();

    // 🔹 Слушаем событие обновления корзины
    const handleCartUpdate = () => {
      console.log("🔄 [FuelConsumptionsPage] Получено событие обновления");
      load();
    };

    window.addEventListener("fuel-consumption-cart-updated", handleCartUpdate);
    return () => {
      window.removeEventListener("fuel-consumption-cart-updated", handleCartUpdate);
    };
  }, [isAuthenticated, navigate, load]);

  // 🔹 Логирование для отладки
  useEffect(() => {
    console.log("📊 [FuelConsumptionsPage] list:", list);
    if (list.length > 0) {
      console.log("📊 Первая заявка:", list[0]);
      console.log("📊 modes_count:", list[0].modes_count);
      console.log("📊 fuel_entries_count:", (list[0] as any).fuel_entries_count);
    }
  }, [list]);

  const visible = useMemo(() => {
    const q = creatorFilter.trim().toLowerCase();
    if (!q) return list;
    return list.filter((a: any) => (a.creator_login ?? "").toLowerCase().includes(q));
  }, [list, creatorFilter]);

  const handleApplyFilters = () => {
    dispatch(
        setListFilters({
          fromDate: draftFrom,
          toDate: draftTo,
          status: draftStatus,
        }),
    );
    void dispatch(fetchFuelConsumptionsList());
  };

  const goToFuelConsumption = (id: number | undefined) => {
    if (id != null) navigate(`/fuel-consumption/${id}`);
  };

  if (!isAuthenticated) return null;

  return (
      <div className="fuel-consumptions-page">
        <div className="fuel-consumptions-page__inner">
          <h1 className="fuel-consumptions-page__heading">
            {isModerator ? "🛡️ Заявки (модератор)" : "👤 Мои заявки"}
            {login && <span className="heading-subtitle"> ({login})</span>}
          </h1>

          {!isModerator && (
              <div className="fuel-consumptions-page__hint">
                <small>Отображаются только ваши заявки</small>
              </div>
          )}

          <section className="fuel-consumptions-page__filters">
            <div className="fuel-consumptions-page__filter-row">
              <Form.Group className="fuel-consumptions-page__fg">
                <Form.Label>С даты</Form.Label>
                <Form.Control type="date" value={draftFrom} onChange={(e) => setDraftFrom(e.target.value)} title="Показать заявки, созданные ПОЗЖЕ или в этот день" />
              </Form.Group>
              <Form.Group className="fuel-consumptions-page__fg">
                <Form.Label>По дату</Form.Label>
                <Form.Control type="date" value={draftTo} onChange={(e) => setDraftTo(e.target.value)} title="Показать заявки, созданные РАНЬШЕ или в этот день" />
              </Form.Group>
              <Form.Group className="fuel-consumptions-page__fg">
                <Form.Label>Статус</Form.Label>
                <Form.Select value={draftStatus} onChange={(e) => setDraftStatus(e.target.value)}>
                  <option value="">Все</option>
                  <option value="черновик">Черновик</option>
                  <option value="сформирован">Сформирована</option>
                  <option value="завершён">Завершена</option>
                  <option value="отклонен">Отклонена</option>
                </Form.Select>
              </Form.Group>
              {isModerator && (
                  <Form.Group className="fuel-consumptions-page__fg fuel-consumptions-page__fg--grow">
                    <Form.Label>Создатель</Form.Label>
                    <Form.Control type="text" value={creatorFilter} onChange={(e) => setCreatorFilter(e.target.value)} placeholder="Часть логина" />
                  </Form.Group>
              )}
            </div>
            <Button className="fuel-consumptions-page__apply" onClick={handleApplyFilters}>Применить фильтры</Button>
          </section>

          {listError && <div className="fuel-consumptions-page__error">{listError}</div>}

          {listLoading && visible.length === 0 ? (
              <div className="fuel-consumptions-page__loader"><Spinner animation="border" /></div>
          ) : null}

          <div className="fuel-consumptions-page__table-wrap">
            <Table striped bordered hover responsive className="fuel-consumptions-page__table">
              <thead>
              <tr>
                <th>ID</th>
                <th>Статус</th>
                <th>Создатель</th>
                <th>Создана</th>
                <th>Режимов</th>
                <th>Экономия</th>
                {isModerator && <th>Модератор</th>}
                {isModerator && <th>Действия</th>}
              </tr>
              </thead>
              <tbody>
              {visible.map((row: any) => {
                const id = row.consumption_id;
                const finKey = id != null ? `finish-${id}` : "";
                const finBusy = finKey ? Boolean(itemMutationLoading[finKey]) : false;

                // 🔹 Используем геттеры для надёжного получения значений
                const modesCount = getModesCount(row);
                const totalSaved = getTotalSaved(row);

                return (
                    <tr key={id ?? Math.random()}>
                      <td>
                        <button type="button" className="fuel-consumptions-page__linkish" onClick={() => goToFuelConsumption(id)}>
                          {id}
                        </button>
                      </td>
                      <td>{statusLabel(row.status)}</td>
                      <td>{row.creator_login ?? "—"}</td>
                      <td>{row.created_at ? new Date(row.created_at).toLocaleString("ru-RU") : "—"}</td>
                      {/* 🔹 Используем геттер для количества режимов */}
                      <td>{modesCount}</td>
                      {/* 🔹 Используем геттер для экономии */}
                      <td>{totalSaved.toFixed(2)} ₽</td>
                      {isModerator && <td>{row.moderator_login ?? "—"}</td>}
                      {isModerator && (
                          <td>
                            {row.status === "сформирован" && id != null ? (
                                <div className="fuel-consumptions-page__actions">
                                  <Button size="sm" variant="success" className="me-1" disabled={finBusy} onClick={() => void dispatch(finishFuelConsumptionApplication({ consumptionId: id, status: "завершён" }))}>✅ Завершить</Button>
                                  <Button size="sm" variant="danger" disabled={finBusy} onClick={() => void dispatch(finishFuelConsumptionApplication({ consumptionId: id, status: "отклонён" }))}>❌ Отклонить</Button>
                                </div>
                            ) : "—"}
                          </td>
                      )}
                    </tr>
                );
              })}
              </tbody>
            </Table>
          </div>

          {!listLoading && visible.length === 0 && (
              <p className="fuel-consumptions-page__empty">Нет заявок по текущим условиям.</p>
          )}
        </div>
      </div>
  );
}