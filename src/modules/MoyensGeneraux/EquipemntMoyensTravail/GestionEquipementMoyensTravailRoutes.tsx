import GestionEquipement from "@/modules/dashboard/pages/moyensGeneraux/gestionEquipement";
import { Route, Routes } from "react-router-dom";
import { MaintenancePage } from "./Maintenance/pages/MaintenancePage";
import MoyensGenerauxLayout from "../Layout";
import { MoyensDesTravailPage } from "./moyens_de_travail/pages/MoyensDesTravailPage";

function GestionEquipementMoyensTravailRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GestionEquipement />} />
      <Route path="/equipements/" element={<MoyensGenerauxLayout />}>
        <Route index element={<MoyensDesTravailPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
      </Route>
    </Routes>
  );
}

export default GestionEquipementMoyensTravailRoutes;
