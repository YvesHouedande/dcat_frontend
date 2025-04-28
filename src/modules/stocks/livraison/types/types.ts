// types.ts - Définition des types pour notre module
export interface Partenaire {
    id_partenaire: number;
    nom_partenaire: string;
    // Autres propriétés du partenaire
  }
  
  export interface Livraison {
    id_livraison: number;
    frais_divers: string;
    Periode_achat: string;
    prix_achat: string;
    prix_de_revient: string;
    prix_de_vente: string;
    reference: string;
    id_partenaire: number;
  }