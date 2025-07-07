import { useApi } from "@/api/api";
import { PaginatedResponse, PaginationParams } from "../types";
import {
  ExemplaireProduit,
  ExemplaireProduitFormValues,
} from "../schemas/ExemplaireProduitSchema";

export const useExemplaireProduitService = () => {
  const api = useApi();

  const getAll = async (
    params: PaginationParams,
    id_produit: string | number
  ): Promise<PaginatedResponse<ExemplaireProduit>> => {
    const response = await api.get(`stocks/exemplaires/produit/${id_produit}`, {
      params,
    });

    return {
      data: response.data,
      pageSize: params.limit,
      currentPage: response.data.page,
      totalPages: Math.ceil(response.data.total / params.limit),
      totalItems: response.data.total,
      total: response.data.total,
      page: response.data.page,
    };
  };

  const getById = async (id: string): Promise<ExemplaireProduitFormValues> => {
    const response = await api.get(`/stocks/exemplaires/${id}`);
    return response.data;
  };

  const create = async (
    data: Omit<ExemplaireProduitFormValues, "id_exemplaire" | "prix_exemplaire">
  ): Promise<ExemplaireProduitFormValues> => {
    const response = await api.post("/stocks/exemplaires", data);

    return response.data;
  };

  const getByEtat = async (
    etat_exemplaire: string,
    params: PaginationParams,
    id_produit: string | number
  ): Promise<PaginatedResponse<ExemplaireProduit>> => {
    let response;
    if (etat_exemplaire === "all") {
      response = await api.get(`stocks/exemplaires/produit/${id_produit}`, {
        params,
      });
    } else {
      response = await api.get(
        `stocks/exemplaires/produit/${id_produit}/etat/${etat_exemplaire}`,
        { params }
      );
    }

    return {
      data: response.data.data,
      pageSize: params.limit,
      currentPage: response.data.page,
      totalPages: Math.ceil(response.data.total / params.limit),
      totalItems: response.data.total,
      total: response.data.total,
      page: response.data.page,
    };
  };

  const update = async (
    id: string | number,
    data: Omit<ExemplaireProduitFormValues, "prix_exemplaire">
  ): Promise<ExemplaireProduitFormValues> => {
    const response = await api.put(`/stocks/exemplaires/${id}`, data);
    return response.data;
  };

  const remove = async (id: string | number): Promise<void> => {
    await api.delete(`/stocks/exemplaires/${id}`);
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: remove,
    getByEtat,
  };
};
