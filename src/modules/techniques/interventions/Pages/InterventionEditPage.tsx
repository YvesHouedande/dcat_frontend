import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Intervention } from "../interface/interface";
import { getInterventionById, updateIntervention, assignEmployeeToIntervention, assignSuperviseurToIntervention, removeEmployeeFromIntervention, getInterventionEmployees } from "../api/intervention";
import { InterventionForm } from "../components/InterventionForm";
import { useQueryClient } from "@tanstack/react-query";

// Fonction utilitaire pour tronquer les textes très longs
const truncateLongText = (text: string | undefined, maxLength: number = 5000): string | undefined => {
  if (!text) return text;
  if (text.length <= maxLength) return text;
  
  console.warn(`⚠️ [InterventionEditPage] Texte tronqué de ${text.length} à ${maxLength} caractères`);
  return text.substring(0, maxLength) + "...";
};

// Type pour les données du formulaire
type FormData = {
  date_intervention: string;
  id_partenaire: number;
  probleme_signale?: string;
  type_intervention?: "Corrective" | "Préventive";
  type_defaillance?: "Électrique" | "Matérielle" | "Logiciel";
  cause_defaillance?:
    | "Usure normale"
    | "Défaut utilisateur"
    | "Défaut produit"
    | "Autre";
  detail_cause?: string;
  rapport_intervention?: string;
  recommandation?: string;
  duree?: string;
  lieu?: string;
  mode_intervention?: string;
  statut_intervention?: "à faire" | "en cours" | "en attente" | "terminé";
  employes?: number[];
  superviseur?: number;
  id_contrat?: number | null;
};

import { Button } from "@/components/ui/button";
import { Home, FileText, BarChart3, ArrowLeft } from "lucide-react";

