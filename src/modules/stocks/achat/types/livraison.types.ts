// types/livraison.types.ts

export interface Livraison {
    id_livraison: string;
    frais_divers: string;
    Periode_achat: string;
    prix_achat: string;
    Prix_de_revient: string;
    Prix_de_vente: string;
    Id_partenaire: string;
  }
  
  export interface Partenaire {
    id: string;
    nom_partenaire: string;
  }