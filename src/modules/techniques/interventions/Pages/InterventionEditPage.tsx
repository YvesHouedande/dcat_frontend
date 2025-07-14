import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Intervention } from "../interface/interface";
import { getInterventionById, updateIntervention } from "../api/intervention";
import { InterventionForm } from "../components/InterventionForm";

// Type pour les données du formulaire
type FormData = {
  date_intervention: string;
  id_partenaire: number;
  probleme_signale: string;
  type_intervention: "Corrective" | "Préventive";
  type_defaillance: "Électrique" | "Matérielle" | "Logiciel";
  cause_defaillance:
    | "Usure normale"
    | "Défaut utilisateur"
    | "Défaut produit"
    | "Autre";
  detail_cause?: string;
  rapport_intervention: string;
  recommandation: string;
  duree: string;
  lieu: string;
  mode_intervention: string;
  employes: number[];
  superviseur: number;
  id_contrat?: number | null;
};
import { Button } from "@/components/ui/button";
import { Home, FileText, BarChart3, ArrowLeft } from "lucide-react";

export const InterventionEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIntervention = async () => {
      if (!id) return;

      try {
        const response = await getInterventionById(parseInt(id));
        if (response.data) {
          setIntervention(response.data);
        } else {
          toast.error("Intervention non trouvée");
          navigate("/technique/interventions");
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'intervention:", error);
        toast.error("Erreur lors du chargement de l'intervention");
        navigate("/technique/interventions");
      } finally {
        setIsLoading(false);
      }
    };

    loadIntervention();
  }, [id, navigate]);

  const handleSubmit = async (data: FormData) => {
    if (!id) return;
    setIsLoading(true);

    try {
      // Préparer le payload de mise à jour avec tous les champs nécessaires
      const interventionData: Partial<Intervention> = {
        ...data,
        id_intervention: parseInt(id),
        statut_intervention: intervention?.statut_intervention || "en cours",
        type: intervention?.type || "intervention",
        id_contrat: data.id_contrat ?? null, // Correction : valeur du formulaire
        employes: data.employes
          ? data.employes.map((id) => ({
              id_employes: id,
              nom_employes: '',
              prenom_employes: '',
              email_employes: '',
              // Ajoute d'autres champs requis par le type Employe si besoin
            }))
          : [],
      };

      await updateIntervention(parseInt(id), interventionData as Intervention);
      toast.success("L'intervention a été mise à jour avec succès");
      navigate(`/technique/interventions/${id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'intervention:", error);
      toast.error(
        "Une erreur est survenue lors de la mise à jour de l'intervention"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !intervention) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center h-64">
            <p>Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Modifier l'intervention</h1>
            <p className="text-muted-foreground mt-2">
              Modifiez les détails de l'intervention #{id}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/technique/interventions")}
            >
              <Home className="mr-2 h-4 w-4" />
              Tableau de bord
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/technique/interventions/liste")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Voir toutes les interventions
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/technique/interventions/rapports")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Rapports
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/technique/interventions/${id}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux détails
            </Button>
          </div>
        </div>

        {intervention && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <InterventionForm
                intervention={intervention}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
