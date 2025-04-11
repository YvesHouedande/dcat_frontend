import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./helpers/PrivateRoute";
import keycloak from "../KeycloakService";
import DashboardRoutes from "./modules/dashboard/DashboardRoutes";
import AccountingRoutes from "./modules/accounting/AccountingRoutes";
import AdministrationRoutes from "./modules/administration/AdministrationRoutes";
import InterventionsRoutes from "./modules/interventions/InterventionsRoutes";
import StocksRoutes from "./modules/stocks/StocksRoutes";
import ProjectsRoutes from "./modules/projects/ProjectsRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
          path="/stock/*"
          element={<PrivateRoute element={<StocksRoutes />} />}
        />
        <Route

          path="/COMPTABILITE/*"
          element={<PrivateRoute element={<AccountingRoutes />} />}
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
