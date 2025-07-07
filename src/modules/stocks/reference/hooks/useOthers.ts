import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categorieTypes, familleTypes, marqueTypes, modeleTypes, typeTypes } from "../../types/reference";
import {
  useProductMarquesService,
  useProductCategoriesService,
  useProductFamiliesService,
  useProductModelsService,
} from "../services/othertype.service";
import { useProductTypeService } from "../services/othertype.service";

export const useProductMarques = (marqueId?: string | number) => {
  const productBrands = useProductMarquesService();
  const queryClient = useQueryClient();
  const fetchProductBrands = useQuery<marqueTypes[], Error>({
    queryKey: ["productBrands"],
    queryFn: () => productBrands.getAll(),
    staleTime: 60 * 60 * 1000, // 60 minutes (optional)
  });

  // Récupérer une par son ID
  const productBrand = useQuery({
    queryKey: ["productBrands", marqueId],
    queryFn: () => productBrands.getById(marqueId || ""),
    enabled: !!marqueId, // Désactiver la requête si l'ID n'est pas défini
  });

  // Créer un nouveau produit
  const create = useMutation({
    mutationFn: (newMarque: Omit<marqueTypes, "id_marque">) => productBrands.create(newMarque),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productBrands"] });
    },
  });

  // Mettre à jour un produit
  const update = useMutation({
    mutationFn: (updatedMarque: marqueTypes) => productBrands.update(updatedMarque.id_marque, updatedMarque),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["productBrands"] });
      queryClient.invalidateQueries({ queryKey: ["productBrands", data.id_marque] });
    },
  });

  // Supprimer un produit
  const remove = useMutation({
    mutationFn: (id: string) => productBrands.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["productBrands"] });
      queryClient.removeQueries({ queryKey: ["productBrands", id] });
    },
  });

  return {
    productMarques: {
      data: fetchProductBrands.data || [],
      isLoading: fetchProductBrands.isLoading,
      error: fetchProductBrands.error,
      refetch: fetchProductBrands.refetch,
      create: create,
      update: update,
      remove: remove,
    },
    productMarque: {
      data: productBrand.data,
      isLoading: productBrand.isLoading,
      error: productBrand.error,
      refetch: productBrand.refetch,
    },
  };
};

export const useProductCategories = (categorieId?: string | number) => {
  const productCategories = useProductCategoriesService();
  const queryClient = useQueryClient();

  const fetchProductCategories = useQuery<categorieTypes[], Error>({
    queryKey: ["productCategories"],
    queryFn: () => productCategories.getAll(),
    staleTime: 60 * 60 * 1000,
  });

  const productCategory = useQuery({
    queryKey: ["productCategories", categorieId],
    queryFn: () => productCategories.getById(categorieId || ""),
    enabled: !!categorieId,
  });

  const create = useMutation({
    mutationFn: (newCategorie: Omit<categorieTypes, "id_categorie">) => productCategories.create(newCategorie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productCategories"] });
    },
  });

  const update = useMutation({
    mutationFn: (updatedCategorie: categorieTypes) =>
      productCategories.update(updatedCategorie.id_categorie, updatedCategorie),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["productCategories"] });
      queryClient.invalidateQueries({ queryKey: ["productCategories", data.id_categorie] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => productCategories.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["productCategories"] });
      queryClient.removeQueries({ queryKey: ["productCategories", id] });
    },
  });

  return {
    productCategories: {
      data: fetchProductCategories.data || [],
      isLoading: fetchProductCategories.isLoading,
      error: fetchProductCategories.error,
      refetch: fetchProductCategories.refetch,
      create:create,
      update:update,
      remove:remove,
    },
    productCategory: {
      data: productCategory.data,
      isLoading: productCategory.isLoading,
      error: productCategory.error,
      refetch: productCategory.refetch,
    },
  };
};

