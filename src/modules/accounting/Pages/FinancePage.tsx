// accounting/Pages/FinancePage.tsx
import { useEffect, useState } from "react";
import {useAccounting} from "../hooks/useAccounting";
import FichierThumbnail from "../components/FichierThumbnail";
import Layout from '@/components/Layout';
import  boutonAdd  from '../components/bouton';
import { Fichier } from "../data/type";

export default function FinancePage() {
  const [fichiers, setFichiers] = useState<Fichier[]>([]);
  const [loading, setLoading] = useState(true);
  const { getFichiers } = useAccounting();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data } = await getFichiers("finance");
        setFichiers(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Documents Finance</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-64" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  function loadData(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Layout autre={boutonAdd}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Documents Finance</h1>
        
        {fichiers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun document disponible</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => loadData()} // Option de rechargement
            >
              Actualiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {fichiers.map((fichier) => (
              <FichierThumbnail 
                key={fichier.id} 
                fichier={fichier}
                // onPreview={() => window.open(fichier.url, '_blank')} // Optionnel
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}