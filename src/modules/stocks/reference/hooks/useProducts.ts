// src/hooks/useProducts.ts

import { useProductService } from '../services/product.service';
import { ReferenceProduit } from '../../types/reference';

import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';

// Hook unique pour toutes les opérations CRUD sur les produits
export const useProducts = (productId?: string | number) => {
  const queryClient = useQueryClient();
  const productService = useProductService();
  // Récupérer tous les produits
   const products = useInfiniteQuery(
    ['products'],
    ({ pageParam = 1 }) => productService.getAll(pageParam, 15), // Passer la page et la limite
    {
      getNextPageParam: (lastPage) => {
        // lastPage est l'objet ProductServiceResponse retourné par getAll
        const nextPage = lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
        return nextPage;
      },
      staleTime: 15 * 60 * 1000, // 15 minutes
      // initialPageParam is not valid here in array syntax
    }
  );

  // Récupérer un produit par son ID
  const product = useQuery({
    queryKey: ['products', productId],
    queryFn: () => productService.getById(productId || ''),
    enabled: !!productId, // Désactiver la requête si l'ID n'est pas défini
  });

  // Créer un nouveau produit
  const create = useMutation({
    mutationFn: (newProduct: ReferenceProduit) => productService.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Mettre à jour un produit
  const update = useMutation({
    mutationFn: (updatedProduct: ReferenceProduit) => productService.update(updatedProduct),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', data.id_produit] });
    },
  });

  // Supprimer un produit
  const remove = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.removeQueries({ queryKey: ['products', id] });
    },
  });

  // Retourner toutes les opérations dans un seul objet
  return {
    // Queries
    
    fetchNextPage: products.fetchNextPage,
    hasNextPage: products.hasNextPage,
    isFetchingNextPage: products.isFetchingNextPage,
     products: {
      data: products.data, // Contient les pages flatten
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
    
    // Mutations
    create: {
      mutateAsync: create.mutateAsync,
      isLoading: create.isLoading,
      isSuccess: create.isSuccess,
      isError: create.isError,
      error: create.error,
      reset: create.reset,
    },
    update: {
      mutateAsync: update.mutateAsync,
      isLoading: update.isLoading,
      isSuccess: update.isSuccess,
      isError: update.isError,
      error: update.error,
      reset: update.reset,
    },
    delete: {
      mutateAsync: remove.mutateAsync,
      isLoading: remove.isLoading,
      isSuccess: remove.isSuccess,
      isError: remove.isError,
      error: remove.error,
      reset: remove.reset,
    }
  };
};