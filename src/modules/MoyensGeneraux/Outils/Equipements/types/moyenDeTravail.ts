// Types
// src/types/moyenDeTravail.ts
export interface MoyenDeTravail {
    id_moyens_de_travail: number;
    denomination: string;
    date_acquisition: string;
    section: string;
    created_at: string;
    updated_at: string;
  }
  
  export type MoyenDeTravailCreateInput = Omit<MoyenDeTravail, 'id_moyens_de_travail' | 'created_at' | 'updated_at'>;
  export type MoyenDeTravailUpdateInput = Partial<MoyenDeTravailCreateInput>;
  