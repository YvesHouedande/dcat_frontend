import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useEmployesApi } from "../services/employeService";

// Clés de requête pour TanStack Query
export const employeDocumentKeys = {
  all: ["employe-documents"] as const,
  lists: () => [...employeDocumentKeys.all, "list"] as const,
  list: (employeId: number) => [...employeDocumentKeys.lists(), employeId] as const,
  details: () => [...employeDocumentKeys.all, "detail"] as const,
  detail: (employeId: number, documentId: number) => 
    [...employeDocumentKeys.details(), employeId, documentId] as const,
};

export const natureKeys = {
  all: ["natures"] as const,
  lists: () => [...natureKeys.all, "list"] as const,
  list: () => [...natureKeys.lists()] as const,
  details: () => [...natureKeys.all, "detail"] as const,
  detail: (id: number) => [...natureKeys.details(), id] as const,
};

/**
 * Hook pour récupérer les documents d'un employé
 */
export const useEmployeDocuments = (employeId: number) => {
  const { fetchDocumentsByEmploye } = useEmployesApi();
  
  return useQuery({
    queryKey: employeDocumentKeys.list(employeId),
    queryFn: () => fetchDocumentsByEmploye(employeId),
    enabled: !!employeId && !isNaN(employeId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook pour ajouter un document à un employé
 */
export const useAddDocumentToEmploye = () => {
  const queryClient = useQueryClient();
  const { addDocumentToEmploye } = useEmployesApi();
  
  return useMutation({
    mutationFn: ({
      employeId,
      documentData,
    }: {
      employeId: number;
      documentData: {
        file: File;
        libelle_document: string;
        id_nature_document: number;
        etat_document?: string;
        classification?: string;
        id_dossier?: number;
      };
    }) => addDocumentToEmploye(employeId, documentData),
    onSuccess: (_, { employeId }) => {
      // Invalider la liste des documents de l'employé
      queryClient.invalidateQueries({
        queryKey: employeDocumentKeys.list(employeId),
      });

      // Invalider les données de l'employé
      queryClient.invalidateQueries({
        queryKey: ["employes", employeId],
      });

      toast.success("Document ajouté avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de l'ajout du document:", error);
      toast.error(`Erreur lors de l'ajout du document: ${error.message}`);
    },
  });
};

/**
 * Hook pour supprimer un document d'un employé
 */
export const useDeleteDocumentFromEmploye = () => {
  const queryClient = useQueryClient();
  const { deleteDocumentFromEmploye } = useEmployesApi();
  
  return useMutation({
    mutationFn: ({
      employeId,
      documentId,
    }: {
      employeId: number;
      documentId: number;
    }) => deleteDocumentFromEmploye(employeId, documentId),
    onSuccess: (_, { employeId }) => {
      // Invalider la liste des documents de l'employé
      queryClient.invalidateQueries({
        queryKey: employeDocumentKeys.list(employeId),
      });

      // Invalider les données de l'employé
      queryClient.invalidateQueries({
        queryKey: ["employes", employeId],
      });

      toast.success("Document supprimé avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la suppression du document:", error);
      toast.error(`Erreur lors de la suppression du document: ${error.message}`);
    },
  });
};

/**
 * Hook pour obtenir les statistiques des documents d'un employé
 */
export const useEmployeDocumentStats = (employeId: number) => {
  const { data: documents, isLoading, error } = useEmployeDocuments(employeId);
  
  const stats = {
    total: documents?.length || 0,
    public: documents?.filter((doc) => doc.etat_document === "public").length || 0,
    private: documents?.filter((doc) => doc.etat_document === "private").length || 0,
    draft: documents?.filter((doc) => doc.etat_document === "draft").length || 0,
  };

  return {
    stats,
    isLoading,
    error,
  };
};

// ===== HOOKS POUR LES NATURES DE DOCUMENTS =====

/**
 * Hook pour récupérer toutes les natures de documents
 */
export const useNatures = () => {
  const { fetchNatures } = useEmployesApi();
  
  return useQuery({
    queryKey: natureKeys.list(),
    queryFn: async () => {
      console.log("🔍 Récupération des natures...");
      const result = await fetchNatures();
      console.log("📋 Natures récupérées:", result);
      return result;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Hook pour créer une nouvelle nature
 */
export const useCreateNature = () => {
  const queryClient = useQueryClient();
  const { createNature } = useEmployesApi();
  
  return useMutation({
    mutationFn: (libelle: string) => createNature(libelle),
    onSuccess: () => {
      // Invalider la liste des natures
      queryClient.invalidateQueries({
        queryKey: natureKeys.list(),
      });
      toast.success("Nature créée avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la création de la nature:", error);
      toast.error(`Erreur lors de la création de la nature: ${error.message}`);
    },
  });
};

/**
 * Hook pour mettre à jour une nature
 */
export const useUpdateNature = () => {
  const queryClient = useQueryClient();
  const { updateNature } = useEmployesApi();
  
  return useMutation({
    mutationFn: ({ id, libelle }: { id: number; libelle: string }) => 
      updateNature(id, libelle),
    onSuccess: () => {
      // Invalider la liste des natures
      queryClient.invalidateQueries({
        queryKey: natureKeys.list(),
      });
      toast.success("Nature mise à jour avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la mise à jour de la nature:", error);
      toast.error(`Erreur lors de la mise à jour de la nature: ${error.message}`);
    },
  });
};

/**
 * Hook pour supprimer une nature
 */
export const useDeleteNature = () => {
  const queryClient = useQueryClient();
  const { deleteNature } = useEmployesApi();
  
  return useMutation({
    mutationFn: (id: number) => deleteNature(id),
    onSuccess: () => {
      // Invalider la liste des natures
      queryClient.invalidateQueries({
        queryKey: natureKeys.list(),
      });
      toast.success("Nature supprimée avec succès");
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la suppression de la nature:", error);
      toast.error(`Erreur lors de la suppression de la nature: ${error.message}`);
    },
  });
};
