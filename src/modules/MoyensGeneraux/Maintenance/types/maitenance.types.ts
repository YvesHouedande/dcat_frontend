export interface Maintenance {
  id_maintenance : number|string;
  recurrence:string;
  type_maintenance:string;
  operations:string;
  recommandations:string;
  autre_intervenant?:string | undefined;
  id_intervenants?:string | number;
  id_partenaire?:string | number;
  id_section:string | number;
  id_exemplaire_produit:string | number;
  date:string;
}

  export type MaintenanceFormData = Omit<
    Maintenance,
    "id_maintenance"
  >;

  
  export interface MoyensFilters {
    search?: string;
    section?: string;
    dateStart?: string;
    dateEnd?: string;
    type_maintenance?:string;
    page: number;
    limit: number;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  