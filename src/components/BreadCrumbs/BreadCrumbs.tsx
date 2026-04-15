import { useEffect, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { getMockMode } from "../../modules/mock";
import { ROUTES } from "../../Routes";
import "./Breadcrumbs.css";


type Crumb = { label: string; to?: string };

export const Breadcrumbs = () => {
  const location = useLocation();
  const { pathname } = location;
  const [modeTitle, setModeTitle] = useState<string | null>(null);

  useEffect(() => {
    // Извлекаем ID из пути /mode/:id
    const pathParts = pathname.split('/');
    if (pathParts[1] === 'mode' && pathParts[2]) {
      const id = Number(pathParts[2]);
      if (!isNaN(id)) {
        const mode = getMockMode(id);
        setModeTitle(mode?.name ?? `Режим ${id}`);
      }
    } else {
      setModeTitle(null);
    }
  }, [pathname]);

  const crumbs: Crumb[] = (() => {
    if (pathname === '/' || pathname === '') {
      return [{ label: 'Главная' }];
    }

    // Для страницы /mode/:id
    if (pathname.startsWith('/mode/')) {
      const title = modeTitle ?? 'Детали режима';
      return [
        { label: 'Главная', to: '/' },
        { label: 'Режимы', to: '/' },
        { label: title },
      ];
    }

    // Для страницы /application (заменяет /cart)
    if (pathname.startsWith('/fuelconsumption/')) {
      const id = pathname.split('/')[2];
      const appId = id ? `№${id}` : 'Заявка';
      return [
        { label: 'Главная', to: '/' },
        { label: `Заявка ${appId}` },
      ];
    }

    // Для других страниц — по умолчанию
    return [{ label: 'Главная', to: '/' }, { label: 'Страница' }];
  })();

  return (
    <nav className="app-breadcrumbs" aria-label="Навигационная цепочка">
      <ol className="app-breadcrumbs__list">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="app-breadcrumbs__item">
              {crumb.to != null && !last ? (
                <Link to={crumb.to} className="app-breadcrumbs__link">
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={last ? 'app-breadcrumbs__current' : undefined}
                  aria-current={last ? 'page' : undefined}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};