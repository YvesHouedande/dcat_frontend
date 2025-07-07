// / src/services/productService.ts
import { useApi } from "@/api/api";
import {
  ApiResponse,
  ProductFilters,
  ProductServiceResponse,
} from "@/modules/stocks/reference/types/referenceTypes";
import { ReferenceProduit } from "@/modules/stocks/types/reference";

// transformation des données pour l'API
const transformData = (values: ReferenceProduit) => {
  {
    const formData = new FormData();
    formData.append("code_produit", values.code_produit ?? "");
    formData.append("desi_produit", values.desi_produit);
    formData.append("desc_produit", values.desc_produit ?? "");
    formData.append("emplacement_produit", values.emplacement_produit);
    formData.append("id_categorie", values.id_categorie.toString());
    formData.append("id_famille", values.id_famille.toString());
    formData.append("id_marque", values.id_marque.toString());
    formData.append("id_modele", values.id_modele.toString());
    formData.append("id_type_produit", values.id_type_produit.toString());
    if (values.imagesMeta !== undefined) {
      formData.append("imagesMeta", values.imagesMeta);
    } else {
      formData.append("imagesMeta", "");
    }
    // Pour chaque image
    values.images?.forEach((img) => {
      if (img.file) {
        formData.append("images", img.file); // ⚠️ clé "images" multiple pour plusieurs fichiers
      }
    });
    return formData;
  }
};
export const useOutilsService = () => {
  const apis = useApi();
  const getAll = async (
    page: number,
    limit: number,
    filters: ProductFilters
  ): Promise<ProductServiceResponse> => {
    const params = { page, limit, ...filters, typeId: 2 }; // Ajoutez d'autres filtres si nécessaire
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
    produit: ReferenceProduit
  ): Promise<ReferenceProduit> => {
    const formData = transformData(produit);
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

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteProduct,
  };
};
