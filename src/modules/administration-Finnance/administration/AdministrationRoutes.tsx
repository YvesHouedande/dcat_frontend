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
import EditerContrat from "./pages/contrats/editerContrat";
import DocumentDirectory from "./pages/documents/documents";
import AddDocumentPage from "./pages/documents/AddDocumentPage";
import DemandesAnnuaire from "./pages/demandes/demandes";
import NouvelleDemandePage from "./pages/demandes/nouveau";
import ModifierDemandePage from "./pages/demandes/modifier_demande";
import AddFinance from "../finance/addFinance";
import FinanceGrid from "../finance/finances";
import DocumentDetailPage from "./pages/documents/documentDetails";
import FinanceDetailPage from "../finance/detailFinance";
import EditFinance from "../finance/editFinance";
import EditDocumentPage from "./pages/documents/editDocumentPage";
import AddComptabilite from "../comptabilite/addComptabilite";
import ComptabiliteGrid from "../comptabilite/comptabilite";
import ComptabiliteDetailPage from "../comptabilite/detailComptabilite";
import EditComptabilite from "../comptabilite/editComptabilite";
import DemandeDetailPage from "./pages/demandes/info_demandes";
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
      {/* Routes /finance */}
      <Route path="/finance" element={<AdministrationLayout />}>
        <Route index element={<FinanceGrid />} />
        <Route path=":id/details" element={<FinanceDetailPage />} />
        <Route path="nouveau" element={<AddFinance />} />
        <Route path=":id/editer" element={<EditFinance />} />
      </Route>
      {/* Routes /comptabilité */}
      <Route path="/comptabilite" element={<AdministrationLayout />}>
        <Route index element={<ComptabiliteGrid />} />
        <Route path=":id/details" element={<ComptabiliteDetailPage />} />
        <Route path="nouveau" element={<AddComptabilite />} />
        <Route path=":id/editer" element={<EditComptabilite />} />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default AdministrationRoutes;


// {
//   "id_partenaire": 24,
//   "nom_partenaire": "Bisko",
//   "telephone_partenaire": "0709749287",
//   "email_partenaire": "kouamekouakou@gmail.com",
//   "specialite": "Conseil",
//   "localisation": "Abidjan",
//   "type_partenaire": "Revendeur",
//   "statut": "Actif",
//   "id_entite": 17,
//   "created_at": "2025-05-22T15:15:07.911Z",
//   "updated_at": "2025-05-22T15:15:07.911Z"
// }