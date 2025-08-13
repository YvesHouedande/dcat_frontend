// src/types/index.ts

export interface Delivery {
  id_livraison: number | string;
  reference: string;
  // Autres propriétés si nécessaire
}

export interface Product {
  id_produit: number | string;
  code_produit: string;
  desi_produit: string;
  // Autres propriétés si nécessaire
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number; // Doit être cohérent partout (ex: 10)
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SortieExemplaire {
  type_sortie: "vente directe" | "vente en ligne";
  id_commande: number | string;
  id_exemplaire: number | string;
  id_sortie_exemplaire: number | string;
  date_sortie?: string;
  created_at?: string;
  updated_at?: string;
}