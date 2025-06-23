// src/services/exemplaireSortieService.ts
import {api }from "@/api/api"; // Assurez-vous que le chemin d'importation est correct
import { PaginatedResponse, PaginationParams, ExemplaireSortie } from "../types";

export const exemplaireSortieService = {
  // getAll: async (params: PaginationParams): Promise<PaginatedResponse<ExemplaireSortie>> => {
  //   const response = await api.get("/exemplaire-sorties", { params });
  //   return response.data;
  // },
  getAll: async (params: PaginationParams): Promise<PaginatedResponse<ExemplaireSortie>> => {
    
    const prod = [
      {
        "id_sortie_exemplaire": 1,
        "type_sortie": "Vente directe",
        "reference_id": "VENTE_001",
        "date_sortie": "2025-05-01",
        "id_produit": 101,
        "quantite": 5
      },
      {
        "id_sortie_exemplaire": 2,
        "type_sortie": "Projet",
        "reference_id": "RETOUR_002",
        "date_sortie": "2025-04-30",
        "id_produit": 102,
        "quantite": 3
      },
      {
        "id_sortie_exemplaire": 3,
        "type_sortie": "Vente en ligne",
        "reference_id": "PERTE_003",
        "date_sortie": "2025-04-29",
        "id_produit": 103,
        "quantite": 1
      },
      {
        "id_sortie_exemplaire": 4,
        "type_sortie": "Intervention",
        "reference_id": "VENTE_004",
        "date_sortie": "2025-05-01",
        "id_produit": 104,
        "quantite": 10
      }
    ]
    return {
      data: prod,
      total: prod.length,
      page: 1,
      pageSize: prod.length,
      totalPages: 1
    };
  },
  
  getById: async (id: number): Promise<ExemplaireSortie> => {
    const response = await api.get(`/exemplaire-sorties/${id}`);
    return response.data;
  },
  
  create: async (data: Omit<ExemplaireSortie, "id_sortie_exemplaire">): Promise<ExemplaireSortie> => {
    const response = await api.post("/exemplaire-sorties", data);
    return response.data;
  },

  
  update: async (id: number, data: Omit<ExemplaireSortie, "id_sortie_exemplaire">): Promise<ExemplaireSortie> => {
    const response = await api.put(`/exemplaire-sorties/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/exemplaire-sorties/${id}`);
  }
};