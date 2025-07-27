import React from "react";
import { Routes, Route } from "react-router-dom";
import FinanceComptaGrid from "./finance_compta";
import AddFinanceCompta from "./addFinanceCompta";
import DetailFinanceCompta from "./detailFinanceCompta";
import EditFinanceCompta from "./editFinanceCompta";
import DocFinanceComptabilite from "@/modules/dashboard/pages/administrationFinance/financeComptabilité";
import NotFound from "@/pages/NotFound";
import AdministrationLayout from "../administration/pages/administrationLayout";

const FinanceComptaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DocFinanceComptabilite />} />
      <Route path="/" element={<AdministrationLayout />}>
        <Route path="/finance" element={<FinanceComptaGrid />} />
        <Route path="/finance/nouveau" element={<AddFinanceCompta />} />
        <Route path="/finance/:id/details" element={<DetailFinanceCompta />} />
        <Route path="/finance/:id/modifier" element={<EditFinanceCompta />} />
        <Route path="/comptabilite" element={<FinanceComptaGrid />} />
        <Route path="/comptabilite/nouveau" element={<AddFinanceCompta />} />
        <Route
          path="/comptabilite/:id/modifier"
          element={<EditFinanceCompta />}
        />
        <Route
          path="/comptabilite/:id/details"
          element={<DetailFinanceCompta />}
        />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default FinanceComptaRoutes;
