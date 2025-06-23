export interface SelectedReferences {
  id_marque: number;
  id_modele: number;
  id_categorie: number;
  id_famille: number;
  id_type_produit: number;
}

export interface ImageType {
  id_image?: number;
  libelle_image: string;
  lien_image: string;
  numero_image: number;
  url?: string;
  file?: File;
  preview?: string;
}