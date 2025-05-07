// src/hooks/useProducts.ts

import { productService } from '../services/product.service';
import { ReferenceProduit } from '../../types/reference';

import { 
  useQuery, 
  useMutation, 
  useQueryClient,
} from '@tanstack/react-query';

// Hook unique pour toutes les opérations CRUD sur les produits
export const useProducts = (productId?: string | number) => {
  const queryClient = useQueryClient();

  // Récupérer tous les produits
  const products = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
    staleTime: 15 * 60 * 1000, // 5 minutes (optional)
  });

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
    
    // Mutations
    create: {
      mutate: create.mutate,
      isLoading: create.isLoading,
      isSuccess: create.isSuccess,
      isError: create.isError,
      error: create.error,
      reset: create.reset,
    },
    update: {
      mutate: update.mutate,
      isLoading: update.isLoading,
      isSuccess: update.isSuccess,
      isError: update.isError,
      error: update.error,
      reset: update.reset,
    },
    delete: {
      mutate: remove.mutate,
      isLoading: remove.isLoading,
      isSuccess: remove.isSuccess,
      isError: remove.isError,
      error: remove.error,
      reset: remove.reset,
    }
  };
};