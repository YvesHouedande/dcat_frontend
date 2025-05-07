// Hooks avec TanStack Query
// src/hooks/useMoyensDeTravail.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moyenDeTravailService } from '../services/moyenDeTravailService';
import { MoyenDeTravail, MoyenDeTravailCreateInput, MoyenDeTravailUpdateInput } from '../types/moyenDeTravail';

export const useMoyensDeTravail = () => {
  const queryClient = useQueryClient();

  const moyensQuery = useQuery<MoyenDeTravail[], Error>({
    queryKey: ['moyensDeTravail'],
    queryFn: () => moyenDeTravailService.getAll(),
    staleTime: 15 * 60 * 1000, // 15 minutes (optional)
  });

  const getMoyenDeTravailQuery = (id: number) => useQuery<MoyenDeTravail, Error>({
    queryKey: ['moyenDeTravail', id],
    queryFn: () => moyenDeTravailService.getById(id),
    enabled: !!id,
  });

  const createMutation = useMutation({
    mutationFn: (data: MoyenDeTravailCreateInput) => moyenDeTravailService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moyensDeTravail'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: MoyenDeTravailUpdateInput }) => 
      moyenDeTravailService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['moyensDeTravail'] });
      queryClient.invalidateQueries({ queryKey: ['moyenDeTravail', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => moyenDeTravailService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moyensDeTravail'] });
    },
  });

  return {
    moyensQuery,
    getMoyenDeTravailQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};