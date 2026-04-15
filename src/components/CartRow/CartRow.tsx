import "./CartRow.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MOCK_CART } from "../../modules/mock";
import cartIcon from "../../assets/logo.png";


export const ApplicationRow = () => {
  const [cart, setCart] = useState(MOCK_CART);

  useEffect(() => {
    const load = () => setCart({ ...MOCK_CART });
    load();
    // Если у вас есть кастомное событие обновления заявки — используйте его
    // window.addEventListener("fuel-consumption-updated", load);
    // return () => window.removeEventListener("fuel-consumption-updated", load);
  }, []);

  const inner = (
    <>
      <span className="cart-row__icon">📋</span> {/* или иконка из react-icons */}
      <span className="cart-row__text">Режимов в заявке: {cart.modes_count}</span>
    </>
  );

  // Проверяем, есть ли черновик и есть ли режимы
  if (cart.has_draft && cart.modes_count > 0 && cart.consumption_id != null) {
    return (
      <div className="cart-row">
        <Link to={`/fuel-consumption/${cart.consumption_id}`} className="cart-row__link">
          {inner}
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-row">
      <div className="cart-row__inactive">{inner}</div>
    </div>
  );
};