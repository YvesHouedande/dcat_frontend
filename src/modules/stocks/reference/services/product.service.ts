// src/services/productService.ts

import { api } from "@/api/api";
import { ReferenceProduit, ImageProduit, categorieTypes, marqueTypes, familleTypes, modeleTypes, typeTypes } from "../../types/reference"; // Importez Image ici aussi

// Définissez une interface pour la structure complète de la réponse API
interface ApiDataItem {
  produit: ReferenceProduit;
  category: categorieTypes;
  modele: modeleTypes;
  famille: familleTypes;
  marque: marqueTypes;
  images: ImageProduit[]; // C'est ici que les images sont directement disponibles dans la réponse de l'API
  type:typeTypes ; // Ajoutez le type_produit ici
}

interface ApiResponse {
  data: ApiDataItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Définissez ce que la fonction getAll va réellement retourner
interface ProductServiceResponse {
  data: ReferenceProduit[]; // Le tableau des produits aplati
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export const useProductService = () => {
  const apis = api();

  const getAll = async (page: number = 1, limit: number = 12): Promise<ProductServiceResponse> => {
    const response = await apis.get<ApiResponse>(`stocks/produits?page=${page}&limit=${limit}`);

    const apiResponse = response.data;

    // Extrayez uniquement l'objet 'produit' et ajoutez la liste 'images'
    const produits: ReferenceProduit[] = apiResponse.data.map(item => ({
      ...item.produit, // Copie toutes les propriétés de l'objet produit
      image_produit: item.images, // Ajoute le tableau 'images' directement
      type_produit: item.type.libelle,
    }));

    return {
      data: produits,
      currentPage: apiResponse.pagination.page,
      totalPages: apiResponse.pagination.totalPages,
      totalItems: apiResponse.pagination.total,
    };
  };

  // Le reste des fonctions (getById, create, update, delete) reste inchangé
  // ...
  const getById = async (id: string | number): Promise<ReferenceProduit> => {
    const response = await apis.get(`stocks/produits/${id}`);
    // Si la réponse de getById a la même structure complète avec 'produit' et 'images',
    // vous devrez adapter cette ligne aussi :
    return { ...response.data.produit, image_produit: response.data.images, 
      type_produit: response.data.type.libelle ,
      categorie: response.data.category.libelle,
      modele: response.data.modele.libelle_modele,
      famille: response.data.famille.libelle_famille,
      marque: response.data.marque.libelle_marque,};
  };

  // ... (create, update, delete)
  const create = async (produit: ReferenceProduit): Promise<ReferenceProduit> => {
    const response = await apis.post("stocks/produits", produit);
    return response.data;
  };

  // Mettre à jour un produit
  const update = async (produit: ReferenceProduit): Promise<ReferenceProduit> => {
    const response = await apis.put(`stocks/produits/${produit.id_produit}`, produit);
    return response.data;
  };

  // Supprimer un produit
  const deleteProduct = async (id: string | number): Promise<void> => {
    await apis.delete(`stocks/produits/${id}`);
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteProduct
  };
};