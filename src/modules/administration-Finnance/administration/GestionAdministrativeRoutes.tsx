import React from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import AddPartnerForm from "./pages/partenaires/ajouter_partenaire";
import AdministrationLayout from "./pages/administrationLayout";
import ModernPartenaireGrid from "./pages/partenaires/partenaire";
import ModernPartnerProfile from "./pages/partenaires/PartnerProfile";
import EditPartnerForm from "./pages/partenaires/editer_partenaire";
import DocumentDirectory from "./pages/documents/documents";
import AddDocumentPage from "./pages/documents/AddDocumentPage";
import DocumentDetailPage from "./pages/documents/documentDetails";
import EditDocumentPage from "./pages/documents/editDocumentPage";
import GestionAdminstrative from "@/modules/dashboard/pages/administrationFinance/gestionAdminstrative";
import Contrats from "./pages/contrats/contrats";
import NouveauContrat from "./pages/contrats/NouveauContrat";
import InfoContract from "./pages/contrats/info_contrats";
import EditerContrat from "./pages/contrats/editerContrat";
import DossierPage from "./pages/documents/DossierPage";
import DocumentPage from "./pages/documents/documentPage";
import DetailContrat from "./pages/documents/detailContrat";
import EntitesList from "./pages/entites/entites";
import AddEntiteForm from "./pages/entites/ajouter_entite";
import EditEntiteForm from "./pages/entites/editer_entite";
import EntiteProfile from "./pages/entites/EntiteProfile";


const GestionAdministrativeRoutes: React.FC = () => {
  return (

    <Routes>
      <Route path="/" element={<GestionAdminstrative />} />

      {/* Routes /partenaires */}
      <Route path="/partenaires" element={<AdministrationLayout />}>
        <Route index element={<ModernPartenaireGrid />} />
        <Route path="ajouter" element={<AddPartnerForm />} />
        <Route path=":id" element={<ModernPartnerProfile />} />
        <Route path=":id/editer" element={<EditPartnerForm />} />
      </Route>

      {/* Routes /contrats */}
      <Route path="/contrats" element={<AdministrationLayout />}>
        <Route index element={<Contrats />} />
        <Route path=":id" element={<InfoContract />} />
        <Route path="nouveau" element={<NouveauContrat />} />
        <Route path=":id/editer" element={<EditerContrat />} />
      </Route>

      <Route path="/contrats/dossier" element={<AdministrationLayout />}>
        <Route index element={<DossierPage />} />
        <Route path="/contrats/dossier/:id" element={<DocumentPage />} />
        <Route path="/contrats/dossier/detail" element={<DetailContrat />} />
      </Route>

      {/* Routes /documents */}
      <Route path="/documents" element={<AdministrationLayout />}>
        <Route index element={<DocumentDirectory />} />
        <Route path=":id/details" element={<DocumentDetailPage />} />
        <Route path=":id/editer" element={<EditDocumentPage />} />
        <Route path="nouveau" element={<AddDocumentPage />} />
      </Route>

      {/* Routes /entites */}
      <Route path="/entites" element={<AdministrationLayout />}>
        <Route index element={<EntitesList />} />
        <Route path="ajouter" element={<AddEntiteForm />} />
        <Route path=":id" element={<EntiteProfile />} />
        <Route path=":id/editer" element={<EditEntiteForm />} />
      </Route>

      <Route path="/*" element={<NotFound />} />
    </Routes>
    
  );
};

export default GestionAdministrativeRoutes;
