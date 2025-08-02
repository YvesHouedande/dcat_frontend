// src/hooks/useProductInstances.ts
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { PaginationParams, PaginatedResponse } from "../types";
import { ProductInstanceService } from "../services/productInstance.service";
import { ProductInstanceFormValues } from "../schemas/productInstanceSchema";

// Clés de query pour React Query
const PRODUCT_INSTANCES_KEY = "productInstances";
const wait = <T>(result: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(result), 200));

// Ajout : le hook accepte des filtres dynamiques
export const useProductInstances = (filters = {}) => {
  const queryClient = useQueryClient();
  const productInstanceService = ProductInstanceService();
  const PAGE_SIZE = 10;
  // Récupérer la liste des instances de produit avec pagination et filtres
  const fetchProductInstances = (params: PaginationParams) =>
    productInstanceService.getAll({
      ...params,
      pageSize: PAGE_SIZE,
      ...filters,
    });

  // Utilisation de useInfiniteQuery pour la pagination et les filtres
  const {
    data,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse<ProductInstanceFormValues>, Error>({
    queryKey: [PRODUCT_INSTANCES_KEY, filters], // les filtres dans la clé
    queryFn: ({ pageParam = 1 }) =>
      fetchProductInstances({
        page: pageParam,
        pageSize: PAGE_SIZE,
        ...filters,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 15 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) =>
      await wait(productInstanceService.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
    },
    onError: (err: Error) => err || new Error("Erreur lors de la suppression"),
  });

  return {
    productInstances: data?.pages?.flatMap((page) => page.data) ?? [],
    pages: data?.pages ?? [],
    loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchProductInstances,
    deleteProductInstance: deleteMutation,
  };
};

// Exemple d'utilisation :
// const { productInstances, ... } = useProductInstances({ search: 'foo', status: 'active' });

export const useDeleteProductInstance = () => {
  const queryClient = useQueryClient();
  const productInstanceService = ProductInstanceService();

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) =>
      await wait(productInstanceService.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
    },
    onError: (err: Error) => err || new Error("Erreur lors de la suppression"),
  });
  return {
    deleteProductInstance: deleteMutation,
  };
};
