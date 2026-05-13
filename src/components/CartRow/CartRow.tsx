// src/components/CartRow/CartRow.tsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFuelConsumptionCart } from "../../store/slices/FuelConsumptionSlice";
import cartIcon from "../../assets/logo.png";
import "./CartRow.css";

export default function ApplicationRow() {
    console.log("🟢 [ApplicationRow] Компонент смонтирован");

    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((s) => s.user);
    const { cart, cartLoading } = useAppSelector((s) => s.fuelConsumption);

    // 🔹 Загружаем заявку при монтировании И при смене статуса авторизации
    useEffect(() => {
        console.log("📡 [ApplicationRow] useEffect: isAuthenticated =", isAuthenticated);

        void dispatch(fetchFuelConsumptionCart())
            .then((result) => {
                console.log("✅ [ApplicationRow] Запрос завершён. Результат:", result);
            })
            .catch((e) => console.error("❌ [ApplicationRow] Ошибка в thunk:", e));

    }, [dispatch, isAuthenticated]);

    // 🔹 Слушаем кастомное событие обновления заявки
    useEffect(() => {
        const handleCartUpdate = () => {
            console.log("🔄 [ApplicationRow] Получено событие fuel-consumption-cart-updated");
            void dispatch(fetchFuelConsumptionCart());
        };

        window.addEventListener("fuel-consumption-cart-updated", handleCartUpdate);
        return () => {
            console.log("🧹 [ApplicationRow] Удаляем слушатель события");
            window.removeEventListener("fuel-consumption-cart-updated", handleCartUpdate);
        };
    }, [dispatch]);

    // 🔹 Извлекаем данные с защитой от невалидных значений
    const count = isAuthenticated ? (cart?.modes_count ?? 0) : 0;

    // ✅ Ключевое исправление: id=0 считаем "нет черновика", только id>0 — валидный
    const validId = (cart?.consumption_id != null && cart.consumption_id > 0) ? cart.consumption_id : undefined;
    const hasDraft = isAuthenticated && Boolean(validId);

    // 🔹 🔥 НОВОЕ: Заявка активна ТОЛЬКО если это черновик


    // 🔹 Финальное условие: все факторы должны быть истинными + статус "черновик"
    // В CartRow.tsx, условие isActive:

// 🔹 Заявка активна ТОЛЬКО если это ЧЕРНОВИК
    const isDraft = cart?.has_draft !== false && (cart?.status === "черновик" || !cart?.status);

// 🔹 Финальное условие
    const isActive = isAuthenticated && hasDraft && count > 0 && validId != null && isDraft;

    // 🔥 Отладочный вывод ВСЕХ условий в консоль
    useEffect(() => {
        console.group("🔍 ApplicationRow: проверка условий");
        console.log("  isAuthenticated:", isAuthenticated);
        console.log("  cart:", cart);
        console.log("  count (modes_count):", count);
        console.log("  validId (consumption_id>0?):", validId);
        console.log("  hasDraft:", hasDraft);
        console.log("  isDraft (status check):", isDraft);
        console.log("  ✅ isActive:", isActive);
        console.groupEnd();
    }, [isAuthenticated, cart, count, validId, hasDraft, isDraft, isActive]);

    const inner = (
        <>
            <img src={cartIcon} alt="Заявка" className="cart-icon" />
            <span className="cart-count" aria-label={`Режимов в заявке: ${count}`}>
        {count}{cartLoading ? "…" : ""}
      </span>
        </>
    );

    // 🔹 Рендер активной ссылки (только для черновиков!)
    if (isActive) {
        console.log("🟢 Рендер: АКТИВНАЯ ссылка → /fuel-consumption/", validId);
        return (
            <div className="cart-badge" role="navigation" aria-label="Перейти к заявке">
                <Link to={`/fuel-consumption/${validId}`} className="cart-link">
                    {inner}
                </Link>
            </div>
        );
    }

    // 🔹 Рендер неактивной иконки
    console.log("🔴 Рендер: НЕАКТИВНАЯ иконка (условия не выполнены)");
    return (
        <div className="cart-badge cart-inactive" role="navigation" aria-label="Заявка пуста">
            <Link to="#!" onClick={(e) => e.preventDefault()} tabIndex={-1} aria-disabled="true">
                {inner}
            </Link>
        </div>
    );
}