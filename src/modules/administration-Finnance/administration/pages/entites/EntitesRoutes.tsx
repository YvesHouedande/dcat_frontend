// src/components/EntitesRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import EntitesList from "./entites";
import AddEntiteForm from "./ajouter_entite";
import EditEntiteForm from "./editer_entite";
import EntiteProfile from "./EntiteProfile";

const EntitesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<EntitesList />} />
      <Route path="/ajouter" element={<AddEntiteForm />} />
      <Route path="/:id" element={<EntiteProfile />} />
      <Route path="/:id/editer" element={<EditEntiteForm />} />
    </Routes>
  );
};

export default EntitesRoutes; 