import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ExampleAccountingPage from './Pages/ExampleAccountingPage';
import NotFound from '@/pages/NotFound';

const AccountingRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/recette" element={<ExampleAccountingPage />} />
      <Route path="/" element={<NotFound />} />
    </Routes>
  );
};

export default AccountingRoutes;
