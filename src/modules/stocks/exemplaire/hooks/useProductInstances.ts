// src/hooks/useProductInstances.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginationParams, PaginatedResponse } from "../types";
import { useProductInstanceService } from "../services/productInstance.service";
import { ProductInstanceFormValues } from "../schemas/productInstanceSchema";

// Clés de query pour React Query
const PRODUCT_INSTANCES_KEY = "productInstances";


const wait = <T>(result: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(result), 200));
export const useProductInstances = () => {
  const productInstanceService = useProductInstanceService();
  const queryClient = useQueryClient();
  // Récupérer la liste des instances de produit avec pagination
  const fetchProductInstances = (params: PaginationParams) =>
    productInstanceService.getAll(params);
  const {
    data: productInstancesResponse,
    isLoading: loading,
    error,
  } = useQuery<PaginatedResponse<ProductInstanceFormValues>, Error>({
    queryKey: [PRODUCT_INSTANCES_KEY, { page: 1, pageSize: 10 }],
    queryFn: () => fetchProductInstances({ page: 1, pageSize: 10 }),
    staleTime: 15 * 60 * 1000, // 15 minutes (optionnel)
  });

  // Créer une nouvelle instance de produit
  const createMutation = useMutation({
    mutationFn: async (data: Omit<ProductInstanceFormValues, "id_exemplaire" | "prix_exemplaire">) =>
      await  wait(productInstanceService.create(data)),
      // productInstanceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
    },
    onError: (err: Error) => err || new Error("Erreur lors de la création"),
  });

  // Mettre à jour une instance de produit
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string | number;  data: Omit<ProductInstanceFormValues, "prix_exemplaire">}) =>
      await wait(productInstanceService.update(id, data)),
      // productInstanceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
    },
    onError: (err: Error) => err || new Error("Erreur lors de la mise à jour"),
  });

  // Supprimer une instance de produit
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => await wait (productInstanceService.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
    },
    onError: (err: Error) => err || new Error("Erreur lors de la suppression"),
  });

  return {
    productInstances: productInstancesResponse?.data ?? [],
    pagination: productInstancesResponse
      ? {
          total: productInstancesResponse.total,
          page: productInstancesResponse.page,
          pageSize: productInstancesResponse.pageSize,
          totalPages: productInstancesResponse.totalPages,
        }
      : { total: 0, page: 1, pageSize: 10, totalPages: 0 },
    loading,
    error,
    fetchProductInstances: (params: PaginationParams) =>
      queryClient.fetchQuery({
        queryKey: [PRODUCT_INSTANCES_KEY, params],
        queryFn: () => fetchProductInstances(params),
      }),
    createProductInstance: createMutation.mutateAsync,
    updateProductInstance: updateMutation.mutateAsync,
    deleteProductInstance: deleteMutation,
  };
};