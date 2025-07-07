// src/types/index.ts

import { z } from "zod";
import { exemplaireSortieSchema } from "../schemas/exemplaireSortieSchema";

// Types existants
export interface ExemplaireProduit {
  id_exemplaire: number | string;
  num_serie: string;
  prix_exemplaire: string;
  date_entree: string;
  etat_vente: "vendu" | "invendu";
  caracteristiques: string;
  id_livraison: string | number;
  id_produit: string | number;
}

export type ExemplaireSortieFormValues = z.infer<typeof exemplaireSortieSchema>;

// Types pour les options de type de sortie
export const TYPE_ETAT_OPTIONS = ["bon", "endommage"];

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

export interface idSotieOutils {
  id_employes: string | number;
  id_exemplaire: string | number;
  date_de_sortie?: string | number;
  date_de_retour?: string | number;
}
