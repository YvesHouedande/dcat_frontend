import React from 'react';
import Layout from '@/components/Layout';

const AnotherDashboardPage: React.FC = () => {

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Autre Page du Tableau de Bord</h1>
        <p>Ceci est une autre page du tableau de bord. Vous pouvez ajouter ici des informations ou des fonctionnalités supplémentaires.</p>
      </div>
    </Layout>
  );
};

export default AnotherDashboardPage;
