import GestionOutils from "@/modules/dashboard/pages/moyensGeneraux/gestionOutils";
import { Route, Routes } from "react-router-dom";
import MoyensGenerauxLayout from "../Layout";
import CataloguePage from "./pages/cataloguePage";
import ReferenceEditForm from "./pages/referenceRegistration";
import ReferencePage from "./pages/referencePage";

import MoyenGeneraux from "../MoyenGeneraux";
import NotFound from "@/pages/NotFound";
import Sortie from "./pages/sortie";
import Retour from "./pages/retour";
import Entree from "./pages/Entree";

function GestionOutilsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GestionOutils />} />
      <Route path="/creation-outils" element={<MoyensGenerauxLayout />}>
        <Route index element={<CataloguePage />} />
        <Route path=":id" element={<ReferencePage />} />
        <Route path=":id/edit" element={<ReferenceEditForm />} />
        <Route path="nouveau" element={<ReferenceEditForm />} />
      </Route>
      <Route path="/entrees" element={<MoyensGenerauxLayout />}>
        <Route index element={<Entree />} />
      </Route>
      <Route path="/sorties" element={<MoyensGenerauxLayout />}>
        <Route index element={<Sortie />} />
      </Route>
      <Route path="/retours" element={<MoyensGenerauxLayout />}>
        <Route index element={<Retour />} />
      </Route>
      <Route path="/historique" element={<MoyensGenerauxLayout />}>
        <Route index element={<MoyenGeneraux />} />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default GestionOutilsRoutes;
