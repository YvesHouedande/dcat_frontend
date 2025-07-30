import { Entite } from '../administration/types/interfaces';
import { useCallback } from 'react';
import { useApi } from '@/api/api';

export const useEntiteApi = () => {
  const api = useApi();

  // Récupérer toutes les entités
  const fetchEntites = useCallback(async (): Promise<Entite[]> => {
    const response = await api.get<Entite[]>('/administration/entites');
    return response.data;
  }, [api]);

  // Récupérer une entité par ID
  const fetchEntiteById = useCallback(async (id: string | number): Promise<Entite> => {
    const response = await api.get<Entite>(`/administration/entites/${id}`);
    return response.data;
  }, [api]);

  // Créer une nouvelle entité
  const addEntite = useCallback(async (entite: {
    denomination: string;
    abreviation_nom?: string;
    contact?: string;
    adresse_postal?: string;
    localisation?: string;
    id_partenaire?: number;
  }): Promise<Entite> => {
    const response = await api.post<Entite>('/administration/entites', entite);
    return response.data;
  }, [api]);

  // Mettre à jour une entité
  const updateEntite = useCallback(async (
    id: string | number,
    entite: {
      denomination?: string;
      abreviation_nom?: string;
      contact?: string;
      adresse_postal?: string;
      localisation?: string;
      id_partenaire?: number;
    }
  ): Promise<Entite> => {
    const response = await api.put<Entite>(`/administration/entites/${id}`, entite);
    return response.data;
  }, [api]);

  // Supprimer une entité
  const deleteEntite = useCallback(async (id: number): Promise<void> => {
    const response = await api.delete(`/administration/entites/${id}`);
    return response.data;
  }, [api]);

  // Récupérer les entités d'un partenaire
  const fetchEntitesByPartenaire = useCallback(async (id_partenaire: number): Promise<Entite[]> => {
    const response = await api.get<Entite[]>(`/administration/entites/partenaire/${id_partenaire}`);
    return response.data;
  }, [api]);

  return {
    fetchEntites,
    fetchEntiteById,
    addEntite,
    updateEntite,
    deleteEntite,
    fetchEntitesByPartenaire,
  };
};
