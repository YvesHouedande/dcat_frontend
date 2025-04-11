import React from "react";
import { Routes, Route } from "react-router-dom";
import ExampleStocksPage from "./Pages/ExampleStocksPage";
import NotFound from "@/pages/NotFound";
import StockLayout from "./Pages/stockLayout";
import AnnuaireProduits from "./Pages/produits";
import AjoutProduit from "./Pages/ajout_produit";

const StocksRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ExampleStocksPage />} />
      <Route path="/produits" element={<StockLayout />}>
        <Route index element={<AnnuaireProduits />} />
        <Route path="nouveau" element={<AjoutProduit />} />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default StocksRoutes;
