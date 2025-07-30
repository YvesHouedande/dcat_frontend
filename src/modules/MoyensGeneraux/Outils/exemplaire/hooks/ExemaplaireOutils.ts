// src/hooks/useExemplaireProduits.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { ExemplaireOutilsService } from "../services/ExemplaireOutils.service";
import { PaginationParams, ExemplaireProduit } from "../types";
import { OutilMovement } from "../../sorties/types";

const OUTILS_KEY = "moyens-generaux-outils";

// Service instance
const useOutilsService = () => ExemplaireOutilsService();

// ===============================
// HOOKS DE LECTURE (useQuery)
// ===============================

// Hook pour récupérer tous les exemplaires d'outils avec pagination
export const useExemplairesOutils = (params: PaginationParams) => {
  const service = useOutilsService();
  const data = useInfiniteQuery({
    queryKey: [OUTILS_KEY, "exemplaires", params], // les filtres dans la clé
    queryFn: ({ pageParam = 1 }) =>
      service.getAllExemplaire({
        page: pageParam,
        limit: params.limit,
        filter: params.filter,
        sortOrder: params.sortOrder,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 15 * 60 * 1000,
  });

  return {
    ExemplaireOutils: data.data?.pages.flatMap((page) => page.data) || [],
    isLoading: data.isLoading,
    error: data.error,
    fetchNextPage: data.fetchNextPage,
    hasNextPage: data.hasNextPage,
    isFetchingNextPage: data.isFetchingNextPage,
    pages: data?.data?.pages ?? [],
  };
};

// Hook pour récupérer les outils disponibles (non sortis ou retournés)
export const useOutilsDisponibles = (params: PaginationParams) => {
  const service = useOutilsService();
  
  return useQuery({
    queryKey: [OUTILS_KEY, "disponibles", params],
    queryFn: () => service.getOutilsDisponibles(params),
    staleTime: 2 * 60 * 1000, // 2 minutes car données dynamiques
  });
};

// Hook pour récupérer les exemplaires d'un outil spécifique avec pagination
export const useExemplairesParOutil = (
  id: string | number,
  params: PaginationParams,
  enabled: boolean = true
) => {
  const service = useOutilsService();

  return useQuery({
    queryKey: [OUTILS_KEY, "exemplaires-par-outil", id, params],
    queryFn: () => service.getExemplairesByOutil(id, params),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour vérifier l'état d'un outil (retourné ou non)
export const useEtatOutil = (
  id_exemplaire: string | number,
  id_employes: string | number,
  enabled: boolean = true
) => {
  const service = useOutilsService();

  return useQuery({
    queryKey: [OUTILS_KEY, "etat", id_exemplaire, id_employes],
    queryFn: () => service.getEtatOutil(id_exemplaire, id_employes),
    enabled: enabled && !!id_exemplaire && !!id_employes,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook pour récupérer l'historique d'un outil spécifique
export const useHistoriqueOutil = (
  id: string | number,
  params: PaginationParams,
  enabled: boolean = true
) => {
  const service = useOutilsService();

  return useQuery({
    queryKey: [OUTILS_KEY, "historique-outil", id, params],
    queryFn: () => service.getHistoriqueOutil(id, params),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour récupérer les sorties d'un outil spécifique
export const useSortiesOutil = (
  id: string | number,
  params: PaginationParams,
  enabled: boolean = true
) => {
  const service = useOutilsService();

  return useQuery({
    queryKey: [OUTILS_KEY, "sorties-outil", id, params],
    queryFn: () => service.getSortiesOutil(id, params),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour récupérer les entrées d'un outil spécifique
export const useEntreesOutil = (
  id: string | number,
  params: PaginationParams,
  enabled: boolean = true
) => {
  const service = useOutilsService();

  return useQuery({
    queryKey: [OUTILS_KEY, "entrees-outil", id, params],
    queryFn: () => service.getEntreesOutil(id, params),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour récupérer l'historique global de tous les outils
export const useHistoriqueGlobal = (params: PaginationParams) => {
  const service = useOutilsService();

  return useQuery({
    queryKey: [OUTILS_KEY, "historique-global", params],
    queryFn: () => service.getHistoriqueGlobal(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour récupérer les outils actuellement sortis
export const useOutilsSortis = (params: PaginationParams) => {
  const service = useOutilsService();

  const outilsSortis = useQuery({
    queryKey: [OUTILS_KEY, "outils-sortis", params],
    queryFn: () => service.getOutilsSortis(params),
    staleTime: 2 * 60 * 1000, // 2 minutes car données plus dynamiques
  });

  return {
    outilsSortis: outilsSortis.data?.data,
    pagination: {
      page: outilsSortis.data?.page,
      pageSize: outilsSortis.data?.pageSize,
      total: outilsSortis.data?.total,
      totalPages: outilsSortis.data?.totalPages,
    },
    loading: outilsSortis.isLoading,
    fetchOutilsSortis: outilsSortis.refetch,
  };
};

// Hook pour récupérer les outils sortis par un employé
export const useOutilsSortisParEmploye = (
  id_employe: string | number,
  params: PaginationParams,
  enabled: boolean = true
) => {
  const service = useOutilsService();

  return useQuery({
    queryKey: [OUTILS_KEY, "outils-sortis-employe", id_employe, params],
    queryFn: () => service.getOutilsSortisParEmploye(id_employe, params),
    enabled: enabled && !!id_employe,
    staleTime: 2 * 60 * 1000,
  });
};

// Hook pour récupérer le détail d'un mouvement spécifique (pas de pagination)
export const useMouvementDetail = (
  type: "sortie" | "entree",
  id_exemplaire: string | number,
  id_employes: string | number,
  enabled: boolean = true
) => {
  const service = useOutilsService();

  return useQuery({
    queryKey: [
      OUTILS_KEY,
      "mouvement-detail",
      type,
      id_exemplaire,
      id_employes,
    ],
    queryFn: () => service.getMouvementDetail(type, id_exemplaire, id_employes),
    enabled: enabled && !!type && !!id_exemplaire && !!id_employes,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour récupérer les statistiques globales (pas de pagination)
export const useStatistiquesOutils = () => {
  const service = useOutilsService();

  return useQuery({
    queryKey: [OUTILS_KEY, "statistiques"],
    queryFn: () => service.getStatistiques(),
    staleTime: 10 * 60 * 1000, // 10 minutes pour les stats
    refetchInterval: 5 * 60 * 1000, // Actualisation automatique toutes les 5 minutes
  });
};

// Hook pour récupérer un exemplaire par ID (méthode ancienne conservée)
export const useExemplaireOutil = (id?: string | number) => {
  const service = useOutilsService();

  return useQuery({
    queryKey: [OUTILS_KEY, "exemplaire", id],
    queryFn: () => service.getById(String(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// ===============================
// HOOKS DE MUTATION (useMutation)
// ===============================

// Hook pour créer une sortie d'outil
export const useCreateSortieOutil = () => {
  const service = useOutilsService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<OutilMovement, "type">) =>
      service.createSortie(data),
    onSuccess: () => {
      // Invalider les caches liés aux sorties et statistiques
      queryClient.invalidateQueries({
        queryKey: [OUTILS_KEY, "outils-sortis"],
      });
      queryClient.invalidateQueries({ queryKey: [OUTILS_KEY, "statistiques"] });
      queryClient.invalidateQueries({
        queryKey: [OUTILS_KEY, "historique-global"],
      });
    },
  });
};

// Hook pour créer une entrée d'outil (retour)
export const useCreateEntreeOutil = () => {
  const service = useOutilsService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<OutilMovement, "type">) =>
      service.createEntree(data),
    onSuccess: () => {
      // Invalider les caches liés aux entrées et statistiques
      queryClient.invalidateQueries({
        queryKey: [OUTILS_KEY, "outils-sortis"],
      });
      queryClient.invalidateQueries({ queryKey: [OUTILS_KEY, "statistiques"] });
      queryClient.invalidateQueries({
        queryKey: [OUTILS_KEY, "historique-global"],
      });
    },
  });
};

// Hook pour supprimer un mouvement
export const useDeleteMouvement = () => {
  const service = useOutilsService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      type,
      id_exemplaire,
      id_employes,
    }: {
      type: "sortie" | "entree";
      id_exemplaire: string | number;
      id_employes: string | number;
    }) => service.deleteMouvement(type, id_exemplaire, id_employes),
    onSuccess: () => {
      // Invalider tous les caches liés aux mouvements
      queryClient.invalidateQueries({ queryKey: [OUTILS_KEY] });
    },
  });
};

// Hook pour modifier un mouvement
export const useUpdateMouvement = () => {
  const service = useOutilsService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      type,
      id_exemplaire,
      id_employes,
      data,
    }: {
      type: "sortie" | "entree";
      id_exemplaire: string | number;
      id_employes: string | number;
      data: Partial<OutilMovement>;
    }) => service.updateMouvement(type, id_exemplaire, id_employes, data),
    onSuccess: () => {
      // Invalider tous les caches liés aux mouvements
      queryClient.invalidateQueries({ queryKey: [OUTILS_KEY] });
    },
  });
};

// Hook pour créer un exemplaire d'outil (méthode ancienne conservée)
export const useCreateExemplaireOutil = () => {
  const service = useOutilsService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<ExemplaireProduit, "id_exemplaire" | "prix_exemplaire">
    ) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OUTILS_KEY, "exemplaires"] });
      queryClient.invalidateQueries({ queryKey: [OUTILS_KEY, "statistiques"] });
    },
  });
};

// Hook pour mettre à jour un exemplaire d'outil (méthode ancienne conservée)
export const useUpdateExemplaireOutil = () => {
  const service = useOutilsService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: Omit<ExemplaireProduit, "prix_exemplaire">;
    }) => service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OUTILS_KEY, "exemplaires"] });
      queryClient.invalidateQueries({ queryKey: [OUTILS_KEY, "exemplaire"] });
    },
  });
};

