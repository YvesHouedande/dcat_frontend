import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./helpers/PrivateRoute";
import keycloak from "../KeycloakService";
import DashboardRoutes from "./modules/dashboard/DashboardRoutes";
import AdministrationRoutes from "./modules/administration-Finnance/administration/AdministrationRoutes";
import InterventionsRoutes from "./modules/techniques/interventions/InterventionsRoutes";
import StocksRoutes from "./modules/stocks/StocksRoutes";
import ProjectsRoutes from "./modules/techniques/projects/ProjectsRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MoyenGenerauxgRoutes from "./modules/MoyensGeneraux/MoyensGenerauxRoutes";

const queryClient = new QueryClient();
const AppContent: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          path="/"
          element={<PrivateRoute element={<DashboardRoutes />} />}
        />
        <Route
          path="/dashboard/*"
          element={<PrivateRoute element={<DashboardRoutes />} />}
        />
        <Route
          path="/stocks/*"
          element={<PrivateRoute element={<StocksRoutes />} />}
        />
        <Route
          path="/administration/*"
          element={<PrivateRoute element={<AdministrationRoutes />} />}
        />
        <Route
          path="/interventions/*"
          element={<PrivateRoute element={<InterventionsRoutes />} />}
        />
        <Route
          path="/moyens-generaux/*"
          element={<PrivateRoute element={<MoyenGenerauxgRoutes />} />}
        />
        <Route
          path="/projects/*"
          element={<PrivateRoute element={<ProjectsRoutes />} />}
        />
        <Route path="*" element={<PrivateRoute element={<NotFound />} />} />
      </Routes>
    </QueryClientProvider>
  );
};

const App: React.FC = () => {
  return (
    // <ReactKeycloakProvider
    //   authClient={keycloak}
    //   initOptions={{
    //     onLoad: 'check-sso',
    //     checkLoginIframe: false,
    //     flow: 'standard',
    //     pkceMethod: 'S256',
    //   }}
    // >
    <Router>
      <AppContent />
    </Router>
    // </ReactKeycloakProvider>
  );
};

export default App;
