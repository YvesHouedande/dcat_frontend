import { Routes, Route } from "react-router-dom";
import VueGlobalPage from "./projects/centralPage/VueGlobal";
import GestionProjetsPage from "./projects/centralPage/PrincipalProjects";
import NouveauProjetPage from "./projects/projet/components/nouveauProjetPage";
import EditerProjetPage from "./projects/projet/components/ProjectEditPage";
import ProjetDetailsPage from "./projects/projet/components/ProjectDetail";
import CreerTachePage from "./projects/tasks/components/creerTache";
import EditerTachePage from "./projects/tasks/components/TaskEditPage";
import { DetailsTachePage } from "./projects/tasks/components/TaskDetail";
import LivrableDetailPage from "./projects/livrables/components/livrableDetails";
import CreerLivrablePage from "./projects/livrables/components/creerLivrable";
import EditerLivrablePage from "./projects/livrables/components/LivrableEdit";
import { ProjetsListPage } from "./projects/projet/pages/ProjetsListPage";
import { InterventionsPage } from "./interventions/Pages/InterventionsPage";
import { InterventionsListPage } from "./interventions/Pages/InterventionsListPage";
import { InterventionDetailsPage } from "./interventions/Pages/InterventionDetailsPage";
import { InterventionsReportsPage } from "./interventions/Pages/InterventionsReportsPage";
import { InterventionEditPage } from "./interventions/Pages/InterventionEditPage";
import OperationPage from "./projects/operation/pages/OperationPage";
import OperationCreatePage from "./projects/operation/pages/OperationCreatePage";
import OperationEditPage from "./projects/operation/pages/OperationEditPage";
import OperationDetailsPage from "./projects/operation/pages/OperationDetailsPage";
import TaskEditPage from "./projects/tasks/components/TaskEditPage";
import TaskDetail from "./projects/tasks/components/TaskDetail";
import TacheForm from "./projects/tasks/components/TacheForm";
// import { ProjetsReportsPage } from "./projects/projet/pages/ProjetsReportsPage";

const ProjectsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<VueGlobalPage />} />
      {/* les routes concernant les projets */}
      <Route path="/projets" element={<GestionProjetsPage />} />
      <Route path="/projets/nouveau" element={<NouveauProjetPage />} />
      <Route path="/projets/:id/details/*" element={<ProjetDetailsPage />} />
      <Route path="/projets/:id/editer" element={<EditerProjetPage />} />

      {/* les routes concernant les opérations */}
      <Route path="/projets/operations" element={<GestionProjetsPage />} />
      <Route path="/projets/operations/:id/details" element={<OperationDetailsPage />} />
      <Route path="/projets/operations/:id/editer" element={<OperationEditPage />} />
      {/* Ajoutez ici les routes pour création/édition d'opération si vous avez des pages dédiées */}

      {/* les routes concernant les tâches d'une opération */}
      <Route path="/projets/:id/details/operations/:operationId/taches" element={<OperationDetailsPage />} />
      <Route path="/projets/:id/details/operations/:operationId/taches/nouvelle" element={<TacheForm operationsDisponibles={[]} employesDisponibles={[]} onSave={async () => {}} onCancel={() => {}} />} />
      <Route path="/projets/:id/details/operations/:operationId/taches/:tacheId/editer" element={<TaskEditPage />} />
      <Route path="/projets/:id/details/operations/:operationId/taches/:tacheId/details" element={<TaskDetail />} />

      {/* les routes concernant les livrables */}
      <Route path="/projets/livrables" element={<GestionProjetsPage />} />
      <Route path="/projets/livrables/nouveau" element={<CreerLivrablePage />} />
      <Route path="/projets/livrables/:id/editer" element={<EditerLivrablePage />} />
      <Route path="/projets/livrables/:id/details" element={<LivrableDetailPage />} />

      <Route path="/interventions" element={<InterventionsPage />} />
      <Route path="/interventions/liste" element={<InterventionsListPage />} />
      <Route path="/interventions/rapports" element={<InterventionsReportsPage />} />
      <Route path="/interventions/:id" element={<InterventionDetailsPage />} />
      <Route path="/interventions/:id/edit" element={<InterventionEditPage />} />
      <Route path="/projets/liste" element={<ProjetsListPage />} />
      {/* Route de rapports temporairement désactivée */}
      {/* <Route path="/projets/rapports" element={<ProjetsReportsPage />} /> */}
      {/* Route directe pour accéder à la page principale des opérations */}
      <Route path="/operations" element={<OperationPage />} />
      <Route path="/operations/nouvelle" element={<OperationCreatePage />} />
      {/* <Route path="/projets/taches/:id/editer" element={<EditerTachePage />} /> */}
      

     
      {/* Route directe pour accéder à la page principale des tâches */}
      <Route path="/projets/taches" element={<GestionProjetsPage />} />
      <Route path="/projets/taches/nouvelle" element={<CreerTachePage />} />
      <Route path="/projets/taches/:id/editer" element={<EditerTachePage />} />
      <Route path="/projets/taches/:id/details" element={<DetailsTachePage />} />
    </Routes>
  );
};

export default ProjectsRoutes;
