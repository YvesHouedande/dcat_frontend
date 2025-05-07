export interface MoyenDeTravail {
    id_moyens_de_travail: number;
    denomination: string;
    date_acquisition: string; // format ISO "YYYY-MM-DD"
    section: string;
    created_at: string;
    updated_at: string;
  }
  
  export type MoyenDeTravailFormData = Omit<
    MoyenDeTravail,
    "id_moyens_de_travail" | "created_at" | "updated_at"
  >;
  
  export interface MoyensFilters {
    search?: string;
    section?: string;
    dateStart?: string;
    dateEnd?: string;
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
  