import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { type CreateDemandeData } from "../services/demandeService";
import { Demande } from "../administration/types/interfaces";
import { useDemandesApi } from "../services/demandeService";

// Clés de requête pour TanStack Query
export const demandeKeys = {
  all: ["demandes"] as const,
  lists: () => [...demandeKeys.all, "list"] as const,
  list: (filters: { type?: string; employeId?: number }) =>
    [...demandeKeys.lists(), filters] as const,
  filtered: (filters: {
    search?: string;
    status?: string;
    type?: string;
    employeId?: number;
    limit?: number;
  }) => [...demandeKeys.lists(), "filtered", filters] as const,
  details: () => [...demandeKeys.all, "detail"] as const,
  detail: (id: number) => [...demandeKeys.details(), id] as const,
  documents: (demandeId: number) =>
    [...demandeKeys.detail(demandeId), "documents"] as const,
  employes: ["employes"] as const,
  employe: (id: number) => [...demandeKeys.employes, id] as const,
  natures: ["natures"] as const,
};

// ===== HOOKS DE REQUÊTE (READ) =====

/**
 * Hook pour récupérer toutes les demandes
 */
export const useDemandes = () => {
  const { fetchDemandes } = useDemandesApi();
  return useQuery(demandeKeys.lists(), () => fetchDemandes(), {
    staleTime: 1000 * 60 * 2, // 2 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes (anciennement gcTime)
  });
};

/**
 * Hook pour récupérer une demande par ID
 */
