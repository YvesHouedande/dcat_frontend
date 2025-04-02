// accounting/Pages/ComptabilitePage.tsx
import { useEffect, useState } from "react";
import {useAccounting} from "../hooks/useAccounting";
import FichierThumbnail from "../components/FichierThumbnail";
import { Fichier } from "../data/type";
import Layout from "@/components/Layout";

export default function ComptabilitePage() {
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
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Documents Comptabilités</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (

    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Documents Comptabilité</h1>
        
        {fichiers.length === 0 ? (
          <p>Aucun document disponible.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {fichiers.map((fichier) => (
              <FichierThumbnail key={fichier.id} fichier={fichier} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}