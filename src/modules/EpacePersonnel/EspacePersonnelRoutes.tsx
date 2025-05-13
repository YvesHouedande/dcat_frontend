import React from "react";
import { Routes, Route } from "react-router-dom";
import MonEsapce from "./pages/monesapce";
import EspacePersonnelLayout from "./Layout";
import NouvelleDemandePage from "../administration-Finnance/administration/pages/demandes/nouveau";
import DemandesAnnuaire from "./pages/demandes";
// import NotFound from '@/pages/NotFound';

const EspacePersonnel: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<EspacePersonnelLayout />}>
        <Route index element={<MonEsapce />} />
        <Route path="demandes/nouvelle" element={<NouvelleDemandePage />} />
        <Route path="demandes" element={<DemandesAnnuaire />} />
      </Route>
    </Routes>
  );
};

export default EspacePersonnel;
