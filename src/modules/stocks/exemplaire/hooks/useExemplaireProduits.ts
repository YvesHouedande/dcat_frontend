// src/hooks/useExemplaireProduits.ts
import {
  useMutation,
  useQueryClient,
  useQuery,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { PaginationParams } from "../types";
import { useExemplaireProduitService } from "..";
import { ExemplaireProduitFormValues } from "..";
import { ExemplaireLimit } from "../types/const";

// Clés de query pour React Query
const PRODUCT_INSTANCES_KEY = "ExemplaireProduits";
const PRODUCT_KEY = "productInstances";

const wait = <T>(result: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(result), 200));
export const useExemplaireProduits = (id?: string | number) => {
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
  };
};

export const useFetchExemplaireProduitByEtat = (
  id?: string | number,
  etat_exemplaire?: string
) => {
  const ExemplaireProduitService = useExemplaireProduitService();
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
    ExemplaireProduitByEtat:
      getByEtat.data?.pages.flatMap((page) => page.data) ?? [],
    loading: getByEtat.isLoading,
    error: getByEtat.error,
    refetch: getByEtat.refetch,
  };
};

/**
 * Récupère un exemplaire de produit par son ID.
 * @param id L'ID de l'exemplaire de produit.
 * @returns Un objet avec les propriétés `data`, `isLoading`, `error` et `refetch`.
 *   - `data`: L'exemplaire de produit.
 *   - `isLoading`: Un booléen indiquant si la requête est en cours.
 *   - `error`: L'erreur de la requête si elle a échoué.
 *   - `refetch`: La fonction pour relancer la requête.
 */
export const useExemplaireProduit = (id: string | number) => {
  const ExemplaireProduitService = useExemplaireProduitService();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [PRODUCT_INSTANCES_KEY, String(id)],
    queryFn: () => ExemplaireProduitService.getById(String(id)),
  });
  return { data, isLoading, error, refetch };
};

/**
 * Crée un nouvel exemplaire de produit.
 * @returns Un objet avec la fonction `createExemplaireProduit` pour créer un exemplaire.
 */
export const useExemplaireCréation = () => {
  const ExemplaireProduitService = useExemplaireProduitService();
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (
      data: Omit<ExemplaireProduitFormValues, "prix_exemplaire">
    ) => await wait(ExemplaireProduitService.create(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
      queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY] });
    },
    onError: (err: Error) => err || new Error("Erreur lors de la création"),
  });
  return { createExemplaireProduit: createMutation.mutateAsync };
};

/**
 * Met à jour un exemplaire de produit.
 * @returns Un objet avec la fonction `updateExemplaireProduit` pour mettre à jour un exemplaire.
 */
export const useExemplaireUpdate = () => {
  const ExemplaireProduitService = useExemplaireProduitService();
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY] });
    },
    onError: (err: Error) => err || new Error("Erreur lors de la mise à jour"),
  });
  return { updateExemplaireProduit: updateMutation.mutateAsync };
};

/**
 * Supprime un exemplaire de produit.
 * @returns Un objet avec la fonction `deleteExemplaireProduit` pour supprimer un exemplaire.
 */
export const useExemplaireDelete = () => {
  const ExemplaireProduitService = useExemplaireProduitService();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) =>
      await wait(ExemplaireProduitService.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
      queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY] });
    },
    onError: (err: Error) => err || new Error("Erreur lors de la suppression"),
  });
  return { deleteExemplaireProduit: deleteMutation };
};
