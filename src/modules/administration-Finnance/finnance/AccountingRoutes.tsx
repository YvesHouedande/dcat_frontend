import React from "react";
import { Routes, Route } from "react-router-dom";
import AccountingPage from "@/modules/administration-Finnance/finnance/Pages/AccountingPage";
// import NotFound from '@/pages/NotFound';
import ComptabilitePage from "./Pages/ComptabilitePage";
import FinancePage from "./Pages/FinancePage";
import AddDocumentPage from "./Pages/AddDocumentPage";

const AccountingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AccountingPage />} />
      <Route path="/finance" element={<FinancePage />} />
      <Route path="/comptabilite" element={<ComptabilitePage />} />
      <Route path="/fichier" element={<AddDocumentPage />} />
      {/* <Route path="/*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AccountingRoutes;
