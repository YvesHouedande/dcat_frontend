// src/services/productService.ts

import { useApi } from "@/api/api";
import { ReferenceProduit } from "../../types/reference"; // Importez Image ici aussi
import {
  ApiResponse,
  ProductFilters,
  ProductServiceResponse,
} from "../types/referenceTypes";

// transformation des données pour l'API
const transformData = (values: Partial<ReferenceProduit>): FormData => {
  const formData = new FormData();

  // Fonction utilitaire typée
  const appendIfDefined = <K extends keyof ReferenceProduit>(
    key: K,
    value: ReferenceProduit[K] | undefined
  ) => {
    if (value !== undefined && value !== null) {
      // On gère les nombres et objets pour éviter les erreurs
      if (typeof value === "number") {
        formData.append(key, value.toString());
      } else if (typeof value === "object" && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string | Blob);
      }
    }
  };

  appendIfDefined("code_produit", values.code_produit);
  appendIfDefined("desi_produit", values.desi_produit);
  appendIfDefined("desc_produit", values.desc_produit);
  appendIfDefined("emplacement_produit", values.emplacement_produit);
  appendIfDefined("id_categorie", values.id_categorie);
  appendIfDefined("id_famille", values.id_famille);
  appendIfDefined("id_marque", values.id_marque);
  appendIfDefined("id_modele", values.id_modele);
  appendIfDefined("id_type_produit", values.id_type_produit);
  appendIfDefined("caracteristiques_produit", values.caracteristiques_produit);
  appendIfDefined("prix_produit", values.prix_produit);

  if (values.imagesMeta !== undefined) {
    appendIfDefined("imagesMeta", values.imagesMeta);
  }

  // Gestion des images (fichiers)
  values.images?.forEach((img) => {
    if (img.file) {
      formData.append("images", img.file);
    }
  });

  return formData;
};

export const useProductService = () => {
  const apis = useApi();
  const getAll = async (
    page: number,
    limit: number,
    filters: ProductFilters
  ): Promise<ProductServiceResponse> => {
    const params = { page, limit, ...filters, typeId: filters.typeId ?? 1 }; // Ajoutez d'autres filtres si nécessaire
    // const response = await apis.get<ApiResponse>(`stocks/produits?page=${page}&limit=${limit}`);
    const response = await apis.get<ApiResponse>(`stocks/produits?`, {
      params,
    });

    const apiResponse = response.data;

    // Extrayez uniquement l'objet 'produit' et ajoutez la liste 'images'
    const produits: ReferenceProduit[] = apiResponse.data.map((item) => ({
      ...item.produit, // Copie toutes les propriétés de l'objet produit
      images: item.images, // Ajoute le tableau 'images' directement
      type_produit: item.type.libelle,
      famille: item.famille.libelle_famille,
      categorie: item.category.libelle,
      marque: item.marque.libelle_marque,
      modele: item.modele.libelle_modele,
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
    // la réponse de getById n'a la même structure complète avec 'produit' et 'images',
    // donc on doit l'adapter ici aussi
    // On suppose que la réponse a la même structure que dans getAll

    return {
      ...response.data.produit,
      images: response.data.images,
      type_produit: response.data.type.libelle,
      categorie: response.data.category.libelle,
      modele: response.data.modele.libelle_modele,
      famille: response.data.famille.libelle_famille,
      marque: response.data.marque.libelle_marque,
    };
  };

  // ... (create, update, delete)
  const create = async (
    produit: ReferenceProduit
  ): Promise<ReferenceProduit> => {
    const formData = transformData(produit);
    const response = await apis.post("stocks/produits", formData);
    return response.data;
  };

  // Mettre à jour un produit
  const update = async (
    produit: Partial<ReferenceProduit>
  ): Promise<ReferenceProduit> => {
    const formData = transformData(produit as ReferenceProduit);
    // Note: Assurez-vous que l'ID du produit est bien défini dans l'objet produit
    const response = await apis.put(
      `stocks/produits/${produit.id_produit}`,
      formData
    );
    return {
      ...response.data, // Conserver les autres propriétés du produit
      images: response.data.images, // Mettre à jour les images depuis la réponse
      id_produit: produit.id_produit, // Assurez-vous que l'ID est correct
    };
  };

  // Supprimer un produit
  const deleteProduct = async (id: string | number): Promise<void> => {
    await apis.delete(`stocks/produits/${id}`);
  };

  const deleteImageProduct = async (id: string | number): Promise<void> => {
    await apis.delete(`stocks/produits/image/${id}`);
  };

  const uppdateImageProduct = async ({
    images,
    libelles,
    numeros,
    id_produit,
  }: {
    images: File[];
    libelles: string[];
    numeros: number[];
    id_produit: string | number | undefined;
  }): Promise<void> => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images`, image);
      formData.append(`libelles`, libelles[index]);
      formData.append(`numeros`, numeros[index].toString());
    });
    await apis.post(`stocks/produits/images/add/${id_produit}`, formData);
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteProduct,
    deleteImage: deleteImageProduct,
    updateImage: uppdateImageProduct,
  };
};
