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
export const useProductInstances = () => {
  const queryClient = useQueryClient();
  const productInstanceService = ProductInstanceService();
  // Récupérer la liste des instances de produit avec pagination
  const fetchProductInstances = (params: PaginationParams) =>
    productInstanceService.getAll(params);

  // Utilisation de useInfiniteQuery pour la pagination
  const {
    data,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse<ProductInstanceFormValues>, Error>({
    queryKey: [PRODUCT_INSTANCES_KEY],
    queryFn: ({ pageParam = 1 }) =>
      fetchProductInstances({ page: pageParam, pageSize: 10 }),
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
