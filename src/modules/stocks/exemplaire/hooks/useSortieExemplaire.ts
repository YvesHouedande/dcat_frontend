import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import useSortieExemplaireService from "../services/SortieExemplaire.service";
import { SortieExemplaire } from "../types";

const PRODUCT_INSTANCES_KEY = "productInstances";
// Interface pour la réponse paginée
interface PaginatedResponse {
  currentPage: number;
  totalPages: number;
  data: SortieExemplaire[];
}

export const useSortieExemplaireCreate = () => {
  const queryClient = useQueryClient();
  const SortieExemplaireService = useSortieExemplaireService();
  const { mutate, isLoading, error } = useMutation({
    mutationFn: (data: Partial<SortieExemplaire>) =>
      SortieExemplaireService.faireSortieExemplaire(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sortieExemplaire"] });
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
    },
  });
  return { mutate, isLoading, error };
};

export const useSortieExemplaireCommande = (id?: string) => {
  const SortieExemplaireService = useSortieExemplaireService();
  const { data, isLoading, error } = useQuery({
    queryKey: ["sortieExemplaireCommande"],
    queryFn: () => SortieExemplaireService.ExemplaireSortieCommande(id!),
    enabled: !!id,
  });
  return { data, isLoading, error };
};

export const useFetchSortieExemplaire = () => {
  const SortieExemplaireService = useSortieExemplaireService();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["sortieExemplaire"],
    queryFn: async ({ pageParam = 1 }) => {
      // On suppose que getSortieExemplaire accepte un objet avec page et limit
      return await SortieExemplaireService.getSortieExemplaire({
        page: pageParam,
        limit: 10, // ou une valeur par défaut appropriée
      });
    },
    getNextPageParam: (lastPage: PaginatedResponse) => {
      const currentPage = lastPage.currentPage;
      const totalPages = lastPage.totalPages;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined; // Plus de pages à charger
    },
  });
  return {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export const useUpdateSortieExemplaire = () => {
  const queryClient = useQueryClient();
  const SortieExemplaireService = useSortieExemplaireService();
  const { mutate, isLoading, error } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: SortieExemplaire;
    }) => {
      return await SortieExemplaireService.updateSortieExemplaire(id, data);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["sortieExemplaire", id] });
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
    },
  });
  return { mutate, isLoading, error };
};

export const useDeleteSortieExemplaire = () => {
  const queryClient = useQueryClient();
  const SortieExemplaireService = useSortieExemplaireService();
  const { mutate, isLoading, error } = useMutation({
    mutationFn: (id: string) =>
      SortieExemplaireService.deleteSortieExemplaire(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["sortieExemplaire", id] });
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INSTANCES_KEY] });
    },
  });
  return { mutate, isLoading, error };
};

export const useFetchSortieExemplaireById = (id: string) => {
  const SortieExemplaireService = useSortieExemplaireService();
  const { data, isLoading, error } = useQuery({
    queryKey: ["sortieExemplaire", id],
    queryFn: () => SortieExemplaireService.getSortieExemplaireById(id),
  });
  return { data, isLoading, error };
};
