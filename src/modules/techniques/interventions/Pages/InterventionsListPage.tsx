import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Intervention } from "../interface/interface";
import { InterventionForm } from "../components/InterventionForm";
import { InterventionsList } from "../components/InterventionsList";
import { createIntervention, deleteIntervention } from "../api/intervention";
import Layout from "@/components/Layout";
import { Plus, Home, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAxiosErrorMessage } from "@/api/api";
import { AxiosError } from "axios";

export const InterventionsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIntervention, setSelectedIntervention] =
    useState<Intervention | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
  };

  const handleCreateSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Validation des champs requis
      if (!data.id_partenaire || data.id_partenaire === 0) {
        throw new Error("Le client est requis");
      }

      // S'assurer que les valeurs numériques sont bien des nombres
      const id_partenaire = parseInt(data.id_partenaire.toString());
      if (isNaN(id_partenaire)) {
        throw new Error("ID du client invalide");
      }

      // Fonction pour tronquer le texte à une longueur maximale
      const truncateText = (text: string, maxLength: number) => {
        if (!text) return "";
        return text.trim().substring(0, maxLength);
      };

      // Format the data to match the API expectations with length limitations
      const formattedData = {
        date_intervention: data.date_intervention,
        id_partenaire: id_partenaire,
        probleme_signale: truncateText(data.probleme_signale, 50),
        type_intervention: truncateText(data.type_intervention, 50),
        type_defaillance: truncateText(data.type_defaillance, 50),
        cause_defaillance: truncateText(data.cause_defaillance, 50),
        detail_cause: data.detail_cause || "",
        rapport_intervention: truncateText(data.rapport_intervention, 50),
        recommandation: truncateText(data.recommandation, 50),
        duree: truncateText(data.duree, 50),
        lieu: truncateText(data.lieu, 50),
        mode_intervention: truncateText(
          data.mode_intervention || "Standard",
          50
        ),
        type: truncateText(data.type_intervention, 50),
        id_contrat: null,
        statut_intervention: "à faire",
      };

      // Vérification que tous les champs requis sont présents et non vides
      const requiredFields = [
        "date_intervention",
        "type_intervention",
        "type_defaillance",
        "cause_defaillance",
        "lieu",
        "duree",
      ] as const;

      const missingFields = requiredFields.filter(
        (field) => !formattedData[field as keyof typeof formattedData]
      );
      if (missingFields.length > 0) {
        throw new Error(
          `Les champs suivants sont requis : ${missingFields.join(", ")}`
        );
      }

      // Log des données avant envoi
      console.log("Données brutes du formulaire:", data);
      console.log("Données formatées envoyées à l'API:", formattedData);

      try {
        const response = await createIntervention(formattedData);
        console.log("Réponse de l'API:", response);

        if (response.success === false) {
          throw new Error(
            response.message || "Erreur lors de la création de l'intervention"
          );
        }

        toast.success("Intervention créée avec succès");
        setIsCreateDialogOpen(false);
        window.location.reload();
      } catch (apiError: unknown) {
        console.error("Erreur API:", apiError);
        throw new Error(getAxiosErrorMessage(apiError));
      }
    } catch (error: unknown) {
      console.error("Erreur lors de la création:", error);
      toast.error(
        getAxiosErrorMessage(error as AxiosError) ||
          "Une erreur inattendue est survenue"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedIntervention) return;
    setIsLoading(true);
    try {
      await deleteIntervention(selectedIntervention.id_intervention);
      setIsDeleteDialogOpen(false);
      toast.success("L'intervention a été supprimée avec succès.");
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'intervention:", error);
      toast.error(
        "Une erreur est survenue lors de la suppression de l'intervention."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Liste des Interventions</h1>
            <p className="text-muted-foreground mt-2">
              Gérez toutes les interventions techniques
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
              onClick={() => navigate("/technique/interventions/rapports")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Rapports
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Intervention
            </Button>
          </div>
        </div>

        {/* Liste complète des interventions */}
        <div className="space-y-4">
          <InterventionsList onDelete={handleDeleteClick} />
        </div>

        {/* Dialog de création */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle Intervention</DialogTitle>
              <DialogDescription>
                Créez une nouvelle fiche d'intervention
              </DialogDescription>
            </DialogHeader>
            <InterventionForm
              onSubmit={handleCreateSubmit}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmation de suppression */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette intervention ? Cette
                action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                {isLoading ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};
