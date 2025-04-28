// src/hooks/useProductInstances.ts
import { useState, useCallback } from "react";
import { ProductInstance, PaginationParams, PaginatedResponse } from "../types";
import { productInstanceService } from "../services/productInstance.service";

export const useProductInstances = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [productInstances, setProductInstances] = useState<ProductInstance[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<ProductInstance>, "data">>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });

  const fetchProductInstances = useCallback(async (params: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productInstanceService.getAll(params);
      setProductInstances(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Une erreur s'est produite"));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProductInstance = useCallback(async (data: Omit<ProductInstance, "id_exemplaire" | "prix_exemplaire">) => {
    setLoading(true);
    setError(null);
    try {
      const newInstance = await productInstanceService.create(data);
      return newInstance;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erreur lors de la création"));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProductInstance = useCallback(async (id: string |number, data: Omit<ProductInstance, "prix_exemplaire">) => {
    setLoading(true);
    setError(null);
    try {
      const updatedInstance = await productInstanceService.update(id, data);
      return updatedInstance;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erreur lors de la mise à jour"));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProductInstance = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      await productInstanceService.delete(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erreur lors de la suppression"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    productInstances,
    pagination,
    loading,
    error,
    fetchProductInstances,
    createProductInstance,
    updateProductInstance,
    deleteProductInstance,
  };
};