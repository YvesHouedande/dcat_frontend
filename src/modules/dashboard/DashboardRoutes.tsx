import React from "react";
import { Routes, Route } from "react-router-dom";
import AnotherDashboardPage from "./pages/AnotherDashboardPage";
import GestionAdministrative from "./pages/administrationFinance/gestionAdminstrative";
import DocFinanceComptabilite from "./pages/administrationFinance/financeComptabilité";
import ResourcesHumaines from "./pages/administrationFinance/resourcesHumaines";
import GestionStock from "./pages/gestionDesStocks/gestionStock";
import GestionIntervention from "./pages/techniques/gestionIntervention";
import GestionsProjet from "./pages/techniques/gestionsProjet";
import GestionOutils from "./pages/moyensGeneraux/gestionOutils";
import GestionEquipement from "./pages/moyensGeneraux/gestionEquipement";
import Marketing from "./pages/marketingetcommercial/marketing";
import NotFound from "@/pages/NotFound";
import PromotionProduit from "../marketing-commercial/marketing/pages/PromotionProduit";

const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AnotherDashboardPage />} />
      <Route path="/resources-humaines" element={<ResourcesHumaines />} />
      <Route
        path="/gestion-administrative"
        element={<GestionAdministrative />}
      />
      <Route
        path="/finance-et-compatibilite"
        element={<DocFinanceComptabilite />}
      />
      <Route path="/entrees-sorties" element={<GestionStock />} />
      <Route
        path="/gestion-des-interventions"
        element={<GestionIntervention />}
      />
      <Route path="/gestion-des-projets" element={<GestionsProjet />} />
      <Route path="/gestion-des-outils-travail" element={<GestionOutils />} />
      <Route path="/gestion-des-equiments-et-moyens-travail" element={<GestionEquipement />} />
      <Route path="/marketing" element={<Marketing />} />
      <Route path="/marketing/promotion-produit" element={<PromotionProduit />} />
      <Route path="/*" element={<NotFound />} />
      {/* Ajoutez d'autres sous-rogestion-stocksutes ici */}
    </Routes>
  );
};

export default DashboardRoutes;
