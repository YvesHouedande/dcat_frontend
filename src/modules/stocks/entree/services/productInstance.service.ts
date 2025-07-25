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
      const response = await api.get("/stocks/exemplaires", { params });
      
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize, // cohérent avec le hook (ex: 10)
        totalPages: response.data.totalPages,
        hasNextPage: !!response.data.hasNextPage,
        hasPrevPage: !!response.data.hasPrevPage,
      };
    },

    delete: async (id: string | number): Promise<void> => {
      return await api.delete(`/stocks/exemplaires/${id}`);
    },
  };
};
