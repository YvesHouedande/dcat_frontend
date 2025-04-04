import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VueGlobalPage from './Pages/VueGlobal';
import FormulaireProjet from './Pages/FormulairePprojet';

const ProjectsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<VueGlobalPage />} />
      <Route path="/Projets" element={<FormulaireProjet />} />
      <Route path="/mission" element={<VueGlobalPage />} />
      <Route path="/tache" element={<VueGlobalPage />} />
      <Route path="/documents" element={<VueGlobalPage />} />
      <Route path="/rapport" element={<VueGlobalPage />} />
      <Route path="/parametre" element={<VueGlobalPage />} />
    </Routes>
  );
};

export default ProjectsRoutes;
