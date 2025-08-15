import { useCallback } from "react";
import { useApi } from "@/api/api";
import {
  Demande,
  Employe,
  NatureDocument,
  DemandeDocument,
  DemandeResponse,
  EmployeResponse,
  FilterParams,
} from "../administration/types/interfaces";
import { omit } from "@/lib/utils";

// Types d'entrée
export type CreateDemandeData = Omit<
  Demande,
  "id_demandes" | "created_at" | "updated_at" | "documents"
>;
export type UpdateDemandeData = Partial<CreateDemandeData>;
export type AddDocumentData = {
  file: File;
  libelle_document: string;
  id_nature_document: number;
  id_dossier?: number; // Optionnel pour associer à un dossier
};

export const useDemandesApi = () => {
  const api = useApi();

  const createDemande = useCallback(
    async (data: CreateDemandeData): Promise<Demande> => {
      const response = await api.post<Demande>(
        "/administration/demandes",
        data
      );
      return response.data;
    },
    [api]
  );

  const fetchDemandes = useCallback(async (): Promise<DemandeResponse> => {
    const response = await api.get<DemandeResponse>("/administration/demandes");
    return response.data;
  }, [api]);

  const fetchFilteredDemandes = useCallback(
    async (filters: FilterParams): Promise<DemandeResponse> => {
      const response = await api.get<DemandeResponse>(
        "/administration/demandes",
        { params: filters }
      );
      return response.data;
    },
    [api]
  );

  const fetchDemandeById = useCallback(
    async (id: number): Promise<Demande> => {
      const response = await api.get<Demande>(`/administration/demandes/${id}`);
      return response.data;
    },
    [api]
  );

  const updateDemande = useCallback(
    async (id: number, data: Partial<Demande>): Promise<Demande> => {
      const cleanedData = omit(data, ["id_demandes", "documents"]);
      const response = await api.put<Demande>(
        `/administration/demandes/${id}`,
        cleanedData
      );
      return response.data;
    },
    [api]
  );

  const deleteDemande = useCallback(
    async (id: number): Promise<void> => {
      await api.delete(`/administration/demandes/${id}`);
    },
    [api]
  );

  const fetchDemandesByType = useCallback(
    async (type: string): Promise<Demande[]> => {
      const response = await api.get<Demande[]>(
        `/administration/demandes/type/${type}`
      );
      return response.data;
    },
    [api]
  );

  const fetchDemandesByEmploye = useCallback(
    async (id_employe: number): Promise<Demande[]> => {
      const response = await api.get<Demande[]>(
        `/administration/demandes/employe/${id_employe}`
      );
      return response.data;
    },
    [api]
  );

  const addDocumentToDemande = useCallback(
    async (
      demandeId: number,
      documentData: AddDocumentData
    ): Promise<{ success: boolean; message: string; data: { document: DemandeDocument[] } }> => {
      const formData = new FormData();
      formData.append("document", documentData.file);
      formData.append("libelle_document", documentData.libelle_document);
      formData.append("date_document", new Date().toISOString());
      formData.append("classification_document", "demande RH");
      formData.append("etat_document", "private");
      formData.append("id_nature_document", documentData.id_nature_document.toString());

      console.log("Upload document to demande:", {
        demandeId,
        fileName: documentData.file.name,
        fileSize: documentData.file.size,
        formDataKeys: Array.from(formData.keys())
      });

      const response = await api.post<{ success: boolean; message: string; data: { document: DemandeDocument[] } }>(
        `/administration/demandes/${demandeId}/documents`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      const result = response.data;
      
      // Si un dossier est spécifié et que le document a été créé avec succès, l'associer au dossier
      if (documentData.id_dossier && result.success && result.data.document.length > 0) {
        try {
          const documentId = result.data.document[0].id_documents;
          console.log("Association du document", documentId, "au dossier", documentData.id_dossier);
          
          // Appel à l'API pour associer le document au dossier
          await api.post(`/administration/dossier/${documentData.id_dossier}/document/${documentId}`, {
            id_dossier: documentData.id_dossier,
            id_documents: documentId
          });
          
          console.log("Document associé au dossier avec succès");
        } catch (dossierError) {
          console.warn("Erreur lors de l'association au dossier:", dossierError);
          // Ne pas faire échouer l'upload du document si l'association au dossier échoue
        }
      }
      
      return result;
    },
    [api]
  );

  const deleteDocumentFromDemande = useCallback(
    async (demandeId: number, documentId: number): Promise<void> => {
      await api.delete(
        `/administration/demandes/${demandeId}/docdemande/${documentId}`
      );
    },
    [api]
  );

  const approuverDemande = useCallback(
    async (id: number, commentaire?: string): Promise<Demande> => {
      return await updateDemande(id, {
        status: "Approuvée",
        ...(commentaire && { commentaire_approbation: commentaire }),
      });
    },
    [updateDemande]
  );

  const refuserDemande = useCallback(
    async (id: number, motif?: string): Promise<Demande> => {
      return await updateDemande(id, {
        status: "Refusée",
        ...(motif && { motif_refus: motif }),
      });
    },
    [updateDemande]
  );

  const getAllEmployes = useCallback(async (): Promise<Employe[]> => {
    const response = await api.get<EmployeResponse>("/administration/employes");
    return response.data.data;
  }, [api]);

  const fetchEmployeById = useCallback(
    async (id: number): Promise<Employe> => {
      const response = await api.get<Employe>(`/administration/employes/${id}`);
      return response.data;
    },
    [api]
  );

  const getAllNatureDocuments = useCallback(async (): Promise<
    NatureDocument[]
  > => {
    const response = await api.get<NatureDocument[]>("/administration/natures");
    return response.data;
  }, [api]);

  const fetchDocumentsByDemande = useCallback(
    async (demandeId: number): Promise<DemandeDocument[]> => {
      const demande = await fetchDemandeById(demandeId);
      return demande.documents || [];
    },
    [fetchDemandeById]
  );

  return {
    createDemande,
    fetchDemandes,
    fetchDemandeById,
    updateDemande,
    deleteDemande,
    fetchDemandesByType,
    fetchDemandesByEmploye,
    addDocumentToDemande,
    deleteDocumentFromDemande,
    approuverDemande,
    refuserDemande,
    getAllEmployes,
    fetchEmployeById,
    getAllNatureDocuments,
    fetchDocumentsByDemande,
    fetchFilteredDemandes,
  };
};
