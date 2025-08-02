import React from "react";
import { Routes, Route } from "react-router-dom";
// import ExemplairesManager from "./pages/ExemplairesPage";
import NotFound from "@/pages/NotFound";
import StockLayout from "./stockLayout";
import CataloguePage from "./reference/pages/cataloguePage";
import ReferenceEditForm from "./reference/pages/referenceEdit";
import LivraisonPage from "./livraison/pages/LivraisonPage";
import GestionStock from "../dashboard/pages/gestionDesStocks/gestionStock";
import EntreeDashboard from "./entree/pages/Dashboard";

const StocksRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<GestionStock />} />
      <Route path="/creation-reference-produit/" element={<StockLayout />}>
        <Route index element={<CataloguePage />} />
        <Route path="nouveau" element={<ReferenceEditForm />} />
        <Route path=":id" element={<ReferenceEditForm />} />
        <Route path=":id/edit" element={<ReferenceEditForm />} />
      </Route>
      <Route path="/entrees" element={<StockLayout />}>
        <Route index element={<EntreeDashboard />} />
      </Route>
      <Route path="/achats" element={<StockLayout />}>
        <Route index element={<LivraisonPage />} />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default StocksRoutes;
