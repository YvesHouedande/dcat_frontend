import { useApi } from "@/api/api";
import {
  DocumentDosierResponse,
  DossierInterventionResponse,
  DossierResponse,
  DossierType,
  PaginationParams,
} from "../types/dossierType";

export const useDossier = () => {
  const api = useApi();

  const getDossier = async (
    params: PaginationParams = {}
  ): Promise<DossierResponse> => {
    const response = await api.get("/administration/dossier", {
      params: { ...params },
    });
    return response.data;
  };
  const getDossierIntervention = async (
    params: PaginationParams = {}
  ): Promise<DossierInterventionResponse> => {
    const response = await api.get(
      "/administration/dossier/documents/intervention",
      {
        params: { ...params },
      }
    );
    return response.data;
  };

  const getDossierById = async (id: string): Promise<DossierType> => {
    const response = await api.get(`/administration/dossier/${id}`);
    return response.data;
  };

  const createDossier = async (
    dossier: Omit<DossierType, "id_dossier">
  ): Promise<DossierType> => {
    const response = await api.post("/administration/dossier/create", dossier);
    return response.data;
  };

  const updateDossier = async (
    id: string,
    dossier: Partial<Omit<DossierType, "id_dossier">>
  ): Promise<DossierType> => {
    const response = await api.put(`/administration/dossier/${id}`, dossier);
    return response.data;
  };

  const deleteDossier = async (id: string): Promise<void> => {
    await api.delete(`/administration/dossier/${id}`);
  };

  const deleteDocumentDossier = async (id: string): Promise<void> => {
    await api.delete(`/administration/dossier/document/${id}`);
  };

  const getDossierByType = async (
    type: string,
    params: PaginationParams = {}
  ): Promise<DossierResponse> => {
    const response = await api.get(
      `/administration/dossier/type/${type}/libelle/${params.libelle_dossier}`,
      {
        params: { ...params },
      }
    );
    return response.data;
  };

  const getDocumentDossierById = async (
    id: string | number,
    params: PaginationParams = {}
  ): Promise<DocumentDosierResponse> => {
    const response = await api.get(
      `/administration/dossier/${id}/documents/libelle/${params.libelle_document}`,
      { params: { ...params } }
    );
    return response.data;
  };

  return {
    getDossier,
    getDossierById,
    createDossier,
    updateDossier,
    deleteDossier,
    deleteDocumentDossier,
    getDossierByType,
    getDocumentDossierById,
    getDossierIntervention,
  };
};
