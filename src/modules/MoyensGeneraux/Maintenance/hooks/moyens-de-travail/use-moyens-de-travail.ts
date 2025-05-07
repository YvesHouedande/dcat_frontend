import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MoyensDesTravailService } from "../../services/moyens-de-travail.service";
import { MoyensFilters, MoyenDeTravailFormData } from "../../types/moyens-de-travail.types";

const defaultFilters: MoyensFilters = {
  page: 1,
  limit: 10,
};

export function useMoyensDeTravail() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<MoyensFilters>(defaultFilters);

  // Récupération des moyens de travail avec pagination et filtres
  const {
    data: moyensResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["moyens-de-travail", filters],
    queryFn: () => MoyensDesTravailService.getAll(filters),
    keepPreviousData: true,
  });

  // Récupération des sections pour les filtres
  const { data: sections = [] } = useQuery({
    queryKey: ["moyens-de-travail-sections"],
    queryFn: () => MoyensDesTravailService.getSections(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation pour créer un moyen de travail
  const createMutation = useMutation({
    mutationFn: (moyenDeTravail: MoyenDeTravailFormData) => 
      MoyensDesTravailService.create(moyenDeTravail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moyens-de-travail"] });
    }
  });

  // Mutation pour mettre à jour un moyen de travail
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: MoyenDeTravailFormData }) => 
      MoyensDesTravailService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moyens-de-travail"] });
    }
  });

  // Mutation pour supprimer un moyen de travail
  const deleteMutation = useMutation({
    mutationFn: (id: number) => MoyensDesTravailService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moyens-de-travail"] });
    }
  });

  // Mise à jour des filtres
  const updateFilters = (newFilters: Partial<MoyensFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Réinitialiser la page à 1 si les filtres changent (sauf si on change de page)
      page: 'page' in newFilters ? newFilters.page! : 1,
    }));
  };

  return {
    moyens: moyensResponse?.data || [],
    pagination: moyensResponse ? {
      total: moyensResponse.total,
      page: moyensResponse.page,
      limit: moyensResponse.limit,
      totalPages: moyensResponse.totalPages,
    } : { total: 0, page: 1, limit: 10, totalPages: 0 },
    filters,
    updateFilters,
    sections,
    isLoading,
    isError,
    error,
    createMoyen: createMutation.mutate,
    updateMoyen: updateMutation.mutate,
    deleteMoyen: deleteMutation.mutate,
    isSubmitting: createMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading,
  };
}