export const useProductFamilies = (familleId?: string | number) => {
  const productFamilies = useProductFamiliesService();
  const queryClient = useQueryClient();

  const fetchProductFamilies = useQuery<familleTypes[], Error>({
    queryKey: ["productFamilies"],
    queryFn: () => productFamilies.getAll(),
    staleTime: 60 * 60 * 1000,
  });

  const productFamily = useQuery({
    queryKey: ["productFamilies", familleId],
    queryFn: () => productFamilies.getById(familleId || ""),
    enabled: !!familleId,
  });

  const create = useMutation({
    mutationFn: (newFamille: Omit<familleTypes, "id_famille">) => productFamilies.create(newFamille),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productFamilies"] });
    },
  });

  const update = useMutation({
    mutationFn: (updatedFamille: familleTypes) =>
      productFamilies.update(updatedFamille.id_famille, updatedFamille),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["productFamilies"] });
      queryClient.invalidateQueries({ queryKey: ["productFamilies", data.id_famille] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => productFamilies.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["productFamilies"] });
      queryClient.removeQueries({ queryKey: ["productFamilies", id] });
    },
  });

  return {
    productFamilies: {
      data: fetchProductFamilies.data || [],
      isLoading: fetchProductFamilies.isLoading,
      error: fetchProductFamilies.error,
      refetch: fetchProductFamilies.refetch,
      create: create,
      update: update,
      remove: remove,
    },
   
    productFamily: {
      data: productFamily.data,
      isLoading: productFamily.isLoading,
      error: productFamily.error,
      refetch: productFamily.refetch,
    },
  };
};

export const useProductModels = (modeleId?: string | number) => {
  const productModels = useProductModelsService();
  const queryClient = useQueryClient();

  const fetchProductModels = useQuery<modeleTypes[], Error>({
    queryKey: ["productModels"],
    queryFn: () => productModels.getAll(),
    staleTime: 60 * 60 * 1000,
  });

  const productModel = useQuery({
    queryKey: ["productModels", modeleId],
    queryFn: () => productModels.getById(modeleId || ""),
    enabled: !!modeleId,
  });

  const create = useMutation({
    mutationFn: (newModele: Omit<modeleTypes, "id_modele">) => productModels.create(newModele),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productModels"] });
    },
  });

  const update = useMutation({
    mutationFn: (updatedModele: modeleTypes) =>
      productModels.update(updatedModele.id_modele, updatedModele),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["productModels"] });
      queryClient.invalidateQueries({ queryKey: ["productModels", data.id_modele] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => productModels.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["productModels"] });
      queryClient.removeQueries({ queryKey: ["productModels", id] });
    },
  });

  return {
    productModels: {
      data: fetchProductModels.data || [],
      isLoading: fetchProductModels.isLoading,
      error: fetchProductModels.error,
      refetch: fetchProductModels.refetch,
      create: create,
      update: update,
      remove: remove,
    },
    
    productModel: {
      data: productModel.data,
      isLoading: productModel.isLoading,
      error: productModel.error,
      refetch: productModel.refetch,
    },
  };
};
export const useProductTypes = (typeId?: string | number) => {
  const productTypes = useProductTypeService();
  const queryClient = useQueryClient();

  const fetchproductTypes = useQuery<typeTypes[], Error>({
    queryKey: ["productTypes"],
    queryFn: () => productTypes.getAll(),
    staleTime: 60 * 60 * 1000,
  });

  const productModel = useQuery({
    queryKey: ["productTypes",typeId],
    queryFn: () => productTypes.getById(typeId || ""),
    enabled: !!typeId, // Désactiver la requête si l'ID n'est pas défini
  });

  const create = useMutation({
    mutationFn: (newModele: Omit<typeTypes, "id_type_produit">) => productTypes.create(newModele),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productTypes"] });
    },
  });

  const update = useMutation({
    mutationFn: (updatedType: typeTypes) =>
      productTypes.update(updatedType.id_type_produit, updatedType),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["productTypes"] });
      queryClient.invalidateQueries({ queryKey: ["productTypes", data.id_type_produit] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => productTypes.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["productTypes"] });
      queryClient.removeQueries({ queryKey: ["productTypes", id] });
    },
  });

  return {
    productTypes: {
      data: fetchproductTypes.data || [],
      isLoading: fetchproductTypes.isLoading,
      error: fetchproductTypes.error,
      refetch: fetchproductTypes.refetch,
      create: create,
      update: update,
      remove: remove,
    },
    
    productModel: {
      data: productModel.data,
      isLoading: productModel.isLoading,
      error: productModel.error,
      refetch: productModel.refetch,
    },
  };
};


