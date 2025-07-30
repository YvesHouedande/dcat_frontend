import { DemandeDocument } from "../../administration/types/interfaces";

export interface DossierType {
  id_dossier: string | number;
  libelle_dossier: string;
  type_dossier: string;
  created_at?: string;
  updated_at?: string;
}

export interface DossierResponse {
  data: DossierType[];
  total: number;
  page: number;
  limit: number;
}

export interface DocumentDosierResponse {
  dossier: DossierType;
  documents: {
    data: DemandeDocument[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  libelle_document?: string;
  type_dossier?: string;
  libelle_dossier?: string;
}
