import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { retourService } from '../services/retour.service';
import { RetourSchemaFormsValue } from '../types';
import { PaginationParams } from '../../exemplaire';
import { idSotieOutils } from '../../sorties/types';
import { toast } from 'sonner';

// Clés de requête pour TanStack Query
export const retourSortiesKeys = {
  all: [ 'retourSorties'] as const,
  lists: () => [...retourSortiesKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...retourSortiesKeys.lists(), params] as const,
  details: () => [...retourSortiesKeys.all, 'detail'] as const,
  detail: (id: idSotieOutils) => [...retourSortiesKeys.details(), id] as const,
};

export const useRetourSorties = (params: PaginationParams = { page: 1, pageSize: 10 }) => {
  const queryClient = useQueryClient();

  // Récupération des retours avec pagination
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: retourSortiesKeys.list(params),
    queryFn: () => retourService.getAll(params),
    staleTime: 15 * 60 * 1000, // 15 minutes (optionnel)
  });

  // Mutation pour créer un retour
  const createMutation = useMutation({
    mutationFn: (newData: RetourSchemaFormsValue) => 
      retourService.create(newData),
    onSuccess: () => {
      // Invalider et rafraîchir la liste après création
      queryClient.invalidateQueries({ queryKey: retourSortiesKeys.lists() });
    },
  });

  // Mutation pour mettre à jour un retour
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: idSotieOutils, data: Omit<RetourSchemaFormsValue,  "id_exemplaire" | "id_employes" | "date_de_retour"> }) => 
      { 
        await new Promise((resolve)=>setTimeout(resolve,200)),
        await retourService.update(id, data)
      },
    onSuccess: (_, { id }) => {
      // Invalider à la fois la liste et l'élément spécifique
      queryClient.invalidateQueries({ queryKey: retourSortiesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: retourSortiesKeys.lists() });
    },
    onError: (error)=>{
      toast.error("Erreur lors de la suppression", {
        duration: 2000,
        description:
          error instanceof Error
            ? error.message
            : "Une erreur inconnue est survenue",
      });
    }
  });

  // Mutation pour supprimer un retour
  const deleteMutation = useMutation({
    mutationFn: async (id: idSotieOutils) => {
      await new Promise(res => setTimeout(res, 200));
      await retourService.delete(id);
    },
    onSuccess: () => {
      // Invalider et rafraîchir la liste après suppression
      queryClient.invalidateQueries({ queryKey: retourSortiesKeys.lists() });
      toast.success("Suppression réussie !", {
        duration: 2000,
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression", {
        duration: 2000,
        description:
          error instanceof Error
            ? error.message
            : "Une erreur inconnue est survenue",
      });
    },
  });

  return {
    // Données et état de chargement
    retourSorties: data?.data ?? [] ,
    pagination: data ? {
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
    } : {
      total: 0,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: 0,
    },
    loading: isLoading,
    error,

    // Actions avec l'API
    fetchRetourSorties: (newParams: PaginationParams) => {
      return queryClient.fetchQuery({
        queryKey: retourSortiesKeys.list(newParams),
        queryFn: () => retourService.getAll(newParams),
      });
    },
    createRetourSortie: createMutation.mutateAsync,
    updateRetourSortie: (id: idSotieOutils, data: Omit<RetourSchemaFormsValue, "id_exemplaire" | "id_employes" | "date_de_retour">) => 
      updateMutation.mutateAsync({ id, data }),
    deleteRetourSortie: deleteMutation.mutateAsync,

    // État des mutations
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
};

// Hook pour récupérer un seul exemplaire
export const useRetourSortie = (id: idSotieOutils) => {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: retourSortiesKeys.detail(id),
    queryFn: () => retourService.getById(id),
  });

  return {
    RetourSortie: data,
    loading: isLoading,
    error,
  };
};