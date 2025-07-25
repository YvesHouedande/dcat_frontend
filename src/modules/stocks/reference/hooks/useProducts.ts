import { useProductService } from "../services/product.service";
import { ReferenceProduit } from "../../types/reference";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { ProduiLimit } from "../../exemplaire/types/const";

const PRODUIT_KEY = "produits";
export const useProducts = (filters = {}) => {
  const productService = useProductService();

  const products = useInfiniteQuery({
    queryKey: [PRODUIT_KEY, filters], // Ajout des filtres ici
    queryFn: ({ pageParam = 1 }) =>
      productService.getAll(pageParam, ProduiLimit, filters), // ⚠️ Doit être adapté dans le service
    staleTime: 15 * 60 * 1000,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.currentPage;
      const totalPages = lastPage.totalPages;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined; // Plus de pages à charger
    },
  });

  // ✅ Retourne toutes les opérations
  return {
    fetchNextPage: products.fetchNextPage,
    hasNextPage: products.hasNextPage,
    isFetchingNextPage: products.isFetchingNextPage,

    products: {
      data: products.data,
      isLoading: products.isLoading,
      error: products.error,
      refetch: products.refetch,
    },
  };
};

// 🔍 Récupérer un produit par ID
export const useProduct = (productId?: string | number) => {
  const productService = useProductService();
  const product = useQuery({
    queryKey: [PRODUIT_KEY, String(productId)],
    queryFn: () => productService.getById(productId!),
    enabled: !!productId,
    retry: false, // empêche de retenter après une 404
  });
  return {
    product: {
      data: product.data,
      isLoading: product.isLoading,
      error: product.error,
      refetch: product.refetch,
    },
  };
};

// ➕ Créer un nouveau produit
export const useCreateProduct = () => {
  const productService = useProductService();
  const queryClient = useQueryClient();
  const create = useMutation({
    mutationFn: (newProduct: ReferenceProduit) =>
      productService.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUIT_KEY] });
    },
  });
  return {
    create: {
      mutates: create.mutate,
      ...create,
    },
  };
};

/**
 * Supprime un produit par son ID
 *
 * @returns Un objet avec les propriétés :
 *   - `mutates`: la fonction de mutation pour supprimer un produit
 *   - `isLoading`: un booléen indiquant si la mutation est en cours
 *   - `error`: l'erreur levée par la mutation si elle a échoué
 *   - `data`: le résultat de la mutation si elle a réussi
 */
export const useDeleteProduct = () => {
  const productService = useProductService();
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUIT_KEY] });
    },
  });
  return {
    delete: {
      mutates: remove.mutate,
      ...remove,
    },
  };
};

/**
 * Met à jour un produit existant
 *
 * @returns Un objet avec les propriétés :
 *   - `mutates`: la fonction de mutation pour mettre à jour un produit
 *   - `isLoading`: un booléen indiquant si la mutation est en cours
 *   - `error`: l'erreur levée par la mutation si elle a échoué
 *   - `data`: le résultat de la mutation si elle a réussi
 */
export const useUpadteProduct = () => {
  const productService = useProductService();
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: (updatedProduct: ReferenceProduit) =>
      productService.update(updatedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUIT_KEY] });
    },
  });
  return {
    update: {
      mutates: update.mutate,
      ...update,
    },
  };
};

export const useDeleteImageProduct = () => {
  const productService = useProductService();
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: (id: number) => productService.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUIT_KEY] });
    },
  });
  return {
    deleteImage: {
      mutates: remove.mutate,
      ...remove,
    },
  };
};

export const useUpdateImageProdcut = () => {
  const productService = useProductService();
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: ({
      images,
      libelles,
      numeros,
    }: {
      images: File[];
      libelles: string[];
      numeros: number[];
    }) =>
      productService.updateImage({
        images,
        libelles,
        numeros,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUIT_KEY] });
    },
  });
  return {
    updateImage: {
      mutates: update.mutate,
      ...update,
    },
  };
};
