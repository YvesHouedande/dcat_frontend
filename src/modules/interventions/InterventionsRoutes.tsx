import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ExampleInterventionsPage from './Pages/ExampleInterventionsPage';

const InterventionsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/interventions" element={<ExampleInterventionsPage />} />
    </Routes>
  );
};

export default InterventionsRoutes; 