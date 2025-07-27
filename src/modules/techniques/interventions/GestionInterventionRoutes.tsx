import { Route, Routes } from "react-router-dom";
import GestionIntervention from "@/modules/dashboard/pages/techniques/gestionIntervention";
import { InterventionEditPage } from "./Pages/InterventionEditPage";
import { InterventionsReportsPage } from "./Pages/InterventionsReportsPage";
import { InterventionDetailsPage } from "./Pages/InterventionDetailsPage";
import { InterventionsPage } from "./Pages/InterventionsPage";
import { InterventionsListPage } from "./Pages/InterventionsListPage";
import NotFound from "@/pages/NotFound";
function GestionInterventionRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GestionIntervention />} />
      <Route path="/interventions" element={<InterventionsPage />} />
      <Route path="/interventions/liste" element={<InterventionsListPage />} />
      <Route
        path="/interventions/rapports"
        element={<InterventionsReportsPage />}
      />
      <Route path="/interventions/:id" element={<InterventionDetailsPage />} />
      <Route
        path="/interventions/:id/edit"
        element={<InterventionEditPage />}
      />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default GestionInterventionRoutes;
