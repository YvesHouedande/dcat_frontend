import { useCallback } from "react";
import { useApi } from "@/api/api";
import {
  Contrat,
  PaginationResponse,
} from "@/modules/administration-Finnance/administration/types/interfaces";
import { EmployeDocument } from "@/modules/administration-Finnance/administration/types/interfaces";

export const useContratsApi = () => {
  const api = useApi();

  const fetchContrats = useCallback(async () => {
    const res = await api.get("/administration/contrats");
    return res.data;
  }, [api]);

  const fetchContratById = useCallback(
    async (id: string | number) => {
      const res = await api.get(`/administration/contrats/${id}`);
      return res.data;
    },
    [api]
  );

  const addContrat = useCallback(
    async (contratData: Omit<Contrat, "id_contrat">, documentFile?: File) => {
      if (documentFile) {
        const formData = new FormData();
        Object.entries(contratData).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value.toString());
          }
        });
        formData.append("document", documentFile);

        const res = await api.post("/administration/contrats", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
      } else {
        const res = await api.post("/administration/contrats", contratData);
        return res.data;
      }
    },
    [api]
  );

  const updateContrat = useCallback(
    async (
      id: string | number,
      contratData: Partial<Contrat>,
      documentFile?: File
    ) => {
      if (documentFile) {
        const formData = new FormData();
        Object.entries(contratData).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value.toString());
          }
        });
        formData.append("document", documentFile);

        const res = await api.put(`/administration/contrats/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
      } else {
        const res = await api.put(
          `/administration/contrats/${id}`,
          contratData
        );
        return res.data;
      }
    },
    [api]
  );

  const deleteContrat = useCallback(
    async (id: string | number) => {
      const res = await api.delete(`/administration/contrats/${id}`);
      return res.data;
    },
    [api]
  );

  const fetchNaturesDocument = useCallback(async () => {
    const res = await api.get("/administration/natures");
    return res.data;
  }, [api]);

  const fetchDocuments = useCallback(async () => {
    const res = await api.get("/administration/documents");
    return res.data;
  }, [api]);

  const fetchDocumentById = useCallback(
    async (id: number) => {
      const res = await api.get(`/administration/documents/${id}`);
      return res.data;
    },
    [api]
  );

  const addDocument = useCallback(
    async (documentData: Omit<Document, "id_document">, file: File) => {
      const formData = new FormData();
      Object.entries(documentData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value ? value.toString() : "");
        }
      });
      formData.append("file", file);

      const res = await api.post("/administration/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    [api]
  );

  const updateDocument = useCallback(
    async (
      id: string | number,
      updates: Partial<Document>,
      file?: File
    ): Promise<Document> => {
      const formData = new FormData();
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value ? value.toString() : "");
        }
      });
      if (file) {
        formData.append("file", file);
      }

      const res = await api.put(`/administration/documents/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    [api]
  );

  const deleteDocument = useCallback(
    async (id: string | number, contratId?: string | number): Promise<void> => {
      const url = contratId
        ? `/administration/contrats/${contratId}/documents/${id}`
        : `/administration/documents/${id}`;
      await api.delete(url);
    },
    [api]
  );

  const fetchDocumentsByProjetId = useCallback(
    async (id_projet: number) => {
      const res = await api.get(
        `/administration/documents/projet/${id_projet}`
      );
      return res.data;
    },
    [api]
  );

  const fetchEmployeDocuments = useCallback(
    async (
      id_employes: number,
      page: number,
      limit: number
    ): Promise<PaginationResponse<EmployeDocument[]>> => {
      const res = await api.get<PaginationResponse<EmployeDocument[]>>(
        `/administration/employes/${id_employes}/documents?page=${page}&limit=${limit}`
      );
      if (!res.data) throw new Error("Aucun document trouvé");
      return res.data;
    },
    [api]
  );

  const downloadDocument = useCallback(
    async (id_document: string): Promise<Blob> => {
      const res = await api.get(
        `/administration/documents/${id_document}/download`,
        {
          responseType: "blob",
        }
      );
      return res.data;
    },
    [api]
  );

  const uploadDocument = useCallback(
    async (
      id_employes: number,
      file: File,
      type: string
    ): Promise<Document> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("id_employes", id_employes.toString());

      const res = await api.post("/administration/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    },
    [api]
  );

  return {
    fetchContrats,
    fetchContratById,
    addContrat,
    updateContrat,
    deleteContrat,
    fetchNaturesDocument,
    fetchDocuments,
    fetchDocumentById,
    addDocument,
    updateDocument,
    deleteDocument,
    fetchDocumentsByProjetId,
    fetchEmployeDocuments,
    downloadDocument,
    uploadDocument,
  };
};
