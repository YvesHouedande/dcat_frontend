import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ExampleStocksPage from './Pages/ExampleStocksPage';

const StocksRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ExampleStocksPage />} />
    </Routes>
  );
};

export default StocksRoutes; 