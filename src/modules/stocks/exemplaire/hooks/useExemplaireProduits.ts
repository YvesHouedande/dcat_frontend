// src/hooks/useExemplaireProduits.ts
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { PaginationParams } from "../types";
import { useExemplaireProduitService } from "..";
import { ExemplaireProduitFormValues } from "..";
import { ExemplaireLimit } from "../types/const";

// Clés de query pour React Query
const PRODUCT_INSTANCES_KEY = "ExemplaireProduits";

const wait = <T>(result: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(result), 200));
export const useExemplaireProduits = (
  id?: string | number,
  etat_exemplaire?: string
) => {
  const ExemplaireProduitService = useExemplaireProduitService();
  const queryClient = useQueryClient();
  // Récupérer la liste des instances de produit avec pagination
  const fetchExemplaireProduits = (
    params: PaginationParams,
    id: string | number
  ) => ExemplaireProduitService.getAll(params, id);
  const ExemplaireProduits = useInfiniteQuery({
    queryKey: [PRODUCT_INSTANCES_KEY, String(id)],
    queryFn: ({ pageParam = 1 }) =>
      fetchExemplaireProduits(
        { page: pageParam, limit: ExemplaireLimit },
        String(id)
      ),
    staleTime: 15 * 60 * 1000, // 15 minutes (optionnel)
    enabled: !!id,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.currentPage;
      const totalPages = lastPage.totalPages;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined; // Plus de pages à charger
    },
  });

  // Créer une nouvelle instance de produit
  const createMutation = useMutation({
    mutationFn: async (
      data: Omit<
        ExemplaireProduitFormValues,
        "id_exemplaire" | "prix_exemplaire"
      >
    ) => await wait(ExemplaireProduitService.create(data)),
    // ExemplaireProduitService.create(data),
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
      data: Omit<ExemplaireProduitFormValues, "prix_exemplaire">;
    }) => await wait(ExemplaireProduitService.update(id, data)),
    // ExemplaireProduitService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
    },
    onError: (err: Error) => err || new Error("Erreur lors de la mise à jour"),
  });

  // Supprimer une instance de produit
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) =>
      await wait(ExemplaireProduitService.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
    },
    onError: (err: Error) => err || new Error("Erreur lors de la suppression"),
  });

  const getByEtat = useInfiniteQuery({
    queryKey: [PRODUCT_INSTANCES_KEY, String(id), etat_exemplaire],
    queryFn: ({ pageParam = 1 }) =>
      ExemplaireProduitService.getByEtat(
        String(etat_exemplaire),
        { page: pageParam, limit: ExemplaireLimit },
        String(id)
      ),
    staleTime: 15 * 60 * 1000,
    enabled: !!id && !!etat_exemplaire, // <-- fetch seulement si id ET etat_exemplaire sont définis
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.currentPage;
      const totalPages = lastPage.totalPages;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });

  return {
    ExemplaireProduits:
      ExemplaireProduits.data?.pages.flatMap((page) => page.data) ?? [],
    pagination: ExemplaireProduits.data?.pages
      ? {
          total: ExemplaireProduits.data?.pages.reduce(
            (acc, page) => acc + page.totalItems,
            0
          ),
          page: ExemplaireProduits.data?.pages[0].currentPage || 1,
          pageSize: ExemplaireProduits.data?.pages[0].pageSize || 10,
          totalPages: ExemplaireProduits.data?.pages[0].totalPages || 0,
        }
      : { total: 0, page: 1, pageSize: 10, totalPages: 0 },
    loading: ExemplaireProduits.isLoading,
    error: ExemplaireProduits.error,
    fetchExemplaireProduits: (params: PaginationParams) =>
      queryClient.fetchQuery({
        queryKey: [PRODUCT_INSTANCES_KEY, params],
        queryFn: () => fetchExemplaireProduits(params, String(id)),
      }),
    createExemplaireProduit: createMutation.mutateAsync,
    updateExemplaireProduit: updateMutation.mutateAsync,
    deleteExemplaireProduit: deleteMutation,
    fetchExemplaireProduitsByEtat: getByEtat,
    ExemplaireProduitByEtat:
      getByEtat.data?.pages.flatMap((page) => page.data) ?? [],
  };
};
