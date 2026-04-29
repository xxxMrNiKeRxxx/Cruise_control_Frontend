// src/layouts/MainLayout.tsx

import { Outlet, useLocation, matchPath } from "react-router-dom";
import {AppHeader} from "../components/AppHeader/AppHeader"; // ✅ без .tsx (если настроено)
import { Breadcrumbs, type ICrumb } from "../components/BreadCrumbs/BreadCrumbs";
import { ROUTES } from "../Routes"; // ✅ импорт без .ts
import { getMockMode } from "../modules/mock";

export default function MainLayout() {
  const { pathname } = useLocation();

  const crumbs: ICrumb[] = (() => {
    // Главная / Список режимов
    if (pathname === ROUTES.MAIN) {
      return [{ label: "Режимы", to: ROUTES.MODES }];
    }

    // Детальная страница режима
    const modeMatch = matchPath(ROUTES.MODE_DETAIL, pathname);
    if (modeMatch?.params.id) {
      const mode = getMockMode(Number(modeMatch.params.id));
      const title = mode?.mode_name ?? `Режим ${modeMatch.params.id}`;
      return [
        { label: "Режимы", to: ROUTES.MODES },
        { label: title },
      ];
    }

    // Страница заявки
    const applicationMatch = matchPath(ROUTES.FUEL_CONSUMPTION, pathname);
    if (applicationMatch?.params.id) {
      const appId = applicationMatch.params.id;
      const appTitle = appId ? `Заявка №${appId}` : "Заявка";
      return [
        { label: "Режимы", to: ROUTES.MODES },
        { label: appTitle },
      ];
    }

    // Fallback
    return [{ label: "Режимы", to: ROUTES.MODES }, { label: "Страница" }];
  })();

  return (
      <div className="main-layout">
        <AppHeader />
        <Breadcrumbs crumbs={crumbs} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
  );
}