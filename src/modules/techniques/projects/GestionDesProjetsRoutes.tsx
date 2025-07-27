
import { Routes } from "react-router-dom";
import ProjetDetailsPage from "./projet/components/ProjectDetail";
import EditerProjetPage from "./projet/components/ProjectEditPage";
import { Route } from "react-router-dom";
import NouveauProjetPage from "./projet/components/nouveauProjetPage";
import GestionProjetsPage from "./centralPage/PrincipalProjects";
import GestionsProjet from "@/modules/dashboard/pages/techniques/gestionsProjet";
import CreerLivrablePage from "./livrables/components/creerLivrable";
import EditerLivrablePage from "./livrables/components/LivrableEdit";
import OperationDetailsPage from "./operation/pages/OperationDetailsPage";
import OperationEditPage from "./operation/pages/OperationEditPage";
import LivrableDetailsPage from "./livrables/components/livrableDetails";
import { DetailsTachePage } from "./tasks/components/TaskDetail";
import EditerTachePage from "./tasks/components/TaskEditPage";
import CreerTachePage from "./tasks/components/creerTache";
import NotFound from "@/pages/NotFound";
import { ProjetsListPage } from "./projet/pages/ProjetsListPage";

function GestionDesProjetsRoutes() {
  return (
    <Routes>
      {/* Gestion des projets */}
      <Route path="/" element={<GestionsProjet />} />
      <Route path="/projets" element={<GestionProjetsPage />} />
      <Route path="/projets/nouveau" element={<NouveauProjetPage />} />
      <Route path="/projets/liste" element={<ProjetsListPage />} />
      <Route path="/projets/:id/*" element={<ProjetDetailsPage />} />
      <Route path="/projets/:id/editer" element={<EditerProjetPage />} />
      <Route path="/projets/operations" element={<GestionProjetsPage />} />

      {/* Gestion des operations */}
      <Route
        path="/projets/operations/:id"
        element={<OperationDetailsPage />}
      />
      <Route
        path="/projets/operations/:id/editer"
        element={<OperationEditPage />}
      />

      {/* Gestion des livrables */}
      <Route path="/projets/livrables" element={<GestionProjetsPage />} />
      <Route
        path="/projets/livrables/nouveau"
        element={<CreerLivrablePage />}
      />
      <Route
        path="/projets/livrables/:id/editer"
        element={<EditerLivrablePage />}
      />
      <Route path="/projets/livrables/:id" element={<LivrableDetailsPage />} />

      {/* Gestion des taches */}
      <Route path="/projets/taches" element={<GestionProjetsPage />} />
      <Route path="/projets/taches/nouvelle" element={<CreerTachePage />} />
      <Route path="/projets/taches/:id/editer" element={<EditerTachePage />} />
      <Route
        path="/projets/taches/:id/"
        element={<DetailsTachePage />}
      />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default GestionDesProjetsRoutes;
