// src/services/productInstanceService.ts
import { useApi } from "@/api/api";
import { PaginatedResponse, PaginationParams } from "../types";
import { ProductInstanceFormValues } from "../schemas/productInstanceSchema";

// Factory that returns the service, so we can use hooks
export const ProductInstanceService = () => {
  const api = useApi();

  return {
    getAll: async (
      params: PaginationParams
    ): Promise<PaginatedResponse<ProductInstanceFormValues>> => {
      console.log(params);
      const response = await api.get("/stocks/exemplaires", { params });

      // MOCK DATA

      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
        totalPages: Math.ceil(response.data.total / response.data.pageSize),
      };
    },

    delete: async (id: string | number): Promise<void> => {
      return await api.delete(`/stocks/exemplaires/${id}`);
    },

  };
};
