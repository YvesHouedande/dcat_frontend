export interface OutilEntreeType {
  id_exemplaire: string | number;
  num_serie: string;
  date_entree: string;
  id_produi: string;
  nom_produit: number;
  etat_exemplaire: string;
  image_produit: ImageProduitType;
  id_produit: number;
  fournisseur: FournisseurType;
  date_sortie_outil: string;
  date_retour_outil: string;
}

export interface FournisseurType {
  nom: string;
  telephone: string;
  email: string;
  specialite: string | null;
  localisation: string | null;
  type: string;
  statut: string | null;
}

export interface ImageProduitType {
  libelle: string;
  lien_image: string;
  numero_image: number;
  url: string;
}
