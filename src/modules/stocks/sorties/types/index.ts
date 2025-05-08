// src/types/index.ts

// Types existants
export interface ProductInstance {
    id_exemplaire: number | string;
    num_serie: string;
    prix_exemplaire: string;
    date_entree: string;
    etat_vente: "vendu" | "invendu";
    caracteristiques: string;
    id_livraison: string | number;
    id_produit: string | number;
}
  
  // Nouveau type pour les sorties d'exemplaires
  export interface ExemplaireSortie {
    id_sortie_exemplaire: number;
    type_sortie: string;
    reference_id: string;
    date_sortie: string;
    id_produit: number;
    quantite: number; // Nouveau champ
  }
  
  // Types pour les options de type de sortie
  export const TYPE_SORTIE_OPTIONS = [
    "Vente en ligne",
    "Vente directe",
    "Projet",
    "Intervention"
  ];
  
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