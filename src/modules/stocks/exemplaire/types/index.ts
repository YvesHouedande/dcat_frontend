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

export interface PaginationParams<
  TFilter extends Record<string, unknown> = Record<string, unknown>
> {
  page: number;
  limit: number;
  search?: string;
  filter?: TFilter;
}

export interface PaginatedResponse<ExemplaireProduit> {
  data: ExemplaireProduit[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
