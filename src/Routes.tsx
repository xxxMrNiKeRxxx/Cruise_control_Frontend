// src/Routes.ts

export const ROUTES = {
  MAIN: "/",
  MODES: "/",
  MODE_DETAIL: "/mode/:id",
  FUEL_CONSUMPTION: "/fuelconsumption/:id",
} as const;

// ✅ Явный тип для TypeScript
export type RouteKey = keyof typeof ROUTES;

// (опционально) для строгой проверки при использовании matchPath:
export const ROUTE_PATHS = {
  MAIN: ROUTES.MAIN,
  MODES: ROUTES.MODES,
  MODE_DETAIL: ROUTES.MODE_DETAIL,
  FUEL_CONSUMPTION: ROUTES.FUEL_CONSUMPTION,
} as const;