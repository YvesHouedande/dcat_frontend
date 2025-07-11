// src/types/index.ts

export interface ExemplaireProduit {
  id_exemplaire: number | string;
  num_serie: string;
  prix_exemplaire: string;
  date_entree: string;
  etat_vente: "vendu" | "invendu" | "bon" | "endommage";
  commentaire: string;
  id_livraison: string | number;
  id_produit: string | number;
}

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

export interface PaginationParams<
  TFilter extends Record<string, unknown> = Record<string, unknown>
> {
  page: number;
  pageSize: number;
  search?: string;
  filter?: TFilter;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
