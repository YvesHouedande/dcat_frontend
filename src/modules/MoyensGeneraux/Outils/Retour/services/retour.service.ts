// src/services/exemplaireSortieService.ts
import {api }from "@/api/api"; // Assurez-vous que le chemin d'importation est correct
import { RetourSchemaFormsValue } from "../types";
import { PaginatedResponse, PaginationParams } from "../../exemplaire";
import { idSotieOutils } from "../../sorties/types";

export const retourService = {
  // getAll: async (params: PaginationParams): Promise<PaginatedResponse<ExemplaireSortie>> => {
  //   const response = await api.get("/exemplaire-sorties", { params });
  //   return response.data;
  // },
  getAll: async (params: PaginationParams): Promise<PaginatedResponse<RetourSchemaFormsValue>> => {
    
    const prod:RetourSchemaFormsValue[] = 
      [
        {
          "id_exemplaire": 1,
          "id_employes": 12,
          "etat_apres": "bon",
          "date_de_retour": "2025-05-03",
          "commentaire": "Doit être ramené demain"
        },
        {
          "id_exemplaire": 2,
          "id_employes": 15,
          "etat_apres": "endommage",
          "date_de_retour": "2025-05-01",
        },
        {
          "id_exemplaire": 3,
          "id_employes": 7,
          "etat_apres": "bon",
          "date_de_retour": "2025-04-28",
          "commentaire": ""
        },
        {
          "id_exemplaire": 4,
          "id_employes": 3,
          "etat_apres": "bon",
          "date_de_retour": "2025-04-28",
        },
        {
          "id_exemplaire": 5,
          "id_employes": 18,
          "etat_apres": "endommage",
          "date_de_retour": "2025-04-30",
          "commentaire": "Remplacé par un outil neuf"
        },
        {
          "id_exemplaire": 6,
          "id_employes": 22,
          "etat_apres": "bon",
          "date_de_retour": "2025-04-29",
        },
        {
          "id_exemplaire": 7,
          "id_employes": 5,
          "etat_apres": "bon",
          "date_de_retour": "2025-05-03",
          "commentaire": "Besoin d'une rallonge"
        },
        {
          "id_exemplaire": 8,
          "id_employes": 11,
          "etat_apres": "bon",
          "date_de_retour": "2025-05-01",
        },
        {
          "id_exemplaire": 9,
          "id_employes": 19,
          "etat_apres": "endommage",
          "date_de_retour": "2025-05-02",
          "commentaire": "Endommagé légèrement"
        },
        {
          "id_exemplaire": 10,
          "id_employes": 6,
          "etat_apres": "bon",
          "date_de_retour": "2025-04-27",
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
  
  getById: async (ids: idSotieOutils): Promise<RetourSchemaFormsValue> => {
    const { id_exemplaire, id_employes, date_de_retour } = ids;
    const response = await api.get(`/exemplaire-sorties/${id_exemplaire}/${id_employes}/${encodeURIComponent(String(date_de_retour))}`);
    return response.data;
  },
  
  create: async (data: RetourSchemaFormsValue): Promise<RetourSchemaFormsValue> => {
    const response = await api.post("/exemplaire-sorties", data);
    return response.data;
  },

  update: async (
    ids: idSotieOutils,
    data: Omit<RetourSchemaFormsValue, "id_exemplaire" | "id_employes" | "date_de_retour">
  ): Promise<RetourSchemaFormsValue> => {
    const { id_exemplaire, id_employes, date_de_retour } = ids;
  
    const response = await api.put(
      `/exemplaire-sorties/${id_exemplaire}/${id_employes}/${encodeURIComponent(String(date_de_retour))}`,
      data
    );
    
  
    return response.data;
  },
  
  
  
  delete: async (ids: idSotieOutils): Promise<void> => {
    const { id_exemplaire, id_employes, date_de_retour } = ids;
    const response = await api.delete(
      `/exemplaire-sorties/${id_exemplaire}/${id_employes}/${encodeURIComponent(String(date_de_retour))}`,
    );
    return response.data
  }
};