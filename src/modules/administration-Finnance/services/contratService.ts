import { useCallback } from "react";
import { useApi } from "@/api/api";
import axios from "axios";
import {
  ContratDocument,
  ContratResponse,
  CreateContratData,
  UpdateContratData,
  ApiResponse,
} from "@/modules/administration-Finnance/administration/types/interfaces";

/**
 * Hook personnalisé pour la gestion des contrats
 */
export const useContratsApi = () => {
  const api = useApi();

  const fetchContrats = useCallback(
    async ({ limit, page }: { limit: number; page: number }) => {
      const response = await api.get<ContratResponse>(
        "/administration/contrats",
        {
          params: {
            limit,
            page,
          },
        }
      );
      return response.data.data;
    },
    [api]
  );

  const addContrat = useCallback(
    async (
      contratData: CreateContratData,
      documentFile?: File
    ): Promise<ContratResponse> => {
      let response;
      if (documentFile) {
        const formData = new FormData();
        Object.entries(contratData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
        formData.append("document", documentFile);

        response = await api.post<ContratResponse>(
          "/administration/contrats",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        const cleanData = Object.fromEntries(
          Object.entries(contratData).filter(
            ([, value]) => value !== undefined && value !== null
          )
        );
        response = await api.post<ContratResponse>(
          "/administration/contrats",
          cleanData
        );
      }
      return response.data;
    },
    [api]
  );

  const fetchContratById = useCallback(
    async (id: string | number): Promise<ContratResponse | null> => {
      const response = await api.get<ApiResponse<ContratResponse[]>>(
        `/administration/contrats/${id}`
      );
      const data = response.data?.data;
      if (Array.isArray(data) && data.length > 0) {
        const contrat = data[0];
        contrat.documents = Array.isArray(contrat.documents)
          ? contrat.documents
          : contrat.documents
          ? [contrat.documents]
          : [];
        return contrat;
      }
      return null;
    },
    [api]
  );

  const updateContrat = useCallback(
    async (
      id: string | number,
      contratData: UpdateContratData,
      documentFile?: File
    ): Promise<ContratResponse> => {
      try {
        let response;
        if (documentFile) {
          const formData = new FormData();
          Object.entries(contratData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, value.toString());
            }
          });
          formData.append("document", documentFile);

          response = await api.put<ContratResponse>(
            `/administration/contrats/${id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        } else {
          // Nettoyer les données en s'assurant que les valeurs sont correctes
          const cleanData = Object.fromEntries(
            Object.entries(contratData).filter(
              ([, value]) => value !== undefined && value !== null
            )
          );
          
          response = await api.put<ContratResponse>(
            `/administration/contrats/${id}`,
            cleanData
          );
        }
        return response.data;
      } catch (error: unknown) {
        console.error("Erreur lors de la mise à jour du contrat:", error);
        console.error("Données envoyées:", contratData);
        console.error("ID du contrat:", id);
        
        // Log détaillé de l'erreur Axios
        if (axios.isAxiosError(error)) {
          console.error("Réponse d'erreur du serveur:", error.response?.data);
          console.error("Status code:", error.response?.status);
          console.error("Headers:", error.response?.headers);
        } else if (error && typeof error === 'object' && 'request' in error) {
          console.error("Aucune réponse reçue:", (error as { request: unknown }).request);
        } else {
          console.error("Erreur de configuration:", (error as Error)?.message);
        }
        
        throw error;
      }
    },
    [api]
  );

  const deleteContrat = useCallback(
    async (id: string | number) => {
      try {
        console.log(`[DELETE] Début de la suppression du contrat ${id}`);
        
        // D'abord, récupérer le contrat pour voir s'il a des documents
        console.log(`[DELETE] Récupération des détails du contrat ${id}`);
        const contratResponse = await api.get(`/administration/contrats/${id}`);
        const contrat = contratResponse.data;
        console.log(`[DELETE] Contrat récupéré:`, contrat);

        // Supprimer les documents associés s'ils existent
        if (contrat.documents && Array.isArray(contrat.documents) && contrat.documents.length > 0) {
          console.log(`[DELETE] Suppression de ${contrat.documents.length} document(s) associé(s) au contrat ${id}`);
          for (const doc of contrat.documents) {
            try {
              console.log(`[DELETE] Suppression du document ${doc.id_documents}`);
              await api.delete(`/administration/contrats/docContrat/${doc.id_documents}`);
              console.log(`[DELETE] ✓ Document ${doc.id_documents} supprimé avec succès`);
            } catch (docError) {
              console.error(`[DELETE] ✗ Erreur lors de la suppression du document ${doc.id_documents}:`, docError);
              // Continuer même si un document ne peut pas être supprimé
            }
          }
        } else {
          console.log(`[DELETE] Aucun document à supprimer pour le contrat ${id}`);
        }

        // Maintenant supprimer le contrat
        console.log(`[DELETE] Suppression du contrat ${id}`);
        const response = await api.delete(`/administration/contrats/${id}`);
        console.log(`[DELETE] ✓ Contrat ${id} supprimé avec succès`);
        console.log(`[DELETE] Réponse du serveur:`, response.data);
        return response.data;
      } catch (error: unknown) {
        console.error("[DELETE] ID du contrat:", id);
        
        // Log détaillé de l'erreur Axios
        if (axios.isAxiosError(error)) {
          console.error("[DELETE] Réponse d'erreur du serveur:", error.response?.data);
          console.error("[DELETE] Status code:", error.response?.status);
          console.error("[DELETE] Headers:", error.response?.headers);
          
          // Détecter les erreurs de contrainte de clé étrangère
          const errorMessage = error.response?.data?.message || "";
          const errorDetails = error.response?.data?.details || "";
          
          if (errorMessage.includes("foreign key") || 
              errorDetails.includes("foreign key") ||
              errorMessage.includes("contrainte") ||
              errorDetails.includes("contrainte") ||
              errorMessage.includes("intervention") ||
              errorDetails.includes("intervention")) {
            
            // Créer une erreur personnalisée pour les contraintes de clé étrangère
            const customError = new Error("CONTRAT_LINKED_TO_INTERVENTION");
            customError.message = "Ce contrat est lié à une ou plusieurs interventions. Veuillez d'abord dissocier le contrat de toutes les interventions avant de le supprimer.";
            throw customError;
          }
        } else if (error && typeof error === 'object' && 'request' in error) {
          console.error("[DELETE] Aucune réponse reçue:", (error as { request: unknown }).request);
        } else {
          console.error("[DELETE] Erreur de configuration:", (error as Error)?.message);
        }
        
        throw error;
      }
    },
    [api]
  );

  const fetchContratsByType = useCallback(
    async (type: string) => {
      const response = await api.get(`/administration/contrats/type/${type}`);
      if (Array.isArray(response.data)) return response.data;
      if (response.data && Array.isArray(response.data.data))
        return response.data.data;
      return [];
    },
    [api]
  );

  const fetchContratsByPartenaire = useCallback(
    async (id_partenaire: string | number) => {
      const response = await api.get(
        `/administration/contrats/partenaire/${id_partenaire}`
      );
      if (Array.isArray(response.data)) return response.data;
      if (response.data && Array.isArray(response.data.data))
        return response.data.data;
      return [];
    },
    [api]
  );

  const addDocumentToContrat = useCallback(
    async (
      contratId: string | number,
      documentData: Omit<ContratDocument, "id_documents" | "id_contrat">,
      file: File
    ): Promise<ContratDocument> => {
      const formData = new FormData();
      formData.append("document", file);
      Object.entries(documentData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      formData.append("id_contrat", String(contratId));

      const response = await api.post<ContratDocument>(
        `/administration/contrats/${contratId}/doc`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data;
    },
    [api]
  );

  const deleteDocumentFromContrat = useCallback(
    async (contratId: string | number, docId: string | number) => {
      const response = await api.delete(
        `/administration/contrats/${contratId}/docContrat/${docId}`
      );
      return response.data;
    },
    [api]
  );

  const fetchNaturesDocument = useCallback(async () => {
    const response = await api.get(`/administration/natures`);
    return response.data;
  }, [api]);

  // Nouvelle méthode : Récupérer les contrats d'une entité
  const fetchContratsByEntite = useCallback(
    async (idEntite: number) => {
      const response = await api.get(`/administration/contrats/entite/${idEntite}`);
      if (Array.isArray(response.data)) return response.data;
      if (response.data && Array.isArray(response.data.data))
        return response.data.data;
      return [];
    },
    [api]
  );

  // Nouvelle méthode : Récupérer les contrats sans entité
  const fetchContratsSansEntite = useCallback(async () => {
    const response = await api.get(`/administration/contrats/sans/sans-entite`);
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.data))
      return response.data.data;
    return [];
  }, [api]);

  return {
    fetchContrats,
    addContrat,
    fetchContratById,
    updateContrat,
    deleteContrat,
    fetchContratsByType,
    fetchContratsByPartenaire,
    fetchContratsByEntite, // Nouvelle méthode
    fetchContratsSansEntite, // Nouvelle méthode
    addDocumentToContrat,
    deleteDocumentFromContrat,
    fetchNaturesDocument,
  };
};
