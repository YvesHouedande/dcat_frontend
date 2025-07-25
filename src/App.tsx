// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./helpers/PrivateRoute";
import keycloak from "../KeycloakService";
import AdministrationRoutes from "./modules/administration-Finnance/administration/AdministrationRoutes";
import StocksRoutes from "./modules/stocks/StocksRoutes";
import ProjectsRoutes from "./modules/techniques/ProjectsRoutes";
import { QueryClientProvider } from "@tanstack/react-query";
import MoyenGenerauxgRoutes from "./modules/MoyensGeneraux/MoyensGenerauxRoutes";
import DashboardRoutes from "./modules/dashboard/DashboardRoutes";
import { queryClient } from "./lib/queryClient";
import EspacePersonnel from "./modules/epace-personnel/EspacePersonnelRoutes";
import { LivraisonRoutes } from "./modules/stocks/achat/LivraisonRoutes";
import CommercialRoutes from "./modules/marketing-commercial/CommercialRoutes";

const AppContent: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          path="/*"
          element={<PrivateRoute element={<DashboardRoutes />} />}
        />
        <Route
          path="/entrees-sorties/*"
          element={<PrivateRoute element={<StocksRoutes />} />}
        />
        <Route
          path="/achat/*"
          element={<PrivateRoute element={<LivraisonRoutes />} />}
        />
        <Route
          path="/commercial/*"
          element={<PrivateRoute element={<CommercialRoutes />} />}
        />
        <Route
          path="/administration/*"
          element={<PrivateRoute element={<AdministrationRoutes />} />}
        />
        <Route
          path="/moyens-generaux/*"
          element={<PrivateRoute element={<MoyenGenerauxgRoutes />} />}
        />
        <Route
          path="/technique/*"
          element={<PrivateRoute element={<ProjectsRoutes />} />}
        />
        <Route
          path="/espace-personnel/*"
          element={<PrivateRoute element={<EspacePersonnel />} />}
        />
        <Route path="*" element={<PrivateRoute element={<NotFound />} />} />
      </Routes>
    </QueryClientProvider>
  );
};

const App: React.FC = () => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "check-sso",
        checkLoginIframe: false,
        flow: "standard",
        pkceMethod: "S256",
      }}
    >
      <Router>
        <AppContent />
      </Router>
    </ReactKeycloakProvider>
  );
};

export default App;
