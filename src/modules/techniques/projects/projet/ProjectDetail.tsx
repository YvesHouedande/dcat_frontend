import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Layout from "@/components/Layout";
import { Projet } from "../types/types";

// Interface for Projet
const DetailProjet: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Sample data for employees and families
  const employees = [
    { id: 1, nom: "Jean Dupont" },
    { id: 2, nom: "Marie Martin" },
    // Add more employees as needed
  ];

  const families = [
    { id: 1, nom: "Famille A" },
    { id: 2, nom: "Famille B" },
    // Add more families as needed
  ];

  // State for project data
  const [projectData, setProjectData] = useState<Projet | null>(null);

  // Fetch project data based on ID
  useEffect(() => {
    // Simulate fetching project data
    const fetchProjectData = async () => {
      // Replace with actual API call
      const mockProjectData: Projet = {
        id_projet: parseInt(id || "0"),
        nom_projet: "Projet Exemple",
        type_projet: "Type Exemple",
        devis_estimatif: 10000,
        date_debut: "2023-10-01",
        date_fin: "2024-04-01",
        duree_prevu_projet: "6",
        description_projet: "Description du projet exemple",
        etat: "en cours",
        lieu: "Lieu Exemple",
        id_employe: 1,
        site: "Site Exemple",
        id_famille: 1,
      };
      setProjectData(mockProjectData);
    };

    fetchProjectData();
  }, [id]);

  if (!projectData) {
    return <div>Loading...</div>;
  }

  // Find employee and family names
  const employee = employees.find(emp => emp.id === projectData.id_employe)?.nom || "Inconnu";
  const family = families.find(fam => fam.id === projectData.id_famille)?.nom || "Inconnue";

  return (
    <Layout>
      <div className="bg-gray-50 p-6 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Détails du projet
              </h1>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => navigate("/technique/projets")}
              >
                Retour à la liste
              </Button>
            </div>
          </div>

          {/* Project Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* General Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Informations générales
                  </h2>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Nom du projet</p>
                      <p className="text-lg text-gray-900">{projectData.nom_projet}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Type de projet</p>
                      <p className="text-lg text-gray-900">{projectData.type_projet}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Devis estimatif</p>
                      <p className="text-lg text-gray-900">{projectData.devis_estimatif} €</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Date de début</p>
                      <p className="text-lg text-gray-900">
                        {format(new Date(projectData.date_debut), "dd MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Date de fin</p>
                      <p className="text-lg text-gray-900">
                        {format(new Date(projectData.date_fin), "dd MMMM yyyy", { locale: fr })}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Durée prévue du projet</p>
                      <p className="text-lg text-gray-900">{projectData.duree_prevu_projet} mois</p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Informations complémentaires
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="text-lg text-gray-900">{projectData.description_projet}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">État</p>
                      <p className="text-lg text-gray-900">{projectData.etat}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Lieu</p>
                      <p className="text-lg text-gray-900">{projectData.lieu}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Site</p>
                      <p className="text-lg text-gray-900">{projectData.site}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Employé</p>
                      <p className="text-lg text-gray-900">{employee}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Famille</p>
                      <p className="text-lg text-gray-900">{family}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="mt-6 flex space-x-2 justify-end">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => navigate(`/technique/projets/${projectData.id_projet}/editer`)}
            >
              Éditer le projet
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetailProjet;