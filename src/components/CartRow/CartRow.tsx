// src/components/ApplicationRow/ApplicationRow.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFuelConsumptionCart, type FuelConsumptionCart } from "../../modules/modeApi"; // замените на ваш путь к API
import { MOCK_CART } from "../../modules/mock";
import cartIcon from "../../assets/logo.png"; // используем ваш логотип
import "./CartRow.css";

export default function ApplicationRow() {
    const [cart, setCart] = useState<FuelConsumptionCart>(MOCK_CART);
    const [loading, setLoading] = useState(true);

    // ✅ Запрос к бэкенду при монтировании
    useEffect(() => {
        let cancelled = false;

        getFuelConsumptionCart() // замените на реальный вызов API
            .then(data => {
                if (!cancelled) {
                    setCart(data);
                    setLoading(false);
                }
            })
            .catch(() => {
                // Fallback на моки при ошибке сети
                if (!cancelled) {
                    setCart(MOCK_CART);
                    setLoading(false);
                }
            });

        return () => { cancelled = true; };
    }, []);

    // Пока грузим — показываем заглушку
    if (loading) {
        return (
            <div className="cart-badge cart-loading" role="status" aria-label="Загрузка заявки">
                <img src={cartIcon} alt="Заявка" className="cart-icon" />
                <span className="cart-count">…</span>
            </div>
        );
    }

    const inner = (
        <>
            <img src={cartIcon} alt="Заявка" className="cart-icon" />
            <span className="cart-count" aria-label={`Режимов в заявке: ${cart.modes_count}`}>
        {cart.modes_count}
      </span>
        </>
    );

    // ✅ Если есть активная заявка и режимы — ссылка ведёт на неё
    if (cart.consumption_id != null && cart.modes_count > 0) {
        return (
            <div className="cart-badge" role="navigation" aria-label="Перейти к заявке">
                <Link to={`/fuelconsumption/${cart.consumption_id}`}>
                    {inner}
                </Link>
            </div>
        );
    }

    // ✅ Если заявка пуста — иконка неактивна
    return (
        <div className="cart-badge cart-inactive" role="navigation" aria-label="Заявка пуста">
            <Link to="#!" onClick={(e) => e.preventDefault()}>
                {inner}
            </Link>
        </div>
    );
}