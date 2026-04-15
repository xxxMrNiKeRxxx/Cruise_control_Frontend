export const ROUTES = {
  MODES: "/",
  MODE: "/mode/:id",
  FUELCONSUMPTION: "/fuelconsumption/:id",
};
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  MODES: "Главная",
  MODE: "Компонент",
  FUELCONSUMPTION: "Заявка",
};
