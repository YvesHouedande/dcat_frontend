// src/hooks/useExemplaireSorties.ts
import { useState, useCallback } from "react";
import { ExemplaireSortie, PaginationParams, PaginatedResponse } from "../types";
import { exemplaireSortieService } from "../services/exemplaireSortie.service";

export const useExemplaireSorties = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [exemplaireSorties, setExemplaireSorties] = useState<ExemplaireSortie[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<ExemplaireSortie>, "data">>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });

  const fetchExemplaireSorties = useCallback(async (params: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await exemplaireSortieService.getAll(params);
      setExemplaireSorties(response.data);
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

  const createExemplaireSortie = useCallback(async (data: Omit<ExemplaireSortie, "id_sortie_exemplaire">) => {
    setLoading(true);
    setError(null);
    try {
      const newSortie = await exemplaireSortieService.create(data);
      return newSortie;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erreur lors de la création"));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExemplaireSortie = useCallback(async (id: number, data: Omit<ExemplaireSortie, "id_sortie_exemplaire">) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSortie = await exemplaireSortieService.update(id, data);
      return updatedSortie;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erreur lors de la mise à jour"));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExemplaireSortie = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await exemplaireSortieService.delete(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erreur lors de la suppression"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    exemplaireSorties,
    pagination,
    loading,
    error,
    fetchExemplaireSorties,
    createExemplaireSortie,
    updateExemplaireSortie,
    deleteExemplaireSortie,
  };
};