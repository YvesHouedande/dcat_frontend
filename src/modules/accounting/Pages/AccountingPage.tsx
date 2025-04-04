// accounting/Pages/AccountingPage.tsx
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { mockFichiers } from '../data/mockFichier';
import FichierThumbnail from '../components/FichierThumbnail';
import  boutonAdd  from '../components/bouton';
type FiltreType = 'tous' | 'comptabilité' | 'finance';

const AccountingPage: React.FC = () => {
  const [filtreActif, setFiltreActif] = useState<FiltreType>('tous');

  // Tri et filtrage optimisés
  const fichiersFiltres = [...mockFichiers]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .filter(f => filtreActif === 'tous' || f.type === filtreActif);

  return (
    <Layout autre={boutonAdd}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Tous les documents</h1>
        
        {/* Barre de filtres */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['tous', 'comptabilité', 'finance'] as const).map((filtre) => (
            <FilterButton
              key={filtre}
              filtre={filtre}
              isActive={filtreActif === filtre}
              onClick={() => setFiltreActif(filtre)}
            />
          ))}
        </div>

        {/* Affichage des documents */}
        {fichiersFiltres.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <DocumentGrid fichiers={fichiersFiltres} />
            <DocumentCount count={fichiersFiltres.length} />
          </>
        )}
      </div>
    </Layout>
  );
};

// Composants séparés pour meilleure lisibilité
const FilterButton: React.FC<{
  filtre: FiltreType;
  isActive: boolean;
  onClick: () => void;
}> = ({ filtre, isActive, onClick }) => {
  const buttonStyles = {
    tous: 'bg-gray-800 text-white',
    comptabilité: 'bg-blue-600 text-white',
    finance: 'bg-green-600 text-white'
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isActive 
          ? buttonStyles[filtre] 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
    >
      {filtre === 'tous' ? 'Tous' : filtre.charAt(0).toUpperCase() + filtre.slice(1)}
    </button>
  );
};

const DocumentGrid: React.FC<{ fichiers: typeof mockFichiers }> = ({ fichiers }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {fichiers.map((fichier) => (
      <FichierThumbnail
        key={fichier.id}
        fichier={fichier}
        className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
        onPreview={() => window.open(fichier.url, '_blank')}
      />
    ))}
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-12 bg-gray-50 rounded-lg">
    <p className="text-gray-500">Aucun document trouvé</p>
    <button 
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      onClick={() => window.location.reload()}
    >
      Recharger
    </button>
  </div>
);

const DocumentCount: React.FC<{ count: number }> = ({ count }) => (
  <div className="mt-4 text-sm text-gray-500">
    Affichage de {count} document{count !== 1 ? 's' : ''}
  </div>
);

export default AccountingPage;