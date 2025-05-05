// src/services/exemplaireSortieService.ts
import {api }from "@/api/api"; // Assurez-vous que le chemin d'importation est correct
import { PaginatedResponse, PaginationParams, ExemplaireSortie } from "../types";

export const exemplaireSortieService = {
  getAll: async (params: PaginationParams): Promise<PaginatedResponse<ExemplaireSortie>> => {
    const response = await api.get("/exemplaire-sorties", { params });
    return response.data;
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