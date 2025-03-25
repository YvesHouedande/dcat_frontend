import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ExampleProjectssPage from './Pages/ExampleProjetctsPage';

const ProjectsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ExampleProjectssPage />} />
    </Routes>
  );
};

export default ProjectsRoutes; 