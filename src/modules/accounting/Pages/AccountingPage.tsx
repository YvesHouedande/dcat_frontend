import React from 'react';
import Layout from '@/components/Layout';
import { mockFichiers } from '../data/mockFichier';

const AccountingPage: React.FC = () => {
  return (
    <Layout>
      <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tous les documents</h1>
      {mockFichiers.map((fichier: { id: React.Key | null | undefined; titre: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; type: string; date: { toLocaleDateString: () => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; }) => (
        <div key={fichier.id} className="p-3 border-b">
          <h3>{fichier.titre}</h3>
          <p className="text-sm text-gray-500">
            {fichier.type.toUpperCase()} • {fichier.date.toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
    </Layout>
  );
};

export default AccountingPage; 