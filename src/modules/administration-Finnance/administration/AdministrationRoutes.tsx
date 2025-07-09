import React from "react";
import { Routes, Route } from "react-router-dom";
import ExampleAdministrationPage from "./pages/ExampleAdministrationPage";
import NotFound from "@/pages/NotFound";
import Employer from "./pages/employers/employe";
import UserProfile from "./pages/employers/UserProfile";
import EditEmployeForm from "./pages/employers/editer_employe";
import AddPartnerForm from "./pages/partenaires/ajouter_partenaire";
import AdministrationLayout from "./pages/administrationLayout";
import ModernPartenaireGrid from "./pages/partenaires/partenaire";
import ModernPartnerProfile from "./pages/partenaires/PartnerProfile";
import EditPartnerForm from "./pages/partenaires/editer_partenaire";
import Contrats from "./pages/contrats/contrats";
import InfoContract from "./pages/contrats/info_contrats";
import NouveauContrat from "./pages/contrats/NouveauContrat";
import EditerContrat from "./pages/contrats/editerContrat";
import DocumentDirectory from "./pages/documents/documents";
import AddDocumentPage from "./pages/documents/AddDocumentPage";
import DemandesAnnuaire from "./pages/demandes/demandes";
import NouvelleDemandePage from "./pages/demandes/nouveau";
import ModifierDemandePage from "./pages/demandes/modifier_demande";
import DocumentDetailPage from "./pages/documents/documentDetails";
import DemandeDetailPage from "./pages/demandes/info_demandes";
import EditDocumentPage from "./pages/documents/editDocumentPage";
import FinanceComptaRoutes from "../finance_compta/FinanceComptaRoutes";

const AdministrationRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ExampleAdministrationPage />} />
      {/* Routes /employers */}
      <Route path="/employers" element={<AdministrationLayout />}>
        <Route index element={<Employer />} />
        <Route path="profil/:id" element={<UserProfile />} />
        <Route path=":id/editer" element={<EditEmployeForm />} />
      </Route>
      {/* Routes /partenaires */}
      <Route path="/partenaires" element={<AdministrationLayout />}>
        <Route index element={<ModernPartenaireGrid />} />
        <Route path="ajouter" element={<AddPartnerForm />} />
        <Route path="profil/:id" element={<ModernPartnerProfile />} />
        <Route path=":id/editer" element={<EditPartnerForm />} />
      </Route>
      {/* Routes /contrats */}
      <Route path="/contrats" element={<AdministrationLayout />}>
        <Route index element={<Contrats />} />
        <Route path=":id/details" element={<InfoContract />} />
        <Route path="nouveau" element={<NouveauContrat />} />
        <Route path=":id/editer" element={<EditerContrat />} />
      </Route>
      {/* Routes /demandes */}
      <Route path="/demandes" element={<AdministrationLayout />}>
        <Route index element={<DemandesAnnuaire />} />
        <Route path=":id/details" element={<DemandeDetailPage />} />
        <Route path="nouvelle" element={<NouvelleDemandePage />} />
        <Route path=":id/editer" element={<ModifierDemandePage />} />
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