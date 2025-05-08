import React from "react";
import { Routes, Route } from "react-router-dom";
import VueGlobalPage from "./accueilpage/VueGlobal";
import Index from "../interventions";
import { ProjectsPage } from "./projet/Pages/ProjectsPage";
import { ProjectDetail } from "./projet/Pages/ProjectDetail";
import { ProjectEditPage } from "./projet/Pages/ProjectEditPage";
import { TasksPage } from "./tasks/Pages/TasksPage";
import { TaskDetail } from "./tasks/Pages/TaskDetail";
import { TaskEditPage } from "./tasks/Pages/TaskEditPage";
import { LivrablesPage } from "./livrables/Pages/LivrablesPage";
import { LivrableEditPage } from "./livrables/Pages/LivrableEditPage";
import { LivrableDetail } from "./livrables/Pages/LivrableDetail";
import { DocumentsPage } from "./documents/Pages/DocumentsPage";
import { DocumentEditPage } from "./documents/Pages/DocumentEditPage";
import Nouvelle_fiche from "../interventions/Pages/nouvelle_fiche";
import Information_fiche from "../interventions/Pages/information_fiche";
import Modifier_intervention from "../interventions/Pages/modifier_intervention";
// import { DataTable } from "../interventions/test/test";
import { ResizableHandleDemo } from "../interventions/Pages/histoire";
import { DocumentDetail } from "./documents/Pages/DocumentDetail";
// import InterventionsTable from "../interventions/Pages/historique";



const ProjectsRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Route principale - Tableau de bord/Accueil */}
      <Route path="/" element={<VueGlobalPage />} />
      
      {/* Routes pour la gestion des projets */}
      <Route path="/projets" element={<ProjectsPage />} />
      <Route path="/projets/nouveau" element={<ProjectEditPage />} />
      <Route path="/projets/:id" element={<ProjectDetail />} />
      <Route path="/projets/:id/modifier" element={<ProjectEditPage />} />
      
      {/* Routes pour la gestion des tâches */}
      <Route path="/taches" element={<TasksPage />} />
      <Route path="/taches/nouvelle" element={<TaskEditPage />} />
      <Route path="/taches/:id" element={<TaskDetail />} />
      <Route path="/taches/:id/modifier" element={<TaskEditPage />} />
      <Route path="/projets/:id/taches" element={<TasksPage />} />
      <Route path="/projets/:id/taches/nouvelle" element={<TaskEditPage />} />
      
      {/* Routes pour les documents */}
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/documents/nouveau" element={<DocumentEditPage />} />
      <Route path="/documents/:id" element={<DocumentDetail />} />
      <Route path="/documents/:id/modifier" element={<DocumentEditPage />} />
      <Route path="/projets/:id/documents" element={<DocumentsPage />} />
      <Route path="/projets/:id/documents/nouveau" element={<DocumentEditPage />} />
      
      {/* Routes pour les rapports/livrables */}
      <Route path="/rapports" element={<LivrablesPage />} />
      <Route path="/rapports/nouveau" element={<LivrableEditPage />} />
      <Route path="/rapports/:id" element={<LivrableDetail />} />
      <Route path="/rapports/:id/modifier" element={<LivrableEditPage />} />
      <Route path="/projets/:id/rapports" element={<LivrablesPage />} />
      <Route path="/projets/:id/rapports/nouveau" element={<LivrableEditPage />} />
      
      {/* Route pour les interventions */}
      <Route path="/intervention" element={<Index />} />
       <Route path="/" element={<Index />} />
        <Route path="/nouvelle_intervention" element={<Nouvelle_fiche />} />
        <Route path=":id" element={<Information_fiche />} />
        <Route path=":id/editer" element={<Modifier_intervention />} />
        {/* <Route path="/historique" element={<DataTable data={data} />} /> */}
        <Route path="/historique" element={<ResizableHandleDemo />} />
        {/* <Route path="/intervention" element={<InterventionsTable />} /> */}
    </Routes>
  );
};

export default ProjectsRoutes;