import React from "react";
import { Routes, Route } from "react-router-dom";
import ExampleAdministrationPage from "./pages/ExampleAdministrationPage";
import NotFound from "@/pages/NotFound";
import AdministrationLayout from "./pages/administrationLayout";
import Contrats from "./pages/contrats/contrats";
import InfoContract from "./pages/contrats/info_contrats";
import NouveauContrat from "./pages/contrats/NouveauContrat";
import EditerContrat from "./pages/contrats/editerContrat";
import DocumentDirectory from "./pages/documents/documents";
import AddDocumentPage from "./pages/documents/AddDocumentPage";
import DocumentDetailPage from "./pages/documents/documentDetails";
import EditDocumentPage from "./pages/documents/editDocumentPage";
import FinanceComptaRoutes from "../finance_compta/FinanceComptaRoutes";

const AdministrationRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ExampleAdministrationPage />} />

      {/* Routes /contrats */}
      <Route path="/contrats" element={<AdministrationLayout />}>
        <Route index element={<Contrats />} />
        <Route path=":id/details" element={<InfoContract />} />
        <Route path="nouveau" element={<NouveauContrat />} />
        <Route path=":id/editer" element={<EditerContrat />} />
      </Route>

      {/* Routes /documents */}
      <Route path="/documents" element={<AdministrationLayout />}>
        <Route index element={<DocumentDirectory />} />
        <Route path=":id/details" element={<DocumentDetailPage />} />
        <Route path=":id/editer" element={<EditDocumentPage />} />
        <Route path="nouveau" element={<AddDocumentPage />} />
      </Route>
      {/* Routes /finance-compta (unifié) */}
      <Route path="/finance-compta/*" element={<AdministrationLayout />}>
        <Route path="*" element={<FinanceComptaRoutes />} />
      </Route>
      
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default AdministrationRoutes;
