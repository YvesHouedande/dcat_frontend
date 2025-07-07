import { Routes, Route } from "react-router-dom";
import VueGlobalPage from "./projects/centralPage/VueGlobal";
import NouveauProjetPage from "./projects/projet/components/nouveauProjetPage";
import EditerProjetPage from "./projects/projet/components/ProjectEditPage";
import ProjetDetailsPage from "./projects/projet/components/ProjectDetail";
import LivrableDetailPage  from "./projects/livrables/components/livrableDetails";
import GestionProjetsPage from "./projects/centralPage/PrincipalProjects";
import CreerTachePage from "./projects/tasks/components/creerTache";
import EditerTachePage from "./projects/tasks/components/TaskEditPage";
import { DetailsTachePage } from "./projects/tasks/components/TaskDetail";
import CreerLivrablePage from "./projects/livrables/components/creerLivrable";
import EditerLivrablePage from "./projects/livrables/components/LivrableEdit";
import { InterventionsPage } from "./Interventions/pages/InterventionsPage";
import { InterventionsListPage } from "./Interventions/pages/InterventionsListPage";
import { InterventionsReportsPage } from "./Interventions/pages/InterventionsReportsPage";
import { InterventionDetailsPage } from "./Interventions/pages/InterventionDetailsPage";
import { InterventionEditPage } from "./Interventions/pages/InterventionEditPage";
import { ProjetsListPage } from "./projects/projet/pages/ProjetsListPage";
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

      {/* les routes concernant les taches */}
      <Route path="/projets/taches" element={<GestionProjetsPage/>} />
      <Route path="/projets/taches/nouvelle" element={<CreerTachePage />} />
      <Route path="/projets/taches/:id/editer" element={<EditerTachePage />} />
      <Route path="/projets/taches/:id/details" element={<DetailsTachePage />} />
      
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
    </Routes>
  );
};

export default ProjectsRoutes;