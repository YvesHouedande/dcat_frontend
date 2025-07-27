import React from "react";
import { Routes, Route } from "react-router-dom";
import AnotherDashboardPage from "./pages/AnotherDashboardPage";
import GestionStock from "./pages/gestionDesStocks/gestionStock";
import Marketing from "./pages/marketingetcommercial/marketing";
import NotFound from "@/pages/NotFound";
import PromotionProduit from "../marketing-commercial/marketing/pages/PromotionProduit";
import GestionAdministrativeRoutes from "../administration-Finnance/administration/GestionAdministrativeRoutes";
import FinanceComptaRoutes from "../administration-Finnance/finance_compta/FinanceComptaRoutes";
import ResourcesHumainesRoutes from "../administration-Finnance/resourcesHumaines/ResourcesHumainesRoutes";
import GestionInterventionRoutes from "../techniques/interventions/GestionInterventionRoutes";
import GestionDesProjetsRoutes from "../techniques/projects/GestionDesProjetsRoutes";
import GestionEquipementMoyensTravailRoutes from "../MoyensGeneraux/EquipemntMoyensTravail/GestionEquipementMoyensTravailRoutes";
import GestionOutilsRoutes from "../MoyensGeneraux/Outils/GestionOutilsRoutes";

const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AnotherDashboardPage />} />
      <Route
        path="/resources-humaines/*"
        element={<ResourcesHumainesRoutes />}
      />
      <Route
        path="/gestion-administrative/*"
        element={<GestionAdministrativeRoutes />}
      />
      <Route
        path="/finance-et-compatibilite/*"
        element={<FinanceComptaRoutes />}
      />
      <Route path="/entrees-sorties" element={<GestionStock />} />
      <Route
        path="/gestion-des-interventions/*"
        element={<GestionInterventionRoutes />}
      />
      <Route
        path="/gestion-des-projets/*"
        element={<GestionDesProjetsRoutes />}
      />
      <Route
        path="/gestion-des-outils-travail/*"
        element={<GestionOutilsRoutes />}
      />
      <Route
        path="/gestion-equipements-et-moyens-travail/*"
        element={<GestionEquipementMoyensTravailRoutes />}
      />
      <Route path="/marketing" element={<Marketing />} />
      <Route
        path="/marketing/promotion-produit"
        element={<PromotionProduit />}
      />
      <Route path="/*" element={<NotFound />} />
      {/* Ajoutez d'autres sous-rogestion-stocksutes ici */}
    </Routes>
  );
};

export default DashboardRoutes;
