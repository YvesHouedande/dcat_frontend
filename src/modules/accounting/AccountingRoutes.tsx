import React from 'react';
import { Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import ExampleAccountingPage from './Pages/ExampleAccountingPage';
import NotFound from '@/pages/NotFound';
=======
import AccountingPage from '@/modules/accounting/Pages/AccountingPage'
// import NotFound from '@/pages/NotFound';
import ComptabilitePage from './Pages/ComptabilitePage';
import FinancePage from './Pages/FinancePage';
import AddDocumentPage from './Pages/AddDocumentPage';
>>>>>>> 9ef29a9 (jjk)

const AccountingRoutes: React.FC = () => {
  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/" element={<ExampleAccountingPage />} />
      <Route path="/*" element={<NotFound />} />
=======
      <Route path="/" element={<AccountingPage />} />
      <Route path="/finance" element={<FinancePage />} />
      <Route path="/comptabilite" element={<ComptabilitePage />} />
      <Route path="/fichier" element={<AddDocumentPage />} />
      {/* <Route path="/*" element={<NotFound />} /> */}
>>>>>>> 9ef29a9 (jjk)
    </Routes>
  );
};

export default AccountingRoutes;
