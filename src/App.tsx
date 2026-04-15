import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {ModesPage} from "./pages/ModesPage/ModesPage";
import { ROUTES } from "./Routes";
import ModePage from "./pages/ModePage/ModePage";
import FuelConsumptionPage from "./pages/FuelConsumptionPage/FuelConsumptionPage";
import MainLayout from "./layouts/MainLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index_style.css";
import "./theme-1c.css";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.MODES} element={<ModesPage />} />
          <Route path="/modes" element={<Navigate to="/" replace />} />
          <Route path={ROUTES.MODE} element={<ModePage />} />
          <Route path={ROUTES.FUELCONSUMPTION} element={<FuelConsumptionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
