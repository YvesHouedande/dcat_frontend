// src/types/index.ts
import { ApiDataItem } from "@/modules/stocks/reference/types/referenceTypes";
import { ExemplaireProduit } from "../schemas/ExemplaireProduitSchema";

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

export interface SortieExemplaire {
  type_sortie: "vente directe" | "vente en ligne";
  id_commande: number | string;
  id_exemplaire: number | string;
  id_sortie_exemplaire: number | string;
  date_sortie?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SortieExemplaireResponse extends ApiDataItem {
  exemplaire: ExemplaireProduit;
}
