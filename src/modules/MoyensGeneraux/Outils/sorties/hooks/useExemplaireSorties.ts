import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExemplaireSortieFormValues, idSotieOutils, PaginationParams } from "../types";
import { exemplaireSortieService } from "../services/exemplaireSortie.service";

// Clés de requête pour TanStack Query
export const exemplaireSortiesKeys = {
  all: ['exemplaireSorties'] as const,
  lists: () => [...exemplaireSortiesKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...exemplaireSortiesKeys.lists(), params] as const,
  details: () => [...exemplaireSortiesKeys.all, 'detail'] as const,
  detail: (id: idSotieOutils) => [...exemplaireSortiesKeys.details(), id] as const,
};

export const useExemplaireSorties = (params: PaginationParams = { page: 1, pageSize: 10 }) => {
  const queryClient = useQueryClient();

  // Récupération des exemplaires avec pagination
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: exemplaireSortiesKeys.list(params),
    queryFn: () => exemplaireSortieService.getAll(params),
    staleTime: 15 * 60 * 1000, // 15 minutes (optionnel)
  });

  // Mutation pour créer un exemplaire
  const createMutation = useMutation({
    mutationFn: (newData: ExemplaireSortieFormValues) => 
      exemplaireSortieService.create(newData),
    onSuccess: () => {
      // Invalider et rafraîchir la liste après création
      queryClient.invalidateQueries({ queryKey: exemplaireSortiesKeys.lists() });
    },
  });

  // Mutation pour mettre à jour un exemplaire
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: idSotieOutils, data: Omit<ExemplaireSortieFormValues,  "id_exemplaire" | "id_employes" | "date_de_sortie"> }) => 
      exemplaireSortieService.update(id, data),
    onSuccess: (_, { id }) => {
      // Invalider à la fois la liste et l'élément spécifique
      queryClient.invalidateQueries({ queryKey: exemplaireSortiesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: exemplaireSortiesKeys.lists() });
    },
  });

  // Mutation pour supprimer un exemplaire
  const deleteMutation = useMutation({
    mutationFn: (id: idSotieOutils) => exemplaireSortieService.delete(id),
    onSuccess: () => {
      // Invalider et rafraîchir la liste après suppression
      queryClient.invalidateQueries({ queryKey: exemplaireSortiesKeys.lists() });
    },
  });

  return {
    // Données et état de chargement
    exemplaireSorties: data?.data ?? [] ,
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
    fetchExemplaireSorties: (newParams: PaginationParams) => {
      return queryClient.fetchQuery({
        queryKey: exemplaireSortiesKeys.list(newParams),
        queryFn: () => exemplaireSortieService.getAll(newParams),
      });
    },
    createExemplaireSortie: createMutation.mutateAsync,
    updateExemplaireSortie: (id: idSotieOutils, data: Omit<ExemplaireSortieFormValues, "id_exemplaire" | "id_employes" | "date_de_sortie">) => 
      updateMutation.mutateAsync({ id, data }),
    deleteExemplaireSortie: deleteMutation,

    // État des mutations
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
};

// Hook pour récupérer un seul exemplaire
export const useExemplaireSortie = (id: idSotieOutils) => {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: exemplaireSortiesKeys.detail(id),
    queryFn: () => exemplaireSortieService.getById(id),
  });

  return {
    exemplaireSortie: data,
    loading: isLoading,
    error,
  };
};