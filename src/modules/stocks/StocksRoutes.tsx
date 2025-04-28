import React from "react";
import { Routes, Route } from "react-router-dom";
// import ExemplairesManager from "./pages/ExemplairesPage";
import NotFound from "@/pages/NotFound";
import StockLayout from "./pages/stockLayout";
import CataloguePage from "./reference/pages/cataloguePage";
import ReferencePage from "./reference/pages/referencePage";
import ReferenceRegistrationForm from "./reference/pages/referenceRegistration";
import ReferenceEditForm from "./reference/pages/referenceEdit";
import LivraisonPage from "./livraison/pages/LivraisonPage";
import { ExemplaireApp } from "./examplaire";

const StocksRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<StockLayout />} />
      <Route path="/references" element={<StockLayout />}>
        <Route index element={<CataloguePage />} />
        <Route path="nouveau" element={<ReferenceRegistrationForm />} />
        <Route path=":id" element={<ReferencePage />} />
        <Route path=":id/edit" element={<ReferenceEditForm />} />
      </Route>
      <Route path="/achats" element={<StockLayout />}>
        <Route index element={<LivraisonPage />} />{" "}
      </Route>
      <Route path="/examplaires" element={<StockLayout />}>
        <Route index element={<ExemplaireApp/>} />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default StocksRoutes;
