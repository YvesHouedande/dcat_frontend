// This file contains the TypeScript interface for the ReferenceProduit object.
// It defines the structure of the object, including its properties and their types.

  export interface ReferenceProduit {
    id_produit: string | number;
    Code_produit: string;
    desi_produit: string;
    desc_produit: string;
    image_produit: string;
    qte_produit: number;
    emplacement: string;
    caracteristiques: string;
    categorie: string;
    type_produit: string;
    modele: string;
    famille: string;
    marque: string;
  }

  export interface produitTypes{ id: number; libelle_produit: string; };
  export interface categorieTypes{ id: number; libelle_categorie: string; };
  export interface marqueTypes{ id: number; libelle_marque: string; };
  export interface modeleTypes{ id: number; libelle_modele: string; };
  export interface familleTypes{ id: number; libelle_famille: string; };

  