import { Route, Routes } from "react-router-dom";
import StockLayout from "../stockLayout";
import AchatDashboard from "./pages/Dashboard";

export const LivraisonRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<StockLayout />}>
        <Route index element={<AchatDashboard />} />
      </Route>
    </Routes>
  );
};
