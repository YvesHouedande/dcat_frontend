import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getInterventions, 
  getInterventionById, 
  createIntervention, 
  updateIntervention, 
  deleteIntervention,
  assignEmployeeToIntervention,
  removeEmployeeFromIntervention,
  assignSuperviseurToIntervention,
  getAllInterventionDocuments,
  getInterventionDocuments
} from '../api/intervention';
import { Intervention, ApiResponse, UpdateInterventionPayload } from '../interface/interface';
import { 
  hasInterventionId, 
  isRecursiveObject,
  findInterventionIdRecursively 
} from '../types/utils';

// Clés de requête pour TanStack Query
const interventionKeys = {
  all: ['interventions'] as const,
  lists: () => [...interventionKeys.all, 'list'] as const,
  list: (filters: string) => [...interventionKeys.lists(), { filters }] as const,
  details: () => [...interventionKeys.all, 'detail'] as const,
  detail: (id: number) => [...interventionKeys.details(), id] as const,
  documents: () => [...interventionKeys.all, 'documents'] as const,
  documentsList: (page: number, limit: number) => [...interventionKeys.documents(), 'list', { page, limit }] as const,
  interventionDocuments: (interventionId: number) => [...interventionKeys.documents(), 'intervention', interventionId] as const,
};

// Types pour les résultats d'assignation
type AssignmentResult = {
  type: 'superviseur' | 'employe';
  id: number;
  success: boolean;
  error?: unknown;
};

// Fonction utilitaire pour extraire l'ID de l'intervention depuis la réponse API
export const extractInterventionId = (response: ApiResponse<Intervention>): number => {
  // Essayer response.data.id_intervention (si data est directement l'intervention)
  if (response.data && hasInterventionId(response.data)) {
    console.log("✅ [extractInterventionId] Trouvé dans response.data.id_intervention:", response.data.id_intervention);
    return response.data.id_intervention;
  }
  
  // Essayer response.intervention.id_intervention
  if (response.intervention && hasInterventionId(response.intervention)) {
    console.log("✅ [extractInterventionId] Trouvé dans response.intervention.id_intervention:", response.intervention.id_intervention);
    return response.intervention.id_intervention;
  }
  
  // Essayer si la réponse est directement l'intervention (sans wrapper ApiResponse)
  if (hasInterventionId(response)) {
    console.log("✅ [extractInterventionId] Trouvé directement dans response.id_intervention:", response.id_intervention);
    return response.id_intervention;
  }
  
  // Version de secours : chercher récursivement dans l'objet
  if (isRecursiveObject(response)) {
    const foundId = findInterventionIdRecursively(response);
    if (foundId !== null) {
      console.log("✅ [extractInterventionId] Trouvé récursivement:", foundId);
      return foundId;
    }
  }
  
  // Log détaillé pour debug
  console.error("❌ [extractInterventionId] Impossible de trouver l'ID. Structure de la réponse:");
  console.error("- response.data:", response.data);
  console.error("- response.intervention:", response.intervention);
  console.error("- response.success:", response.success);
  console.error("- response.message:", response.message);
  console.error("- JSON complet:", JSON.stringify(response, null, 2));
  
  throw new Error("Impossible de récupérer l'ID de l'intervention depuis la réponse API");
};

// Hook pour récupérer la liste des interventions
export const useInterventions = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: interventionKeys.list(`${page}-${limit}`),
    queryFn: () => getInterventions(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook pour récupérer une intervention par ID
export const useIntervention = (id: number) => {
  return useQuery({
    queryKey: interventionKeys.detail(id),
    queryFn: () => getInterventionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour créer une intervention
export const useCreateIntervention = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIntervention,
    onSuccess: () => {
      // Invalider toutes les requêtes d'interventions
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
      toast.success('Intervention créée avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création de l\'intervention');
    },
  });
};

// Hook pour mettre à jour une intervention
export const useUpdateIntervention = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInterventionPayload }) =>
      updateIntervention(id, data),
    onSuccess: (data, variables) => {
      // Invalider toutes les requêtes d'interventions
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
      // Mettre à jour le cache de l'intervention spécifique
      queryClient.setQueryData(interventionKeys.detail(variables.id), data);
      toast.success('Intervention mise à jour avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de l\'intervention');
    },
  });
};

