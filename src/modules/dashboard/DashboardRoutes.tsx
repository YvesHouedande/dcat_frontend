import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import AnotherDashboardPage from './pages/AnotherDashboardPage';

const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/another" element={<AnotherDashboardPage />} />
      {/* Ajoutez d'autres sous-routes ici */}
    </Routes>
  );
};

export default DashboardRoutes;
