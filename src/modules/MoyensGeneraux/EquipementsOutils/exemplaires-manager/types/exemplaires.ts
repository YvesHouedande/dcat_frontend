export interface Exemplaire {
  id_exemplaire: string;
  num_serie: string;
  prix_exemplaire: string;
  etat_disponible_indisponible_: 'disponible' | 'indisponible';
  Id_Commande: string | null;
  id_livraison: string | null;
  id_produit: string;
  Code_produit: string;
  selected?: boolean; // Ajout pour la sélection
}
  
  export interface Produit {
    id_produit: string;
    Code_produit: string;
    desi_produit: string;
  }
  
  export interface Commande {
    Id_Commande: string;
    date_commande: string;
    client: string;
  }
  
  export interface Livraison {
    id_livraison: string;
    date_livraison: string;
  }