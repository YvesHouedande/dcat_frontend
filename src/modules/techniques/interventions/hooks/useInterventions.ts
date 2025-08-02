import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInterventions,
  createIntervention,
  updateIntervention,
  deleteIntervention,
  assignEmployeeToIntervention,
  assignSuperviseurToIntervention,
  removeEmployeeFromIntervention,
  getInterventionById
} from '../api/intervention';
import { Intervention, UpdateInterventionPayload, ApiResponse } from '../interface/interface';
import { toast } from 'sonner';

// Clés de requête pour TanStack Query
export const interventionKeys = {
  all: ['interventions'] as const,
  lists: () => [...interventionKeys.all, 'list'] as const,
  list: (filters: string) => [...interventionKeys.lists(), { filters }] as const,
  details: () => [...interventionKeys.all, 'detail'] as const,
  detail: (id: number) => [...interventionKeys.details(), id] as const,
};

// Type guard pour vérifier si un objet a une propriété id_intervention
const hasInterventionId = (obj: unknown): obj is { id_intervention: number } => {
  return typeof obj === 'object' && obj !== null && 'id_intervention' in obj;
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
  // Essayer response.data.intervention.id_intervention (structure réelle de l'API)
  if (response.data?.intervention?.id_intervention) {
    return response.data.intervention.id_intervention;
  }
  
  // Essayer response.intervention.id_intervention (fallback)
  if (response.intervention?.id_intervention) {
    return response.intervention.id_intervention;
  }
  
  // Essayer response.data.id_intervention (si data est directement l'intervention)
  if (response.data && hasInterventionId(response.data)) {
    return response.data.id_intervention;
  }
  
  // Essayer response.id_intervention (si la réponse est directement l'intervention)
  if (hasInterventionId(response)) {
    return response.id_intervention;
  }
  
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

 