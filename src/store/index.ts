// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import fuelConsumptionReducer from "./slices/FuelConsumptionSlice"; // ✅ Импорт слайса

// 🔹 Настройка хуков для типизации
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    user: userReducer,                    // ✅ Слайс авторизации
    fuelConsumption: fuelConsumptionReducer, // ✅ Слайс заявок (ключ должен быть "fuelConsumption"!)
  },
});

// 🔹 Типы для использования в хуках
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 🔹 Типизированные хуки (используйте их вместо стандартных)
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;