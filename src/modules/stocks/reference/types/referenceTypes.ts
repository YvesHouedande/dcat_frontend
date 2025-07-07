import { ReferenceProduit, ImageProduit, categorieTypes, marqueTypes, familleTypes, modeleTypes, typeTypes } from "../../types/reference"; // Importez Image ici aussi


// Définissez une interface pour la structure complète de la réponse API


export interface ApiResponse {
  data: ApiDataItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Définissez ce que la fonction getAll va réellement retourner
export interface ProductServiceResponse {
  data: ReferenceProduit[]; // Le tableau des produits aplati
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
export interface SelectedReferences {
  id_marque: number;
  id_modele: number;
  id_categorie: number;
  id_famille: number;
  id_type_produit: number;
}



interface ApiDataItem {
  produit: ReferenceProduit;
  category: categorieTypes;
  modele: modeleTypes;
  famille: familleTypes;
  marque: marqueTypes;
  images: ImageProduit[]; // C'est ici que les images sont directement disponibles dans la réponse de l'API
  type:typeTypes ; // Ajoutez le type_produit ici
}
export interface ProductFilters {
  searchTerm?: string;
  categoryFilter?: string;
  modelFilter?: string;
  brandFilter?: string;
  familyFilter?: string;
  productTypeFilter?: string;
}