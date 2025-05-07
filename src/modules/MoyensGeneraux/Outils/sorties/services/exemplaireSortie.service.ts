// src/services/exemplaireSortieService.ts
import {api }from "@/api/api"; // Assurez-vous que le chemin d'importation est correct
import { PaginatedResponse, PaginationParams,ExemplaireSortieFormValues ,idSotieOutils } from "../types";

export const exemplaireSortieService = {
  // getAll: async (params: PaginationParams): Promise<PaginatedResponse<ExemplaireSortie>> => {
  //   const response = await api.get("/exemplaire-sorties", { params });
  //   return response.data;
  // },
  getAll: async (params: PaginationParams): Promise<PaginatedResponse<ExemplaireSortieFormValues>> => {
    console.log("params", params);
    const prod = 
      [
        {
          "id_exemplaire": 1,
          "id_employes": 12,
          "but_usage": "Réparation d'urgence",
          "etat_avant": "bon",
          "date_de_sortie": "2025-05-03",
          "site_intervention": "Site A",
          "commentaire": "Doit être ramené demain"
        },
        {
          "id_exemplaire": 2,
          "id_employes": 15,
          "but_usage": "Installation temporaire",
          "etat_avant": "endommage",
          "date_de_sortie": "2025-05-01",
          "site_intervention": "Site B"
        },
        {
          "id_exemplaire": 3,
          "id_employes": 7,
          "but_usage": "Inspection périodique",
          "etat_avant": "bon",
          "date_de_sortie": "2025-04-28",
          "site_intervention": "Entrepôt Nord",
          "commentaire": ""
        },
        {
          "id_exemplaire": 4,
          "id_employes": 3,
          "but_usage": "Test de performance",
          "etat_avant": "bon",
          "date_de_sortie": "2025-05-02",
          "site_intervention": "Site C"
        },
        {
          "id_exemplaire": 5,
          "id_employes": 18,
          "but_usage": "Remplacement provisoire",
          "etat_avant": "endommage",
          "date_de_sortie": "2025-04-30",
          "site_intervention": "Unité mobile 1",
          "commentaire": "Remplacé par un outil neuf"
        },
        {
          "id_exemplaire": 6,
          "id_employes": 22,
          "but_usage": "Mission de dépannage",
          "etat_avant": "bon",
          "date_de_sortie": "2025-04-29",
          "site_intervention": "Atelier Central"
        },
        {
          "id_exemplaire": 7,
          "id_employes": 5,
          "but_usage": "Diagnostic réseau",
          "etat_avant": "bon",
          "date_de_sortie": "2025-05-03",
          "site_intervention": "Site D",
          "commentaire": "Besoin d'une rallonge"
        },
        {
          "id_exemplaire": 8,
          "id_employes": 11,
          "but_usage": "Essai de nouvel équipement",
          "etat_avant": "bon",
          "date_de_sortie": "2025-05-01",
          "site_intervention": "Salle Test"
        },
        {
          "id_exemplaire": 9,
          "id_employes": 19,
          "but_usage": "Utilisation pour formation",
          "etat_avant": "endommage",
          "date_de_sortie": "2025-05-02",
          "site_intervention": "Centre de formation",
          "commentaire": "Endommagé légèrement"
        },
        {
          "id_exemplaire": 10,
          "id_employes": 6,
          "but_usage": "Suivi client",
          "etat_avant": "bon",
          "date_de_sortie": "2025-04-27",
          "site_intervention": "Client Z"
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
  
  getById: async (ids: idSotieOutils): Promise<ExemplaireSortieFormValues> => {
    const { id_exemplaire, id_employes, date_de_sortie } = ids;
    const response = await api.get(`/exemplaire-sorties/${id_exemplaire}/${id_employes}/${encodeURIComponent(String(date_de_sortie))}`);
    return response.data;
  },
  
  create: async (data: ExemplaireSortieFormValues): Promise<ExemplaireSortieFormValues> => {
    const response = await api.post("/exemplaire-sorties", data);
    return response.data;
  },

  update: async (
    ids: idSotieOutils,
    data: Omit<ExemplaireSortieFormValues, "id_exemplaire" | "id_employes" | "date_de_sortie">
  ): Promise<ExemplaireSortieFormValues> => {
    const { id_exemplaire, id_employes, date_de_sortie } = ids;
  
    const response = await api.put(
      `/exemplaire-sorties/${id_exemplaire}/${id_employes}/${encodeURIComponent(String(date_de_sortie))}`,
      data
    );
  
    return response.data;
  },
  
  
  
  delete: async (ids: idSotieOutils): Promise<void> => {
    const { id_exemplaire, id_employes, date_de_sortie } = ids;
    const response = await api.delete(
      `/exemplaire-sorties/${id_exemplaire}/${id_employes}/${encodeURIComponent(String(date_de_sortie))}`,
    );
    return response.data
  }
};