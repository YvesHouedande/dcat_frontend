import { useCallback } from "react";
import { useApi } from "@/api/api";
import { DemandeDocument, NatureDocument } from "../administration/types/interfaces";

/**
 * Hook personnalisé pour la gestion des documents (comptabilité, RH, etc.)
 */
export const useDocumentsApi = () => {
  const api = useApi();

  const getAllDocuments = useCallback(async (): Promise<DemandeDocument[]> => {
    const response = await api.get<DemandeDocument[]>("/administration/documents");
    return response.data;
  }, [api]);

  const addDocument = useCallback(async (formData: FormData): Promise<DemandeDocument> => {
    const response = await api.post<DemandeDocument>(
      "/administration/documents/ajouter",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  }, [api]);

  const updateDocument = useCallback(async (id: number, formData: FormData): Promise<DemandeDocument> => {
    const response = await api.put<DemandeDocument>(
      `/administration/documents/modifier/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  }, [api]);

  const deleteDocument = useCallback(async (id: number): Promise<void> => {
    await api.delete(`/administration/documents/supprimer/${id}`);
  }, [api]);

  const getAllNatureDocuments = useCallback(async (): Promise<NatureDocument[]> => {
    const response = await api.get<NatureDocument[]>("/administration/documents/nature");
    return response.data;
  }, [api]);

  const getDocumentById = useCallback(async (id: number): Promise<DemandeDocument> => {
    const response = await api.get<DemandeDocument>(`/administration/documents/${id}`);
    return response.data;
  }, [api]);

  return {
    getAllDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    getAllNatureDocuments,
    getDocumentById,
  };
};
