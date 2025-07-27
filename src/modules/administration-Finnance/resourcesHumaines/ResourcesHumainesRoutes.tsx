import React from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import AdministrationLayout from "../administration/pages/administrationLayout";
import UserProfile from "./employers/UserProfile";
import EditEmployeForm from "./employers/editer_employe";
import Employer from "./employers/employe";
import ResourcesHumaines from "@/modules/dashboard/pages/administrationFinance/resourcesHumaines";
import AddDocumentPage from "../administration/pages/documents/AddDocumentPage";
import DemandesAnnuaire from "./demandes/demandes";
import ModifierDemandePage from "./demandes/modifier_demande";
import NouvelleDemandePage from "./demandes/nouveau";
import DemandeDetailPage from "./demandes/info_demandes";

const ResourcesHumainesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ResourcesHumaines />} />
      {/* Routes /employers */}
      <Route path="/employes" element={<AdministrationLayout />}>
        <Route index element={<Employer />} />
        <Route path=":id" element={<UserProfile />} />
        <Route path=":id/ajouter-document" element={<AddDocumentPage />} />
        <Route path=":id/editer" element={<EditEmployeForm />} />
      </Route>
      <Route path="/demandes" element={<AdministrationLayout />}>
        <Route index element={<DemandesAnnuaire />} />
        <Route path=":id" element={<DemandeDetailPage />} />
        <Route path="nouvelle" element={<NouvelleDemandePage />} />
        <Route path=":id/modifier" element={<ModifierDemandePage />} />
      </Route>

      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default ResourcesHumainesRoutes;
