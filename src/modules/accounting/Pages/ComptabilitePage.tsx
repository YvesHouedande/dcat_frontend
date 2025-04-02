// accounting/Pages/ComptabilitePage.tsx
import { useEffect, useState } from "react";
import {useAccounting} from "../hooks/useAccounting";
import FichierThumbnail from "../components/FichierThumbnail";
import { Fichier } from "../data/type";
import Layout from "@/components/Layout";

export default function ComptabilitePage() {
  const [fichiers, setFichiers] = useState<Fichier[]>([]);
  const { getFichiers } = useAccounting();

  useEffect(() => {
    const loadData = async () => {
      const { data } = await getFichiers("comptabilité");
      setFichiers(data);
    };
    loadData();
  }, []);

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