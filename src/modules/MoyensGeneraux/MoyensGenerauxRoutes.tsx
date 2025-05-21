import React from "react";
import { Routes, Route } from "react-router-dom";
import MoyensGenerauxLayout from "./Layout";
import MoyenGeneraux from "./MoyenGeneraux";
import NotFound from "@/pages/NotFound";
import ProductRegistrationForm from "./Outils/pages/referenceRegistration.tsx";
import ReferencePage from "./Outils/pages/referencePage.tsx";
import CataloguePage from "./Outils/pages/cataloguePage.tsx";
import ReferenceEditForm from "./Outils/pages/referenceRegistration.tsx";
import EntreeSortie from "./Outils/pages/EntreeSortie.tsx";
import { MoyensDesTravailPage } from "./Outils/moyens_de_travail/pages/MoyensDesTravailPage.tsx";
import { MaintenancePage } from "./Maintenance/pages/MaintenancePage.tsx";
const MoyenGenerauxgRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MoyenGeneraux />} />
      <Route path="/outils" element={<MoyensGenerauxLayout />}>
        <Route index element={<CataloguePage />} />
        <Route path=":id" element={<ReferencePage />} />
        <Route path=":id/edit" element={<ReferenceEditForm />} />
        <Route path="nouveau" element={<ProductRegistrationForm />} />
        <Route path="sorties" element={<EntreeSortie />} />
      </Route>
      <Route path="/maitenance-entretients" element={<MoyensGenerauxLayout />}>
        <Route index element={<MaintenancePage />} />
      </Route>
      <Route
        path="/Equipements-moyens-travail"
        element={<MoyensGenerauxLayout />}
      >
        <Route index element={<MoyensDesTravailPage />} />
      </Route>
      <Route path="/historique" element={<MoyensGenerauxLayout />}>
        <Route index element={<MoyenGeneraux />} />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default MoyenGenerauxgRoutes;
