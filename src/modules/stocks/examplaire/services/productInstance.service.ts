// src/services/productInstanceService.ts
import { api } from "@/api/api";
import { PaginatedResponse, PaginationParams, ProductInstance } from "../types";

export const productInstanceService = {
  getAll: async (params: PaginationParams): Promise<PaginatedResponse<ProductInstance>> => {
    // const response = await api.get("/product-instances", { params });
    // return response.data;
    const productInstances: ProductInstance[] = [
        {
          id_exemplaire: 1,
          num_serie: "ABC123456789",
          prix_exemplaire: "749",
          date_entree: "2025-04-10",
          etat_vente: "invendu",
         
          id_livraison: 101,
          id_produit: 1001
        },
        {
          id_exemplaire: 2,
          num_serie: "XYZ987654321",
          prix_exemplaire: "749",
          date_entree: "2025-04-10",
          etat_vente: "invendu",
          
          id_livraison: 102,
          id_produit: 1001
        },
        {
          id_exemplaire: 3,
          num_serie: "LMN112233445",
          prix_exemplaire: "749",
          date_entree: "2025-04-12",
          etat_vente: "vendu",
         
          id_livraison: 103,
          id_produit: 1001
        }
      ];
    return {
      data: productInstances,
      total: productInstances.length,
      page: 1,
      pageSize: productInstances.length,
      totalPages: 1
    };
  },
  
  getById: async (id: string): Promise<ProductInstance> => {
    const response = await api.get(`/product-instances/${id}`);
    return response.data;
  },
  
  create: async (data: Omit<ProductInstance, "id_exemplaire" | "prix_exemplaire">): Promise<ProductInstance> => {
    const response = await api.post("/product-instances", data);
    return response.data;
  },
  
  update: async (id: string | number, data: Omit<ProductInstance, "prix_exemplaire">): Promise<ProductInstance> => {
    const response = await api.put(`/product-instances/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string | number): Promise<void> => {
    await api.delete(`/product-instances/${id}`);
  }
};
