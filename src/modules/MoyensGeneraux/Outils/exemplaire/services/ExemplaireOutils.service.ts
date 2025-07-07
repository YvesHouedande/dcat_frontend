// src/services/ExemplaireProduitService.ts
import { useApi } from "@/api/api";
import {
  PaginatedResponse,
  PaginationParams,
  ExemplaireProduit,
} from "../types";
const RetunrApi = () => {
  const api = useApi();
  return api;
};
export const ExemplaireOutilsService = {
  getAll: async (
    params: PaginationParams
  ): Promise<PaginatedResponse<ExemplaireProduit>> => {
    // const response = await api.get("/product-instances", { params });
    // return response.data;
    console.log(params);
    const ExemplaireProduits: ExemplaireProduit[] = [
      {
        id_exemplaire: 1,
        num_serie: "ABC123456789",
        prix_exemplaire: "749",
        date_entree: "2025-04-10",
        etat_vente: "invendu",
        commentaire: "",
        id_livraison: 2,
        id_produit: 1,
      },
      {
        id_exemplaire: 2,
        num_serie: "XYZ987654321",
        prix_exemplaire: "749",
        date_entree: "2025-04-10",
        etat_vente: "invendu",
        commentaire: "",
        id_livraison: 2,
        id_produit: 2,
      },
      {
        id_exemplaire: 3,
        num_serie: "LMN112233445",
        prix_exemplaire: "749",
        date_entree: "2025-04-12",
        etat_vente: "vendu",
        commentaire: "",
        id_livraison: 3,
        id_produit: 3,
      },
    ];
    return {
      data: ExemplaireProduits,
      total: ExemplaireProduits.length,
      page: 1,
      pageSize: ExemplaireProduits.length,
      totalPages: 1,
    };
  },

  getById: async (id: string): Promise<ExemplaireProduit> => {
    const api = RetunrApi();
    const response = await api.get(`/product-instances/${id}`);
    return response.data;
  },

  create: async (
    data: Omit<ExemplaireProduit, "id_exemplaire" | "prix_exemplaire">
  ): Promise<ExemplaireProduit> => {
    const api = RetunrApi();
    const response = await api.post("/product-instances", data);
    return response.data;
  },

  update: async (
    id: string | number,
    data: Omit<ExemplaireProduit, "prix_exemplaire">
  ): Promise<ExemplaireProduit> => {
    const api = RetunrApi();
    const response = await api.put(`/product-instances/${id}`, data);
    return response.data;
  },

  delete: async (id: string | number): Promise<void> => {
    const api = RetunrApi();
    await api.delete(`/product-instances/${id}`);
  },
};