// Hook pour supprimer une intervention
export const useDeleteIntervention = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIntervention,
    onSuccess: (_, variables) => {
      // Invalider toutes les requêtes d'interventions
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
      // Supprimer l'intervention du cache
      queryClient.removeQueries({ queryKey: interventionKeys.detail(variables) });
      toast.success('Intervention supprimée avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de l\'intervention');
    },
  });
};

// Hook pour assigner un employé à une intervention
export const useAssignEmployeeToIntervention = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ interventionId, employeeId }: { interventionId: number; employeeId: number }) =>
      assignEmployeeToIntervention(interventionId, employeeId),
    onSuccess: () => {
      // Invalider les requêtes d'interventions
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
      toast.success('Employé assigné avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de l\'assignation:', error);
      toast.error('Erreur lors de l\'assignation de l\'employé');
    },
  });
};

// Hook pour retirer un employé d'une intervention
export const useRemoveEmployeeFromIntervention = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ interventionId, employeeId }: { interventionId: number; employeeId: number }) =>
      removeEmployeeFromIntervention(interventionId, employeeId),
    onSuccess: () => {
      // Invalider les requêtes d'interventions
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
      toast.success('Employé retiré avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors du retrait:', error);
      toast.error('Erreur lors du retrait de l\'employé');
    },
  });
};

// Hook pour assigner un superviseur à une intervention
export const useAssignSuperviseurToIntervention = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ interventionId, superviseurId }: { interventionId: number; superviseurId: number }) =>
      assignSuperviseurToIntervention(interventionId, superviseurId),
    onSuccess: () => {
      // Invalider les requêtes d'interventions
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
      toast.success('Superviseur assigné avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de l\'assignation du superviseur:', error);
      toast.error('Erreur lors de l\'assignation du superviseur');
    },
  });
};

// Hook utilitaire pour assigner les employés et superviseur après création d'intervention
export const useAssignEmployeesToIntervention = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      interventionId, 
      employes, 
      superviseur 
    }: { 
      interventionId: number; 
      employes: number[]; 
      superviseur?: number; 
    }) => {
      const results: AssignmentResult[] = [];
      
      // Assigner le superviseur s'il est spécifié
      if (superviseur && superviseur > 0) {
        try {
          await assignSuperviseurToIntervention(interventionId, superviseur);
          results.push({ type: 'superviseur', id: superviseur, success: true });
        } catch (error) {
          results.push({ type: 'superviseur', id: superviseur, success: false, error });
        }
      }
      
      // Assigner les employés
      for (const employeeId of employes) {
        try {
          await assignEmployeeToIntervention(interventionId, employeeId);
          results.push({ type: 'employe', id: employeeId, success: true });
        } catch (error) {
          results.push({ type: 'employe', id: employeeId, success: false, error });
        }
      }
      
      return results;
    },
    onSuccess: (results) => {
      // Invalider les requêtes d'interventions
      queryClient.invalidateQueries({ queryKey: interventionKeys.all });
      
      // Afficher un message de succès
      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;
      
      if (successCount === totalCount) {
        toast.success(`Tous les employés (${totalCount}) ont été assignés avec succès`);
      } else {
        toast.success(`${successCount}/${totalCount} employés assignés avec succès`);
      }
    },
    onError: (error) => {
      console.error('Erreur lors de l\'assignation des employés:', error);
      toast.error('Erreur lors de l\'assignation des employés');
    },
  });
};

// Hook pour récupérer tous les documents des interventions avec pagination
export const useAllInterventionDocuments = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: interventionKeys.documentsList(page, limit),
    queryFn: () => getAllInterventionDocuments(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook pour récupérer les documents d'une intervention spécifique
export const useInterventionDocuments = (interventionId: number) => {
  return useQuery({
    queryKey: interventionKeys.interventionDocuments(interventionId),
    queryFn: () => getInterventionDocuments(interventionId),
    enabled: !!interventionId,
    staleTime: 5 * 60 * 1000,
  });
};

 