export const useDemande = (id: number) => {
  const { fetchDemandeById } = useDemandesApi();
  return useQuery(demandeKeys.detail(id), () => fetchDemandeById(id), {
    enabled: !!id && !isNaN(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook pour récupérer les demandes par type
 */
export const useDemandesByType = (type: string) => {
  const { fetchDemandesByType } = useDemandesApi();
  return useQuery(demandeKeys.list({ type }), () => fetchDemandesByType(type), {
    enabled: !!type,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Hook pour récupérer les demandes par employé
 */
export const useDemandesByEmploye = (employeId: number) => {
  const { fetchDemandesByEmploye } = useDemandesApi();
  return useQuery(
    demandeKeys.list({ employeId }),
    () => fetchDemandesByEmploye(employeId),
    {
      enabled: !!employeId && !isNaN(employeId),
      staleTime: 1000 * 60 * 3, // 3 minutes
    }
  );
};

/**
 * Hook pour récupérer tous les employés
 */
export const useEmployes = () => {
  const { getAllEmployes } = useDemandesApi();
  return useQuery(demandeKeys.employes, () => getAllEmployes(), {
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });
};

/**
 * Hook pour récupérer un employé par ID
 */
export const useEmploye = (id: number) => {
  const { fetchEmployeById } = useDemandesApi();
  return useQuery(demandeKeys.employe(id), () => fetchEmployeById(id), {
    enabled: !!id && !isNaN(id),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook pour récupérer toutes les natures de documents
 */
export const useNatureDocuments = () => {
  const { getAllNatureDocuments } = useDemandesApi();
  return useQuery(demandeKeys.natures, () => getAllNatureDocuments(), {
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 heure
  });
};

/**
 * Hook pour récupérer les documents d'une demande
 */
export const useDocumentsByDemande = (demandeId: number) => {
  const { fetchDocumentsByDemande } = useDemandesApi();
  return useQuery(
    demandeKeys.documents(demandeId),
    () => fetchDocumentsByDemande(demandeId),
    {
      enabled: !!demandeId && !isNaN(demandeId),
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
};

// ===== HOOKS DE MUTATION (WRITE) =====

/**
 * Hook pour créer une nouvelle demande
 */
export const useCreateDemande = () => {
  const queryClient = useQueryClient();
  const { createDemande } = useDemandesApi();

  return useMutation({
    mutationFn: ({ data }: { data: CreateDemandeData }) => createDemande(data),
    onSuccess: (newDemande) => {
      // Invalider et refetch les listes de demandes
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });

      // Ajouter la nouvelle demande au cache
      queryClient.setQueryData(
        demandeKeys.detail(newDemande.id_demandes),
        newDemande
      );

      toast.success("Demande créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création: ${error.message}`);
    },
  });
};

/**
 * Hook pour mettre à jour une demande
 */
export const useUpdateDemande = () => {
  const queryClient = useQueryClient();
  const { updateDemande } = useDemandesApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Demande> }) =>
      updateDemande(id, data),
    onSuccess: (updatedDemande) => {
      // Invalider et refetch les listes de demandes
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });

      // Mettre à jour le cache de la demande spécifique
      queryClient.setQueryData(
        demandeKeys.detail(updatedDemande.id_demandes),
        updatedDemande
      );

      toast.success("Demande mise à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    },
  });
};

/**
 * Hook pour supprimer une demande
 */
export const useDeleteDemande = () => {
  const queryClient = useQueryClient();
  const { deleteDemande } = useDemandesApi();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteDemande(id),
    onSuccess: (_, { id }) => {
      // Invalider et refetch les listes de demandes
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });

      // Supprimer la demande du cache
      queryClient.removeQueries({ queryKey: demandeKeys.detail(id) });

      toast.success("Demande supprimée avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    },
  });
};

/**
 * Hook pour approuver une demande
 */
export const useApprouverDemande = () => {
  const queryClient = useQueryClient();
  const { approuverDemande } = useDemandesApi();

  return useMutation({
    mutationFn: ({ id, commentaire }: { id: number; commentaire?: string }) =>
      approuverDemande(id, commentaire),
    onSuccess: (updatedDemande) => {
      // Invalider et refetch les listes de demandes
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });

      // Mettre à jour le cache de la demande spécifique
      queryClient.setQueryData(
        demandeKeys.detail(updatedDemande.id_demandes),
        updatedDemande
      );

      toast.success("Demande approuvée avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'approbation: ${error.message}`);
    },
  });
};

/**
 * Hook pour refuser une demande
 */
export const useRefuserDemande = () => {
  const queryClient = useQueryClient();
  const { refuserDemande } = useDemandesApi();

  return useMutation({
    mutationFn: ({ id, motif }: { id: number; motif?: string }) =>
      refuserDemande(id, motif),
    onSuccess: (updatedDemande) => {
      // Invalider et refetch les listes de demandes
      queryClient.invalidateQueries({ queryKey: demandeKeys.lists() });

      // Mettre à jour le cache de la demande spécifique
      queryClient.setQueryData(
        demandeKeys.detail(updatedDemande.id_demandes),
        updatedDemande
      );

      toast.success("Demande refusée avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors du refus: ${error.message}`);
    },
  });
};

/**
 * Hook pour ajouter un document à une demande
 */
export const useAddDocumentToDemande = () => {
  const queryClient = useQueryClient();
  const { addDocumentToDemande } = useDemandesApi();
  return useMutation({
    mutationFn: ({
      demandeId,
      documentData,
    }: {
      demandeId: number;
      documentData: {
        file: File;
        libelle_document: string;
        id_nature_document: number;
        id_dossier?: number;
      };
    }) => addDocumentToDemande(demandeId, documentData),
    onSuccess: (_newDocument, { demandeId }) => {
      // Invalider les documents de la demande
      queryClient.invalidateQueries({
        queryKey: demandeKeys.documents(demandeId),
      });

      // Invalider la demande elle-même car elle contient les documents
      queryClient.invalidateQueries({
        queryKey: demandeKeys.detail(demandeId),
      });

      toast.success("Document ajouté avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'ajout du document: ${error.message}`);
    },
  });
};

/**
 * Hook pour supprimer un document d'une demande
 */
export const useDeleteDocumentFromDemande = () => {
  const queryClient = useQueryClient();
  const { deleteDocumentFromDemande } = useDemandesApi();
  return useMutation({
    mutationFn: ({
      demandeId,
      documentId,
    }: {
      demandeId: number;
      documentId: number;
    }) => deleteDocumentFromDemande(demandeId, documentId),
    onSuccess: (_, { demandeId }) => {
      // Invalider les documents de la demande
      queryClient.invalidateQueries({
        queryKey: demandeKeys.documents(demandeId),
      });

      // Invalider la demande elle-même car elle contient les documents
      queryClient.invalidateQueries({
        queryKey: demandeKeys.detail(demandeId),
      });

      toast.success("Document supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        `Erreur lors de la suppression du document: ${error.message}`
      );
    },
  });
};

// ===== HOOKS UTILITAIRES =====

/**
 * Hook pour obtenir les statistiques des demandes
 */
export const useDemandesStats = () => {
  const { data, isLoading, error } = useDemandes();
  const demandes = data?.data;
  const stats = {
    total: demandes?.length || 0,
    enAttente: demandes?.filter((d) => d.status === "En attente").length || 0,
    approuvees:
      demandes?.filter(
        (d) => d.status === "Approuvée" || d.status === "Approuvé"
      ).length || 0,
    refusees:
      demandes?.filter((d) => d.status === "Refusée" || d.status === "Refusé")
        .length || 0,
  };

  return {
    stats,
    isLoading,
    error,
  };
};

/**
 * Hook pour filtrer et rechercher les demandes
 */

export const useFilteredDemandes = (
  limit = 16,
  filters: {
    search?: string;
    status?: string;
    type?: string;
    employeId?: number;
  }
) => {
  const { fetchFilteredDemandes } = useDemandesApi();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: demandeKeys.filtered({ ...filters, limit }),
    queryFn: ({ pageParam = 1 }) =>
      fetchFilteredDemandes({
        page: pageParam,
        limit,
      }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      const nextPage = pagination.page + 1;
      return nextPage <= pagination.totalPages ? nextPage : undefined;
    },
  });
  const demandes = data?.pages.flatMap((page) => page.data);
  const { data: employes } = useEmployes();
  const filteredDemandes =
    demandes?.filter((demande) => {
      const employe = employes?.find(
        (e) => e.id_employes === demande.id_employes
      );

      const matchesSearch =
        !filters.search ||
        employe?.nom_employes
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        employe?.prenom_employes
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        demande.type_demande
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        demande.motif.toLowerCase().includes(filters.search.toLowerCase()) ||
        demande.status.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        !filters.status || demande.status === filters.status;
      const matchesType =
        !filters.type || demande.type_demande === filters.type;
      const matchesEmploye =
        !filters.employeId || demande.id_employes === filters.employeId;

      return matchesSearch && matchesStatus && matchesType && matchesEmploye;
    }) || [];
  return {
    demandes: filteredDemandes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    pagination: data?.pages[0]?.pagination,
  };
};
