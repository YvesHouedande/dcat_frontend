// src/types/index.ts


  
  export interface Delivery {
    id_livraison: number | string;
    reference: string;
    // Autres propriétés si nécessaire
  }
  
  export interface Product {
    id_produit: number  | string;
    code_produit: string;
    desi_produit: string;
    // Autres propriétés si nécessaire
  }
  
  export interface PaginationParams<TFilter extends Record<string, unknown> = Record<string, unknown>> {
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