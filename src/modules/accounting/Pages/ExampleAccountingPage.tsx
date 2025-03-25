import React from 'react';
import Layout from '@/components/Layout';

const ExampleAccountingPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Page d'Exemple de Comptabilité</h1>
        <p>Ceci est une page d'exemple pour le module de comptabilité.</p>
      </div>
    </Layout>
  );
};

export default ExampleAccountingPage; 