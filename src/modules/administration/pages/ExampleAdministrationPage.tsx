import React from 'react';
import Layout from '../../../components/Layout';

const ExampleAdministrationPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Page d'Exemple d'Administration</h1>
        <p>Ceci est une page d'exemple pour le module d'administration.</p>
      </div>
    </Layout>
  );
};

export default ExampleAdministrationPage; 