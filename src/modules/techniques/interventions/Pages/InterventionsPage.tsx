import React, { useState, useEffect, useMemo } from "react";
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
import {
  createIntervention,
  deleteIntervention,
  getInterventions,
  assignSuperviseurToIntervention,
} from "../api/intervention";
import Layout from "@/components/Layout";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays} from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, FileText, BarChart3, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAssignEmployeesToIntervention, extractInterventionId } from "../hooks/useInterventions";
import { 
  isRecursiveObject,
  findInterventionIdRecursively 
} from "../types/utils";

export const InterventionsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIntervention] =
    useState<Intervention | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Hook pour l'assignation des employés
  const assignEmployeesMutation = useAssignEmployeesToIntervention();

  const refreshData = async () => {
    try {
      setIsLoadingData(true);
      // Récupérer toutes les interventions (sans limite)
      const interventionsResponse = await getInterventions(1, 1000);
      setInterventions(interventionsResponse.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Calcul des KPIs et données des graphiques
  const dashboardData = useMemo(() => {
    if (!interventions.length) return null;

    const now = new Date();
    const last30Days = subDays(now, 30);

    // 1. Interventions des 30 derniers jours
    const recentInterventions = interventions.filter(
      (int) => new Date(int.date_intervention) >= last30Days
    );



    // 3. Temps moyen d'intervention (toutes les interventions)
    const avgDuration = interventions.reduce((acc, curr) => {
      const matches = curr.duree.match(/(\d+)h(?:(\d+))?/);
      if (matches) {
        const hours = parseInt(matches[1]) || 0;
        const minutes = parseInt(matches[2]) || 0;
        return acc + (hours * 60 + minutes);
      }
      return acc;
    }, 0) / interventions.length;

    // 4. Types de défaillances les plus courants (toutes les interventions)
    const defaillanceCount = interventions.reduce((acc, curr) => {
      acc[curr.type_defaillance] = (acc[curr.type_defaillance] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 5. Types d'intervention (toutes les interventions)
    const interventionTypeCount = interventions.reduce((acc, curr) => {
      acc[curr.type_intervention] = (acc[curr.type_intervention] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 6. Statuts des interventions (toutes les interventions)
    const statutCount = interventions.reduce((acc, curr) => {
      acc[curr.statut_intervention] = (acc[curr.statut_intervention] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 7. Interventions par jour de la semaine (toutes les interventions)
    const weeklyInterventions = interventions.reduce((acc, curr) => {
      const dayOfWeek = format(new Date(curr.date_intervention), "EEEE", { locale: fr });
      acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 9. Interventions en cours et en attente
    const interventionsEnCours = interventions.filter(
      (int) => int.statut_intervention === "en cours"
    ).length;
    const interventionsEnAttente = interventions.filter(
      (int) => int.statut_intervention === "en attente"
    ).length;

    return {
      totalInterventions: interventions.length,
      recentInterventions: recentInterventions.length,
      avgDurationFormatted: `${Math.floor(avgDuration / 60)}h${Math.round(
        avgDuration % 60
      )}`,
      interventionsEnCours,
      interventionsEnAttente,
      weeklyInterventions: Object.entries(weeklyInterventions)
        .sort((a, b) => {
          const daysOrder = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
          return daysOrder.indexOf(a[0]) - daysOrder.indexOf(b[0]);
        })
        .map(([day, count]) => ({
          jour: day.charAt(0).toUpperCase() + day.slice(1),
          interventions: count,
        })),
      defaillances: Object.entries(defaillanceCount)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({
          name,
          value,
        })),
      typesIntervention: Object.entries(interventionTypeCount)
        .map(([name, value]) => ({
          name,
          value,
        })),
      statuts: Object.entries(statutCount)
        .map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        })),
    };
  }, [interventions]);

  const COLORS = ["#2563eb", "#16a34a", "#ea580c", "#8b5cf6", "#db2777", "#f59e0b", "#10b981"];

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

  const handleCreateSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Validation des champs requis
      if (!data.id_partenaire || data.id_partenaire === 0) {
        throw new Error("Le client est requis");
      }

      // S'assurer que les valeurs numériques sont bien des nombres
      const id_partenaire = data.id_partenaire; // Déjà un number dans FormData

      // Fonction pour tronquer le texte à une longueur maximale
      const truncateText = (text: string, maxLength: number) => {
        if (!text) return "";
        return text.trim().substring(0, maxLength);
      };

      // Format the data to match the API expectations with length limitations
      // Note: employes and superviseur will be handled separately via assignEmployeeToIntervention and assignSuperviseurToIntervention
      const formattedData = {
        date_intervention: data.date_intervention,
        id_partenaire: id_partenaire,
        probleme_signale: data.probleme_signale || "",
        type_intervention: truncateText(data.type_intervention || "", 50),
        type_defaillance: truncateText(data.type_defaillance || "", 50),
        cause_defaillance: truncateText(data.cause_defaillance || "", 50),
        detail_cause: data.detail_cause || "",
        rapport_intervention: data.rapport_intervention || "",
        recommandation: data.recommandation || "",
        duree: truncateText(data.duree || "", 50),
        lieu: truncateText(data.lieu || "", 50),
        mode_intervention: truncateText(
          data.mode_intervention || "Standard",
          50
        ),
        type: truncateText(data.type_intervention || "", 50),
        id_contrat: data.id_contrat ?? null,
        statut_intervention: data.statut_intervention || "à faire",
        // Ne pas inclure superviseur ici, il sera traité séparément
      };

      // Vérification que seuls les champs vraiment essentiels sont présents
      const requiredFields = [
        "date_intervention",
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
        console.log("Réponse complète de l'API:", response);
        console.log("Structure de la réponse:", {
          success: response.success,
          data: response.data,
          intervention: response.intervention,
          message: response.message
        });

        if (response.success === false) {
          throw new Error(
            response.message || "Erreur lors de la création de l'intervention"
          );
        }

        // Log détaillé avant extraction de l'ID
        console.log("🔍 [InterventionsPage] Avant extractInterventionId:");
        console.log("- Type de response:", typeof response);
        console.log("- Clés de response:", Object.keys(response || {}));
        console.log("- response.data:", response.data);
        console.log("- response.intervention:", response.intervention);
        console.log("- response.success:", response.success);

        // Récupérer l'ID de l'intervention créée selon la structure de réponse
        let interventionId: number;
        try {
          interventionId = extractInterventionId(response);
        } catch (extractError) {
          console.error("❌ [InterventionsPage] Erreur lors de l'extraction de l'ID:", extractError);
          
          // Solution de secours : chercher l'ID manuellement
          console.log("🔄 [InterventionsPage] Tentative de récupération manuelle de l'ID...");
          
          // Essayer différentes structures possibles
          if (isRecursiveObject(response)) {
            const foundId = findInterventionIdRecursively(response);
            if (foundId !== null) {
              console.log("✅ [InterventionsPage] ID trouvé manuellement:", foundId);
              interventionId = foundId;
            } else {
              throw new Error("Impossible de récupérer l'ID de l'intervention - aucune méthode n'a fonctionné");
            }
          } else {
            throw new Error("Réponse invalide - impossible de récupérer l'ID");
          }
        }
        
        console.log("ID de l'intervention créée:", interventionId);
        
        // Assigner les employés et le superviseur en utilisant les hooks appropriés
        if (data.employes && data.employes.length > 0) {
          await assignEmployeesMutation.mutateAsync({
            interventionId,
            employes: data.employes,
            superviseur: 0 // Pas de superviseur ici
          });
        }
        
        // Assigner le superviseur séparément
        if (data.superviseur && data.superviseur > 0) {
          await assignSuperviseurToIntervention(interventionId, data.superviseur);
        }

        toast.success("L'intervention a été créée avec succès.");

        setIsCreateDialogOpen(false);

        // Invalider le cache pour forcer le rechargement des données
        queryClient.invalidateQueries({ queryKey: ['interventions'] });
        
        // Recharger la liste des interventions sans rafraîchir la page
        refreshData();
      } catch (apiError) {
        console.error("Erreur détaillée de l'API:", apiError);
        if (axios.isAxiosError(apiError) && apiError.response) {
          console.log("Status:", apiError.response.status);
          console.log("Headers:", apiError.response.headers);
          console.log("Data:", apiError.response.data);
        }
        throw apiError;
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'intervention:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Une erreur est survenue lors de la création de l'intervention";
        toast.error(errorMessage);
        console.log("Réponse d'erreur de l'API:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur inattendue est survenue");
      }
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
      
      // Invalider le cache pour forcer le rechargement des données
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      
      // Recharger la liste des interventions sans rafraîchir la page
      refreshData();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'intervention:", error);
      toast.error(
        "Une erreur est survenue lors de la suppression de l'intervention."
      );
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoadingData) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Chargement des données...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Tableau de Bord des Interventions</h1>
            <p className="text-muted-foreground mt-2">
              Vue d'ensemble de toutes les interventions techniques
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                navigate("/gestion-des-interventions/interventions/liste")
              }
            >
              <FileText className="mr-2 h-4 w-4" />
              Voir toutes les interventions
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate("/gestion-des-interventions/interventions/rapports")
              }
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

        {/* Dashboard Section */}
        {dashboardData && (
          <div className="space-y-6">
                         {/* KPI Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Card>
                 <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                     <TrendingUp className="mr-2 h-4 w-4" />
                     Total Interventions
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold text-blue-600">
                     {dashboardData.totalInterventions}
                   </div>
                   <p className="text-xs text-muted-foreground">
                     {dashboardData.recentInterventions} dans les 30 derniers jours
                   </p>
                 </CardContent>
               </Card>
               
               <Card>
                 <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                     <Clock className="mr-2 h-4 w-4" />
                     Durée Moyenne
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold text-green-600">
                     {dashboardData.avgDurationFormatted}
                   </div>
                   <p className="text-xs text-muted-foreground">
                     Par intervention
                   </p>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                     <AlertTriangle className="mr-2 h-4 w-4" />
                     En Cours
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold text-orange-600">
                     {dashboardData.interventionsEnCours}
                   </div>
                   <p className="text-xs text-muted-foreground">
                     {dashboardData.interventionsEnAttente} en attente
                   </p>
                 </CardContent>
               </Card>
             </div>

                         {/* Charts Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Distribution par type de défaillance */}
               <Card>
                 <CardHeader>
                   <CardTitle>Types de Défaillances</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="h-[400px]">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie
                           data={dashboardData.defaillances}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           label={({ name, percent }) =>
                             `${name} (${(percent * 100).toFixed(0)}%)`
                           }
                           outerRadius={120}
                           fill="#8884d8"
                           dataKey="value"
                         >
                           {dashboardData.defaillances.map((_entry, index) => (
                             <Cell
                               key={`cell-${index}`}
                               fill={COLORS[index % COLORS.length]}
                             />
                           ))}
                         </Pie>
                         <Tooltip />
                         <Legend />
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                 </CardContent>
               </Card>

               {/* Interventions par statut */}
               <Card>
                 <CardHeader>
                   <CardTitle>Interventions par Statut</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="h-[400px]">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={dashboardData.statuts}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="name" />
                         <YAxis />
                         <Tooltip />
                         <Bar dataKey="value" fill="#8b5cf6" />
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                 </CardContent>
               </Card>
             </div>
          </div>
        )}

        {/* Dialog de création */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
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
