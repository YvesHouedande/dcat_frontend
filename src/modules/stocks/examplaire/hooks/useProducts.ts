// src/hooks/useProducts.ts
import { useState, useCallback, useEffect } from "react";
import { Product } from "../types";
import { productService } from "../services/product.service";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erreur lors du chargement des produits"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, fetchProducts };
};