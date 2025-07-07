// src/hooks/useExemplaireProduits.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ExemplaireProduit,
  PaginationParams,
  PaginatedResponse,
} from "../types";
import { ExemplaireOutilsService } from "..";

// Clés de query pour React Query
const PRODUCT_INSTANCES_KEY = "ExemplaireProduits";

const wait = <T>(result: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(result), 200));

export const useExemplaireOutils= () => {
  const queryClient = useQueryClient();
  // Récupérer la liste des instances de produit avec pagination
  const fetchExemplaireProduits = (params: PaginationParams) =>
    ExemplaireOutilsService.getAll(params);

  const {
    data: ExemplaireProduitsResponse,
    isLoading: loading,
    error,
  } = useQuery<PaginatedResponse<ExemplaireProduit>, Error>({
    queryKey: [PRODUCT_INSTANCES_KEY, { page: 1, pageSize: 10 }],
    queryFn: () => fetchExemplaireProduits({ page: 1, pageSize: 10 }),
    staleTime: 15 * 60 * 1000, // 15 minutes (optionnel)
  });

  // Créer une nouvelle instance de produit
  const createMutation = useMutation({
    mutationFn: async (
      data: Omit<ExemplaireProduit, "id_exemplaire" | "prix_exemplaire">
    ) => await wait(ExemplaireOutilsService.create(data)),
    // ExemplaireOutilsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
    },
    onError: (err: Error) => err || new Error("Erreur lors de la création"),
  });

  // Mettre à jour une instance de produit
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number;
      data: Omit<ExemplaireProduit, "prix_exemplaire">;
    }) => await wait(ExemplaireOutilsService.update(id, data)),
    // ExemplaireOutilsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
    },
    onError: (err: Error) => err || new Error("Erreur lors de la mise à jour"),
  });

  // Supprimer une instance de produit
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) =>
      await wait(ExemplaireOutilsService.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
    },
    onError: (err: Error) => err || new Error("Erreur lors de la suppression"),
  });

  return {
    ExemplaireProduits: ExemplaireProduitsResponse?.data ?? [],
    pagination: ExemplaireProduitsResponse
      ? {
          total: ExemplaireProduitsResponse.total,
          page: ExemplaireProduitsResponse.page,
          pageSize: ExemplaireProduitsResponse.pageSize,
          totalPages: ExemplaireProduitsResponse.totalPages,
        }
      : { total: 0, page: 1, pageSize: 10, totalPages: 0 },
    loading,
    error,
    fetchExemplaireProduits: (params: PaginationParams) =>
      queryClient.fetchQuery({
        queryKey: [PRODUCT_INSTANCES_KEY, params],
        queryFn: () => fetchExemplaireProduits(params),
      }),
    createExemplaireProduit: createMutation.mutateAsync,
    updateExemplaireProduit: updateMutation.mutateAsync,
    deleteExemplaireProduit: deleteMutation,
  };
};
