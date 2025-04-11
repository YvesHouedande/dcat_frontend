import React from "react";
import Layout from "../../../components/Layout";
import Dashboard from "../../projects/components/dashboards/dashboards";

const VueGlobalPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Vue Globale</h1>
        <Dashboard />
      </div>
    </Layout>
  );
};

export default VueGlobalPage;
