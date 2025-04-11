import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import AnotherDashboardPage from './pages/AnotherDashboardPage';
import Page from './page';

const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Page />} />
      <Route path="/another" element={<AnotherDashboardPage />} />
      {/* Ajoutez d'autres sous-routes ici */}
    </Routes>
  );
};

export default DashboardRoutes;
