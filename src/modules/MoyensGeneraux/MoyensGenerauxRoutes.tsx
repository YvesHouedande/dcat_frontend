import React from "react";
import { Routes, Route } from "react-router-dom";
import MoyensGenerauxLayout from "./Layout";
import MoyenGeneraux from "./MoyenGeneraux";
import NotFound from "@/pages/NotFound";
import EquipementAddPage from "./EquipementsOutils/pages/EquipementAddPage";
import EquipementDetail from "./EquipementsOutils/pages/equimentDetail.tsx";
import EquipementPage from "./EquipementsOutils/pages/Equipementpage.tsx";
import EquipementEdit from "./EquipementsOutils/pages/equipementEdit.tsx";
import ExemplairesManager from "./EquipementsOutils/pages/ExemplairesPage.tsx";

const MoyenGenerauxgRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MoyenGeneraux />} />
      <Route path="/equipement-outils" element={<MoyensGenerauxLayout/>}>
        <Route index element={<EquipementPage />} />
        <Route path=":id" element={<EquipementDetail />} />
        <Route path=":id/edit" element={<EquipementEdit />} />
        <Route path="nouveau" element={<EquipementAddPage />} />
        <Route path="examplaires" element={<ExemplairesManager />} />
      </Route>
      <Route path="/maitenance-entretients" element={<MoyensGenerauxLayout/>}>
        <Route index element={<MoyenGeneraux />} />
      </Route>
      <Route path="/historique" element={<MoyensGenerauxLayout/>}>
        <Route index element={<MoyenGeneraux />} />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default MoyenGenerauxgRoutes;
