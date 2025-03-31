import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from ".";
import Nouvelle_fiche from "./Pages/nouvelle_fiche";
import Information_fiche from "./Pages/information_fiche";
import Modifier_intervention from "./Pages/modifier_intervention";
import { DataTable } from "./test/test";
import data from "./test/data.json";
import Historique from "./Pages/historique";
import NotFound from "@/pages/NotFound";

const InterventionsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/nouvelle_intervention" element={<Nouvelle_fiche />} />
      <Route
        path="/information_intervention/:id"
        element={<Information_fiche />}
      />
      <Route
        path="/modifier_intervention/:id"
        element={<Modifier_intervention />}
      />
      {/* <Route path="/historique" element={<DataTable data={data} />} /> */}
      <Route path="/historique" element={<Historique />} />

      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default InterventionsRoutes;
