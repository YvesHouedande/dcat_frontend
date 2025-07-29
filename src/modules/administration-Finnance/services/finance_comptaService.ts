import {
  DemandeDocument,
  NatureDocument,
} from "../administration/types/interfaces";
import { useCallback } from "react";
import { useApi } from "@/api/api";

const useDocumentsApi = () => {
  const api = useApi();
  const getAllDocumentss = useCallback(async (): Promise<DemandeDocument[]> => {
    const response = await api.get("/administration/documents");
    return response.data;
  }, [api]);

  const getAllNatureDocument = useCallback(async (): Promise<
    NatureDocument[]
  > => {
    const response = await api.get("/administration/natures/");
    return response.data;
  }, [api]);

  const getDocumentById = useCallback(
    async (id: number): Promise<DemandeDocument> => {
      const response = await api.get(`/administration/documents/${id}`);
      return response.data;
    },
    [api]
  );

  const createDocument = useCallback(
    async (
      documentData: Partial<DemandeDocument> | FormData
    ): Promise<DemandeDocument> => {
      const response = await api.post("/administration/documents/ajouter", documentData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    [api]
  );

  const updateDocument = useCallback(
    async (
      id: number,
      documentData: Partial<DemandeDocument> & { document?: File | null }
    ): Promise<DemandeDocument> => {
      const formData = new FormData();
      // Ajoute tous les champs texte
      Object.entries(documentData).forEach(([key, value]) => {
        if (key === "document" && value instanceof File) {
          formData.append("document", value);
        } else if (
          value !== undefined &&
          value !== null &&
          key !== "document"
        ) {
          formData.append(key, String(value));
        }
      });
      const response = await api.put(
        `/administration/documents/modifier/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    [api]
  );

  const deleteDocument = useCallback(
    async (id: number): Promise<void> => {
      await api.delete(`/administration/documents/supprimer/${id}`);
    },
    [api]
  );

  const getDocumentsByNature = useCallback(
    async (natureId: number): Promise<DemandeDocument[]> => {
      const response = await api.get(`/administration/documents/nature/${natureId}`);
      return response.data;
    },
    [api]
  );

  const searchDocuments = useCallback(
    async (query: string): Promise<DemandeDocument[]> => {
      const response = await api.get(
        `/administration/documents/search?q=${encodeURIComponent(query)}`
      );
      return response.data;
    },
    [api]
  );

  return {
    getAllDocumentss,
    getAllNatureDocument,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentsByNature,
    searchDocuments,
  };
};

export default useDocumentsApi;
