import React from "react";
import { Routes, Route } from "react-router-dom";
// import ExemplairesManager from "./pages/ExemplairesPage";
import NotFound from "@/pages/NotFound";
import StockLayout from "./stockLayout";
import CataloguePage from "./reference/pages/cataloguePage";
import ReferencePage from "./reference/pages/referencePage";
import ReferenceEditForm from "./reference/pages/referenceEdit";
import LivraisonPage from "./livraison/pages/LivraisonPage";
import CommandePage from "./commande/pages/commandePage";
import CommandeForm from "./commande/components/CommandeForm";
import CommandeDetails from "./commande/components/CommandeDetails";

const StocksRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<StockLayout />} />
      <Route path="/references" element={<StockLayout />}>
        <Route index element={<CataloguePage />} />
        <Route path="nouveau" element={<ReferenceEditForm />} />
        <Route path=":id" element={<ReferencePage />} />
        <Route path=":id/edit" element={<ReferenceEditForm />} />
      </Route>
      <Route path="/achats" element={<StockLayout />}>
        <Route index element={<LivraisonPage />} />
      </Route>
      <Route path="/commandes" element={<StockLayout />}>
        <Route index element={<CommandePage />} />
        <Route path="nouvelle" element={<CommandeForm />} />
        <Route path=":id" element={<CommandeDetails />} />
        <Route path=":id/modifier" element={<CommandeForm />} />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default StocksRoutes;
