import React from "react";
import { Routes, Route } from "react-router-dom";
import FinanceComptaGrid from "./finance_compta";
import AddFinanceCompta from "./addFinanceCompta";
import DetailFinanceCompta from "./detailFinanceCompta";
import EditFinanceCompta from "./editFinanceCompta";

const FinanceComptaRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Route principale avec type (finance ou comptabilite) */}
      <Route path="/:type" element={<FinanceComptaGrid />} />
      
      {/* Route pour ajouter un document */}
      <Route path="/:type/nouveau" element={<AddFinanceCompta />} />
      
      {/* Route pour voir les détails d'un document */}
      <Route path="/:type/:id/details" element={<DetailFinanceCompta />} />
      
      {/* Route pour modifier un document */}
      <Route path="/:type/:id/modifier" element={<EditFinanceCompta />} />
    </Routes>
  );
};

export default FinanceComptaRoutes; 