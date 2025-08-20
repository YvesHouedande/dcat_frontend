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
      
      // Ajouter l'ID du dossier directement dans le FormData si spécifié
      if (documentData.id_dossier) {
        formData.append("id_dossier", documentData.id_dossier.toString());
      }

      console.log("Upload document to demande:", {
        demandeId,
        fileName: documentData.file.name,
        fileSize: documentData.file.size,
        formDataKeys: Array.from(formData.keys()),
        id_dossier: documentData.id_dossier
      });

      const response = await api.post<{ success: boolean; message: string; data: { document: DemandeDocument[] } }>(
        `/administration/demandes/${demandeId}/documents`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      return response.data;
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

  // Méthodes CRUD pour les natures de documents
  const createNature = useCallback(async (libelle: string) => {
    const response = await api.post(`/administration/natures`, { libelle });
    return response.data;
  }, [api]);

  const fetchNatureDocumentById = useCallback(async (id: string): Promise<NatureDocument> => {
    const response = await api.get(`/administration/natures/${id}`);
    return response.data;
  }, [api]);

  const updateNature = useCallback(async (id: number, libelle: string) => {
    const response = await api.put(`/administration/natures/${id}`, { libelle });
    return response.data;
  }, [api]);

  const deleteNature = useCallback(async (id: number) => {
    const response = await api.delete(`/administration/natures/${id}`);
    return response.data;
  }, [api]);

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
    createNature,
    fetchNatureDocumentById,
    updateNature,
    deleteNature,
  };
};
