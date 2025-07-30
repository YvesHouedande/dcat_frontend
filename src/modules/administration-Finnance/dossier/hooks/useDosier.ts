import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useDossier } from "../services/dossier.service";
import { DossierType, PaginationParams } from "../types/dossierType";
import { toast } from "sonner";

export const dossierKeys = {
  all: ["dossiers"] as const,
  lists: () => [...dossierKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...dossierKeys.lists(), params] as const,
  details: () => [...dossierKeys.all, "detail"] as const,
  detail: (id: string) => [...dossierKeys.details(), id] as const,
  types: () => [...dossierKeys.all, "type"] as const,
  type: (type: string, params: PaginationParams) =>
    [...dossierKeys.types(), type, params] as const,
  documents: () => [...dossierKeys.all, "documents"] as const,
  document: (id: string | number, params: PaginationParams) =>
    [...dossierKeys.documents(), id, params] as const,
};

// Hook pour récupérer tous les dossiers avec pagination
export const useDossiers = (params: PaginationParams = {}) => {
  const { getDossier } = useDossier();

  const dossiersQuery = useQuery({
    queryKey: dossierKeys.list(params),
    queryFn: () => getDossier(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
  return {
    dossiers: dossiersQuery.data,
    isLoadingDossiers: dossiersQuery.isLoading,
    isErrorDossiers: dossiersQuery.isError,
  };
};

// Hook pour pagination infinie des dossiers
export const useInfiniteDossiers = (
  baseParams: Omit<PaginationParams, "page"> = {}
) => {
  const { getDossier } = useDossier();

  const infiniteDossiersQuery = useInfiniteQuery({
    queryKey: [...dossierKeys.lists(), "infinite", baseParams],
    queryFn: ({ pageParam = 1 }) =>
      getDossier({ ...baseParams, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage;
      const hasNext = page * limit < total;
      return hasNext ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  return {
    infiniteDossiers: infiniteDossiersQuery.data,
    isLoading: infiniteDossiersQuery.isLoading,
    isError: infiniteDossiersQuery.isError,
    hasNextPage: infiniteDossiersQuery.hasNextPage,
    fetchNextPage: infiniteDossiersQuery.fetchNextPage,
    isFetchingNextPage: infiniteDossiersQuery.isFetchingNextPage,
  };
};

// Hook pour récupérer un dossier par ID
export const useDossierById = (id: string | undefined) => {
  const { getDossierById } = useDossier();

  const dossierByIdQuery = useQuery({
    queryKey: dossierKeys.detail(id!),
    queryFn: () => getDossierById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  return {
    dossierById: dossierByIdQuery.data,
    isLoadingDossierById: dossierByIdQuery.isLoading,
    isErrorDossierById: dossierByIdQuery.isError,
  };
};

// Hook pour récupérer les dossiers par type
export const useDossiersByType = (
  type: string,
  params: PaginationParams = {}
) => {
  const { getDossierByType } = useDossier();

  const infiniteDossiersQuery = useInfiniteQuery({
    queryKey: [...dossierKeys.lists(), "infinite", params, type],
    queryFn: ({ pageParam = 1 }) =>
      getDossierByType(type, { ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage;
      const hasNext = page * limit < total;
      return hasNext ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  return {
    dossiersByType: infiniteDossiersQuery.data,
    isLoadingDossiersByType: infiniteDossiersQuery.isLoading,
    isErrorDossiersByType: infiniteDossiersQuery.isError,
    refetchDossiersByType: infiniteDossiersQuery.refetch,
    hasNextPageDossiersByType: infiniteDossiersQuery.hasNextPage,
    fetchNextDossiersByType: infiniteDossiersQuery.fetchNextPage,
    isFetchingNextPageDossiersByType: infiniteDossiersQuery.isFetchingNextPage,
  };
};

// Hook pour récupérer les documents d'un dossier
export const useDocumentsByDossier = (
  id: string | number,
  params: PaginationParams = {}
) => {
  const { getDocumentDossierById } = useDossier();

  const infiniteDocumentsByDossierQuery = useInfiniteQuery({
    queryKey: [...dossierKeys.lists(), "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      getDocumentDossierById(id, { ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage.documents.pagination;
      const hasNext = page * limit < total;
      return hasNext ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  return {
    infiniteDocumentsByDossier: infiniteDocumentsByDossierQuery.data,
    isLoadingInfiniteDocumentsByDossier:
      infiniteDocumentsByDossierQuery.isLoading,
    isErrorInfiniteDocumentsByDossier: infiniteDocumentsByDossierQuery.isError,
    hasNextPageInfiniteDocumentsByDossier:
      infiniteDocumentsByDossierQuery.hasNextPage,
    fetchNextPageInfiniteDocumentsByDossier:
      infiniteDocumentsByDossierQuery.fetchNextPage,
    isFetchingNextPageInfiniteDocumentsByDossier:
      infiniteDocumentsByDossierQuery.isFetchingNextPage,
    refetchDocumentsByDossier: infiniteDocumentsByDossierQuery.refetch,
  };
};

// Hook pour créer un dossier
export const useCreateDossier = () => {
  const { createDossier } = useDossier();
  const queryClient = useQueryClient();

  const createDossierMutation = useMutation({
    mutationFn: (dossier: Omit<DossierType, "id_dossier">) =>
      createDossier(dossier),
    onSuccess: () => {
      // Invalider et refetch les listes de dossiers
      queryClient.invalidateQueries({ queryKey: dossierKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dossierKeys.types() });

      toast.success("Dossier créé avec succès");
    },
  });
  return {
    createDossier: createDossierMutation.mutate,
    createDossierAsync: createDossierMutation.mutateAsync,
    isCreatingDossier: createDossierMutation.isLoading,
  };
};

// Hook pour mettre à jour un dossier
export const useUpdateDossier = () => {
  const { updateDossier } = useDossier();
  const queryClient = useQueryClient();

  const updateDossierMutation = useMutation({
    mutationFn: ({
      id,
      dossier,
    }: {
      id: string;
      dossier: Partial<Omit<DossierType, "id_dossier">>;
    }) => updateDossier(id, dossier),
    onSuccess: (updatedDossier, { id }) => {
      // Mettre à jour le cache du dossier spécifique
      queryClient.setQueryData(dossierKeys.detail(id), updatedDossier);

      // Invalider les listes pour refléter les changements
      queryClient.invalidateQueries({ queryKey: dossierKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dossierKeys.types() });

      toast.success("Dossier mis à jour avec succès");
    },
  });
  return {
    updateDossier: updateDossierMutation.mutate,
    updateDossierAsync: updateDossierMutation.mutateAsync,
    isUpdatingDossier: updateDossierMutation.isLoading,
  };
};

// Hook pour supprimer un dossier
export const useDeleteDossier = () => {
  const { deleteDossier } = useDossier();
  const queryClient = useQueryClient();

  const deleteDossierMutation = useMutation({
    mutationFn: (id: string) => deleteDossier(id),
    onSuccess: (_, id) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: dossierKeys.detail(id) });

      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: dossierKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dossierKeys.types() });
      queryClient.invalidateQueries({ queryKey: dossierKeys.documents() });

      toast.success("Dossier supprimé avec succès");
    },
  });
  return {
    deleteDossier: deleteDossierMutation.mutate,
    deleteDossierAsync: deleteDossierMutation.mutateAsync,
    isDeletingDossier: deleteDossierMutation.isLoading,
  };
};

// Hook pour supprimer un document d'un dossier
export const useDeleteDocumentDossier = () => {
  const { deleteDocumentDossier } = useDossier();
  const queryClient = useQueryClient();

  const deleteDocument = useMutation({
    mutationFn: (id: string) => deleteDocumentDossier(id),
    onSuccess: () => {
      // Invalider les documents
      queryClient.invalidateQueries({ queryKey: dossierKeys.documents() });

      toast.success("Document supprimé avec succès");
    },
  });
  return {
    deleteDocument: deleteDocument.mutate,
    deleteDocumentAsync: deleteDocument.mutateAsync,
    isDeletingDocument: deleteDocument.isLoading,
  };
};
