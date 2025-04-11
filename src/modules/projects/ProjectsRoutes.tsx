import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VueGlobalPage from './Pages/VueGlobal';
<<<<<<< HEAD
=======
import FormulaireProjet from './Pages/FormulairePprojet';
import TaskForm from './Pages/TaskForm';
import MissionDisplay from './Pages/MissionDisplay';
import MissionForm from './Pages/MissionForm';
import TaskDisplay from './Pages/TaskDisplay';
import ProjectDisplay from './Pages/ProjetDisplay';
>>>>>>> 9ef29a9 (jjk)

const ProjectsRoutes: React.FC = () => {
  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/" element={<VueGlobalPage />} />
=======

      {/* les principales pages du module */}

      <Route path="/" element={<VueGlobalPage />} />
      <Route path="/Projets" element={<ProjectDisplay />} />
      <Route path="/Missions" element={<MissionDisplay />} />
      <Route path="/Taches" element={<TaskDisplay />} />
      <Route path="/Documents" element={<VueGlobalPage />} />
      <Route path="/Rapports" element={<VueGlobalPage />} />

      {/* Les routes pour les formulaires et autres vues */}

      <Route path="/Projets/projet" element={<FormulaireProjet />} />
      <Route path="/Missions/mission" element={<MissionForm />} />
      <Route path="/Taches/tache" element={<TaskForm />} />
      {/* <Route path="/documents" element={<VueGlobalPage />} /> */}
      {/* <Route path="/rapport" element={<VueGlobalPage />} /> */}

>>>>>>> 9ef29a9 (jjk)
    </Routes>
  );
};

export default ProjectsRoutes;
