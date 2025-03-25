import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ExampleAdministrationPage from './pages/ExampleAdministrationPage';

const AdministrationRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/example" element={<ExampleAdministrationPage />} />
    </Routes>
  );
};

export default AdministrationRoutes; 