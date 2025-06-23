import { api } from "@/api/api";
import { PaginatedResponse, PaginationParams } from "../types";
import { ProductInstanceFormValues } from "../schemas/productInstanceSchema";

export const useProductInstanceService = () => {
  const apis = api();

  const getAll = async (
    params: PaginationParams
  ): Promise<PaginatedResponse<ProductInstanceFormValues>> => {
    const response = await apis.get("/stocks/produits", { params });
    return response.data;
  };

  const getById = async (id: string): Promise<ProductInstanceFormValues> => {
    const response = await apis.get(`/product-instances/${id}`);
    return response.data;
  };

  const create = async (
    data: Omit<ProductInstanceFormValues, "id_exemplaire" | "prix_exemplaire">
  ): Promise<ProductInstanceFormValues> => {
    const response = await apis.post("/product-instances", data);
    return response.data;
  };

  const update = async (
    id: string | number,
    data: Omit<ProductInstanceFormValues, "prix_exemplaire">
  ): Promise<ProductInstanceFormValues> => {
    const response = await apis.put(`/product-instances/${id}`, data);
    return response.data;
  };

  const remove = async (id: string | number): Promise<void> => {
    await apis.delete(`/product-instances/${id}`);
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: remove,
  };
};
