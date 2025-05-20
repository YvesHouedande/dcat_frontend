import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Layout from "@/components/Layout";

// Define the Document interface
interface Document {
  id_document: number;
  libele_document: string;
  date_document: string;
  lien_document: string;
  id_nature_document?: number;
}

// Define the Livrable interface
interface Livrable {
  id_livrable: number;
  libelle_livrable: string;
  date: string;
  realisations: string;
  reserves: string;
  approbation: "en attente" | "approuvé" | "rejeté" | "révisions requises";
  recommandation: string;
  id_projet: number;
  documents: Document[];
}

const LivrableDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [livrable, setLivrable] = useState<Livrable | null>(null);

  // Fetch livrable data
  useEffect(() => {
    const fetchLivrable = async () => {
      // Replace with actual API call
      const response = await fetch(`/api/livrables/${id}`);
      const data = await response.json();
      setLivrable(data);
    };

    fetchLivrable();
  }, [id]);

  if (!livrable) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="bg-gray-50 p-6 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Détails du livrable
              </h1>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => navigate("/technique/livrable")}
              >
                Retour
              </Button>
            </div>
          </div>
          {/* Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* General Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Informations générales
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <p>
                        <strong>Libellé du livrable:</strong>{" "}
                        {livrable.libelle_livrable}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p>
                        <strong>Projet:</strong> {livrable.id_projet}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p>
                        <strong>Date:</strong>{" "}
                        {format(new Date(livrable.date), "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Realisations and Reserves */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Réalisation et Réserves
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <p>
                        <strong>Réalisations:</strong> {livrable.realisations}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p>
                        <strong>Réserves:</strong> {livrable.reserves}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Approval and Recommendation */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Approbation et Recommandation
                  </h2>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p>
                        <strong>Approbation:</strong> {livrable.approbation}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p>
                        <strong>Recommandation:</strong> {livrable.recommandation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Documents
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    {livrable.documents.map((document) => (
                      <div key={document.id_document} className="space-y-2">
                        <p>
                          <strong>Document:</strong>{" "}
                          <a
                            href={document.lien_document}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {document.libele_document}
                          </a>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LivrableDetails;
