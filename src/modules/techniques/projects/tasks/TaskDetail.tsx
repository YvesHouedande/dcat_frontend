import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Layout from "@/components/Layout";

export interface Tache {
  id_tache: number;
  nom_tache: string;
  desc_tache: string;
  statut: "à faire" | "en cours" | "en revue" | "terminé" | "bloqué";
  date_debut: string;
  date_fin: string;
  priorite: "faible" | "moyenne" | "haute";
  id_projet: number;
}

const DetailsTache: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // State for task data
  const [taskData, setTaskData] = useState<Tache | null>(null);

  // Simulate fetching task data based on ID
  useEffect(() => {
    // In a real application, you would fetch the task data from an API
    const fetchTaskData = async () => {
      // Simulate API call
      const mockTaskData: Tache = {
        id_tache: parseInt(id || "0"),
        nom_tache: "Exemple de tâche",
        desc_tache: "Description de la tâche",
        statut: "à faire",
        date_debut: "2023-10-01",
        date_fin: "2023-10-31",
        priorite: "faible",
        id_projet: 1,
      };
      setTaskData(mockTaskData);
    };

    fetchTaskData();
  }, [id]);

  if (!taskData) {
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
                Détails de la tâche
              </h1>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => navigate("/technique/taches")}
              >
                Retour
              </Button>
            </div>
          </div>

          {/* Task Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Informations générales
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">
                        Nom de la tâche
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {taskData.nom_tache}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">
                        Description de la tâche
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {taskData.desc_tache}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Statut</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {taskData.statut}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">
                        Priorité
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {taskData.priorite}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">
                        Date de début
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {format(new Date(taskData.date_debut), "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">
                        Date de fin
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {format(new Date(taskData.date_fin), "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </p>
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
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              onClick={() => navigate(`/technique/taches/${taskData.id_tache}/editer`)}
            >
              Modifier la tâche
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetailsTache;
