// src/hooks/useProducts.ts

import { useOutilsService } from "../services/product.service";
import { ReferenceProduit } from "@/modules/stocks/types/reference";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { ProduiLimit } from "@/modules/stocks/exemplaire/types/const";

// Hook unique pour toutes les opérations CRUD sur les produits

export const useProducts = (filters = {}, productId?: string | number) => {
  const queryClient = useQueryClient();
  const productService = useOutilsService();

  const products = useInfiniteQuery({
    queryKey: ["products", filters], // Ajout des filtres ici
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

  // 🔍 Récupérer un produit par ID
  const product = useQuery({
    queryKey: ["product", String(productId)],
    // queryFn: () => productService.getById(productId!),
    queryFn: () => productService.getById(productId!),
    enabled: !!productId,
    retry: false, // empêche de retenter après une 404
  });

  // ➕ Créer un nouveau produit
  const create = useMutation({
    mutationFn: (newProduct: ReferenceProduit) =>
      productService.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // ✏️ Mettre à jour un produit
  const update = useMutation({
    mutationFn: (updatedProduct: ReferenceProduit) => {
      return productService.update(updatedProduct);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["product", String(data.id_produit)],
      });
    },
  });

  // ❌ Supprimer un produit
  const remove = useMutation({
    mutationFn: async (id: string) => await productService.delete(id),
    onSuccess: (_data, id) => {
      // ✅ Met à jour manuellement la liste paginée
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // ❌ Supprimer la query du produit pour éviter un GET après suppression
      queryClient.removeQueries({ queryKey: ["product", id] });
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
    product: {
      data: product.data,
      isLoading: product.isLoading,
      error: product.error,
      refetch: product.refetch,
    },
    create: {
      mutates: create.mutate,
      ...create,
    },
    update: {
      mutates: update.mutate,
      ...update,
    },
    delete: {
      mutates: remove.mutate,
      ...remove,
    },
  };
};
