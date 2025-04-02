import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VueGlobalPage from './Pages/VueGlobal';

const ProjectsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<VueGlobalPage />} />
    </Routes>
  );
};

export default ProjectsRoutes;