// Hook pour supprimer un exemplaire d'outil (méthode ancienne conservée)
export const useDeleteExemplaireOutil = () => {
  const service = useOutilsService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OUTILS_KEY, "exemplaires"] });
      queryClient.invalidateQueries({ queryKey: [OUTILS_KEY, "statistiques"] });
    },
  });
};

// ===============================
// HOOK PRINCIPAL POUR COMPATIBILITÉ
// ===============================

// Hook principal qui expose toutes les fonctionnalités (pour compatibilité avec le code existant)
export const useExemplaireOutils = () => {
  const createSortie = useCreateSortieOutil();
  const createEntree = useCreateEntreeOutil();
  const deleteMouvement = useDeleteMouvement();
  const updateMouvement = useUpdateMouvement();
  const createExemplaireProduit = useCreateExemplaireOutil();
  const updateExemplaireProduit = useUpdateExemplaireOutil();
  const deleteExemplaire = useDeleteExemplaireOutil();

  return {
    // Mutations pour les mouvements
    createSortieOutil: createSortie.mutate,
    createEntreeOutil: createEntree.mutate,
    deleteMouvement: deleteMouvement.mutate,
    updateMouvement: updateMouvement.mutate,
    updateMouvementAsync: updateMouvement.mutateAsync,
    deleteMouvementAsync: deleteMouvement.mutateAsync,
    createSortieOutilAsync: createSortie.mutateAsync,
    createEntreeOutilAsync: createEntree.mutateAsync,

    // Mutations pour les exemplaires (compatibilité)
    createExemplaireProduit: createExemplaireProduit.mutate,
    updateExemplaireProduit: updateExemplaireProduit.mutate,
    deleteExemplaire: deleteExemplaire.mutate,
    deleteExemplaireAsync: deleteExemplaire.mutateAsync,
    createExemplaireProduitAsync: createExemplaireProduit.mutateAsync,
    updateExemplaireProduitAsync: updateExemplaireProduit.mutateAsync,

    // États des mutations
    isCreatingSortie: createSortie.isLoading,
    isCreatingEntree: createEntree.isLoading,
    isDeletingMouvement: deleteMouvement.isLoading,
    isUpdatingMouvement: updateMouvement.isLoading,
    isCreatingExemplaire: createExemplaireProduit.isLoading,
    isUpdatingExemplaire: updateExemplaireProduit.isLoading,
    isDeletingExemplaire: deleteExemplaire.isLoading,

    // Erreurs
    sortieError: createSortie.error,
    entreeError: createEntree.error,
    mouvementError: deleteMouvement.error || updateMouvement.error,
    exemplaireError:
      createExemplaireProduit.error ||
      updateExemplaireProduit.error ||
      deleteExemplaire.error,
  };
};