export const InterventionEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        const [interventionResponse, employeesResponse] = await Promise.all([
          getInterventionById(parseInt(id)),
          getInterventionEmployees(parseInt(id))
        ]);
        
        if (interventionResponse.data) {
          // Charger les employés assignés et les ajouter à l'intervention
          const employees = employeesResponse.data || [];
          
          console.log("🔍 [InterventionEditPage] Employés chargés:", employees);
          console.log("🔍 [InterventionEditPage] Nombre d'employés:", employees.length);
          
          const interventionWithEmployees = {
            ...interventionResponse.data,
            employes: employees
          };
          
          console.log("🔍 [InterventionEditPage] Intervention avec employés:", interventionWithEmployees);
          
          setIntervention(interventionWithEmployees);
        } else {
          toast.error("Intervention non trouvée");
          navigate("/gestion-des-interventions/interventions");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement des données");
        navigate("/gestion-des-interventions/interventions");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleSubmit = async (data: FormData) => {
    if (!id) return;
    setIsLoading(true);

    try {
      // Préparer le payload de mise à jour (sans les employés ni le superviseur)
      const interventionData: Partial<Intervention> = {};
      
      // Ajouter seulement les champs avec des valeurs valides
      if (data.date_intervention) interventionData.date_intervention = data.date_intervention;
      if (data.id_partenaire) interventionData.id_partenaire = data.id_partenaire;
      if (data.probleme_signale !== undefined) interventionData.probleme_signale = truncateLongText(data.probleme_signale);
      if (data.type_intervention) interventionData.type_intervention = data.type_intervention;
      if (data.type_defaillance) interventionData.type_defaillance = data.type_defaillance;
      if (data.cause_defaillance) interventionData.cause_defaillance = data.cause_defaillance;
      if (data.detail_cause !== undefined) interventionData.detail_cause = truncateLongText(data.detail_cause);
      if (data.rapport_intervention !== undefined) interventionData.rapport_intervention = truncateLongText(data.rapport_intervention);
      if (data.recommandation !== undefined) interventionData.recommandation = truncateLongText(data.recommandation);
      if (data.duree) interventionData.duree = data.duree;
      if (data.lieu) interventionData.lieu = data.lieu;
      if (data.mode_intervention) interventionData.mode_intervention = data.mode_intervention;
      if (data.statut_intervention) interventionData.statut_intervention = data.statut_intervention;
      if (intervention?.type) interventionData.type = intervention.type;
      // Gérer le contrat - peut être null pour dissocier un contrat
      if (data.id_contrat !== undefined) {
        interventionData.id_contrat = data.id_contrat;
      }
    
      console.log("🔍 [InterventionEditPage] Données envoyées à updateIntervention:", interventionData);
      console.log("🔍 [InterventionEditPage] ID de l'intervention:", id);
      
      // Mesurer la taille des données
      const payloadSize = JSON.stringify(interventionData).length;
      console.log("🔍 [InterventionEditPage] Taille du payload:", payloadSize, "caractères");
      
      // Vérifier les champs de texte long
      const longTextFields = {
        probleme_signale: interventionData.probleme_signale?.length || 0,
        detail_cause: interventionData.detail_cause?.length || 0,
        rapport_intervention: interventionData.rapport_intervention?.length || 0,
        recommandation: interventionData.recommandation?.length || 0
      };
      console.log("🔍 [InterventionEditPage] Tailles des champs de texte:", longTextFields);
      
      // Avertissement si un champ est très long
      Object.entries(longTextFields).forEach(([field, length]) => {
        if (length > 1000) {
          console.warn(`⚠️ [InterventionEditPage] Champ ${field} très long: ${length} caractères`);
        }
      });
    
      // Mettre à jour l'intervention
      await updateIntervention(parseInt(id), interventionData as Intervention);

      // Gérer les assignations d'employés séparément
      const interventionId = parseInt(id);
      
      // Récupérer les employés actuellement assignés
      const currentEmployeesResponse = await getInterventionEmployees(interventionId);
      const currentEmployees = currentEmployeesResponse.data || [];
      const currentEmployeeIds = currentEmployees.map(emp => emp.id_employes);
      
      // Identifier les employés à ajouter et à supprimer
      const employeesToAdd = (data.employes || []).filter(id => !currentEmployeeIds.includes(id));
      const employeesToRemove = currentEmployeeIds.filter(id => !(data.employes || []).includes(id));

      // Supprimer les employés qui ne sont plus assignés
      for (const employeeId of employeesToRemove) {
        try {
          await removeEmployeeFromIntervention(interventionId, employeeId);
          console.log(`Employé ${employeeId} retiré avec succès`);
        } catch (error) {
          console.error(`Erreur lors du retrait de l'employé ${employeeId}:`, error);
        }
      }

      // Ajouter les nouveaux employés
      for (const employeeId of employeesToAdd) {
        try {
          await assignEmployeeToIntervention(interventionId, employeeId);
          console.log(`Employé ${employeeId} assigné avec succès`);
        } catch (error) {
          console.error(`Erreur lors de l'assignation de l'employé ${employeeId}:`, error);
        }
      }

      // Gérer le superviseur séparément
      try {
        // Vérifier si le superviseur a changé
        const currentSuperviseur = intervention?.id_superviseur;
        
        if (currentSuperviseur !== data.superviseur) {
          // Assigner le nouveau superviseur via la fonction dédiée
          if (data.superviseur && data.superviseur > 0) {
            await assignSuperviseurToIntervention(interventionId, data.superviseur);
            console.log(`Nouveau superviseur ${data.superviseur} assigné avec succès`);
          } else {
            // Si aucun superviseur n'est sélectionné, mettre à jour le champ à null
            await updateIntervention(interventionId, { id_superviseur: null });
            console.log(`Superviseur retiré avec succès`);
          }
        }
      } catch (superviseurError) {
        console.error(`Erreur lors de la gestion du superviseur:`, superviseurError);
      }

      toast.success("L'intervention a été mise à jour avec succès");
      
      // Invalider le cache pour forcer le rechargement des données
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      
      navigate(`/gestion-des-interventions/interventions/${id}`);
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
              onClick={() => navigate("/gestion-des-interventions/interventions")}
            >
              <Home className="mr-2 h-4 w-4" />
              Tableau de bord
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/gestion-des-interventions/interventions/liste")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Voir toutes les interventions
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/gestion-des-interventions/interventions/rapports")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Rapports
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/gestion-des-interventions/interventions/${id}`)}
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