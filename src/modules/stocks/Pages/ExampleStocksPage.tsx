import React from 'react';
import Layout from '../../../components/Layout';

const ExampleStocksPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Page d'Exemple de Stocks</h1>
        <p>Ceci est une page d'exemple pour le module de stocks.</p>
      </div>
    </Layout>
  );
};

export default ExampleStocksPage; 