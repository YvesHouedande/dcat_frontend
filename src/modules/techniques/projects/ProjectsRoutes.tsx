import React from "react";
import { Routes, Route } from "react-router-dom";
import data from "../interventions/test/data.json";
import VueGlobalPage from "./accueilpage/VueGlobal";
import Index from "../interventions";
import Nouvelle_fiche from "../interventions/Pages/nouvelle_fiche";
import Information_fiche from "../interventions/Pages/information_fiche";
import Modifier_intervention from "../interventions/Pages/modifier_intervention";
import { ResizableHandleDemo } from "../interventions/Pages/histoire";
import EditerProjet from "./projet/ProjectEditPage";
import DetailProjet from "./projet/ProjectDetail";
import NouveauProjet from "./projet/ProjetForm";
import ProjetsPage from "./projet/ProjectsPage";
import ProjetsTachesPage from "./tasks/TasksPage";
import NouvelleTache from "./tasks/Taskform";
import DetailsTache from "./tasks/TaskDetail";
import EditerTache from "./tasks/TaskEditPage";
import LivrableDetails from "./livrables/LivrableDetail";
import EditLivrable from "./livrables/LivrableEditPage";
import NouveauLivrable from "./livrables/LivrableForm";
import LivrablesPage from "./livrables/LivrablesPage";
import InterventionsTable from "../interventions/Pages/historique";
import { DataTable } from "../interventions/test/test";


const ProjectsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Route principale - Tableau de bord/Accueil */}
      <Route path="/" element={<VueGlobalPage />} />

      {/* Routes pour la gestion des projets */}
      <Route path="/projets" element={<ProjetsPage />} />
      <Route path="/projets/nouveau" element={<NouveauProjet />} />
      <Route path="/projets/:id" element={<DetailProjet />} />
      <Route path="/projets/:id/editer" element={<EditerProjet />} />

      {/* Routes pour la gestion des tâches */}
      <Route path="/taches" element={<ProjetsTachesPage/>} />
      <Route path="/taches/nouvelle" element={<NouvelleTache />} />
      <Route path="/taches/:id" element={<DetailsTache />} />
      <Route path="/taches/:id/modifier" element={<EditerTache />} />

      {/* Routes pour la gestion des livrables */}
      <Route path="/livrable" element={<LivrablesPage />} />
      <Route path="/livrable/nouveau" element={<NouveauLivrable />} />
      <Route path="/livrable/:id/details" element={<LivrableDetails />} />
      <Route path="/livrable/:id/editer" element={<EditLivrable />} />


      {/* Route pour les interventions */}
      <Route path="/intervention" element={<Index />} />
        <Route path="/nouvelle_intervention" element={<Nouvelle_fiche />} />
        <Route path=":id" element={<Information_fiche />} />
        <Route path=":id/editer" element={<Modifier_intervention />} />
        <Route path="/historique" element={<ResizableHandleDemo />} />
        <Route path="/historique" element={<DataTable data={data} />} />
        <Route path="/interventions" element={<InterventionsTable />} />
        <Route path="/interventionss" element={<InterventionsTable />} />
    </Routes>
  );
};

export default ProjectsRoutes;