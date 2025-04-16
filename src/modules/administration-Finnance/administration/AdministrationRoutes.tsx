import React from "react";
import { Routes, Route } from "react-router-dom";
import ExampleAdministrationPage from "./pages/ExampleAdministrationPage";
import NotFound from "@/pages/NotFound";
import Employer from "./pages/employers/employe";
import UserProfile from "./pages/employers/UserProfile";
import AddEmployeForm from "./pages/employers/ajouter_employe";
import EditEmployeForm from "./pages/employers/editer_employe";
import AddPartnerForm from "./pages/partenaires/ajouter_partenaire";
import AdministrationLayout from "./pages/administrationLayout";
import ModernPartenaireGrid from "./pages/partenaires/partenaire";
import ModernPartnerProfile from "./pages/partenaires/PartnerProfile";
import EditPartnerForm from "./pages/partenaires/editer_partenaire";
import Contrats from "./pages/contrats/contrats";
import InfoContract from "./pages/contrats/info_contrats";
import NouveauContrat from "./pages/contrats/NouveauContrat";
import AjoutAvenant from "./pages/contrats/AjoutAvenant";
import EditerContrat from "./pages/contrats/editerContrat";
import DocumentDirectory from "./pages/documents/documents";
import AddDocumentPage from "./pages/documents/AddDocumentPage";
import DemandesAnnuaire from "./pages/demandes/demandes";
import DemandesPage from "./pages/demandes/info_demandes";
import NouvelleDemandePage from "./pages/demandes/nouveau";
import ModifierDemandePage from "./pages/demandes/modifier_demande";
const AdministrationRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ExampleAdministrationPage />} />
      {/* Routes /employers */}
      <Route path="/employers" element={<AdministrationLayout />}>
        <Route index element={<Employer />} />
        <Route path="nouvel_employer" element={<AddEmployeForm />} />
        <Route path="profil/:id" element={<UserProfile />} />
        <Route path=":id/editer" element={<EditEmployeForm />} />
      </Route>
      {/* Routes /epartenaires */}
      <Route path="/partenaires" element={<AdministrationLayout />}>
        <Route index element={<ModernPartenaireGrid />} />
        <Route path="ajouter" element={<AddPartnerForm />} />
        <Route path="profil/:id" element={<ModernPartnerProfile />} />
        <Route path=":id/editer" element={<EditPartnerForm />} />
      </Route>
      <Route path="/contrats" element={<AdministrationLayout />}>
        <Route index element={<Contrats />} />
        <Route path="details/:id" element={<InfoContract />} />
        <Route path="nouveau_contrat" element={<NouveauContrat />} />
        <Route path=":id/editer" element={<EditerContrat />} />
        <Route path=":id/ajouter_avenant" element={<AjoutAvenant />} />
      </Route>
      <Route path="/demandes" element={<AdministrationLayout />}>
        <Route index element={<DemandesAnnuaire />} />
        <Route path=":id" element={<DemandesPage />} />
        <Route path="nouvelle" element={<NouvelleDemandePage />} />
        <Route path=":id/editer" element={<ModifierDemandePage />} />
      </Route>
      <Route path="/documents" element={<AdministrationLayout />}>
        <Route index element={<DocumentDirectory />} />
        <Route path="nouveau" element={<AddDocumentPage />} />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default AdministrationRoutes;
