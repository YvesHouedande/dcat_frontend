import { useApi } from "@/api/api";
import {
  PaginatedResponse,
  PaginationParams,
  SortieExemplaire,
  SortieExemplaireResponse,
} from "../types";

export const useSortieExemplaireService = () => {
  const api = useApi();
  const faireSortieExemplaire = async (
    data: Partial<SortieExemplaire>
  ): Promise<SortieExemplaire> => {
    return await api.post(`/stocks/sorties-exemplaires`, data);
  };

  const getSortieExemplaire = async (
    params: PaginationParams
  ): Promise<PaginatedResponse<SortieExemplaire>> => {
    return await api.get(`/stocks/sorties-exemplaires`, { params });
  };

  const getSortieExemplaireById = async (
    id: string
  ): Promise<SortieExemplaire> => {
    return await api.get(`/stocks/sorties-exemplaires/${id}`);
  };

  const updateSortieExemplaire = async (
    id: string,
    data: Partial<SortieExemplaire>
  ): Promise<SortieExemplaire> => {
    return await api.put(`/stocks/sorties-exemplaires/${id}`, data);
  };

  const deleteSortieExemplaire = async (id: string): Promise<void> => {
    return await api.delete(`/stocks/sorties-exemplaires/${id}`);
  };

  const ExemplaireSortieCommande = async (
    id: string
  ): Promise<SortieExemplaireResponse[]> => {
    const response = await api.get(
      `/stocks/sorties-exemplaires/Commandes/${id} `
    );
    
    return response.data;
  };

  return {
    faireSortieExemplaire,
    getSortieExemplaire,
    getSortieExemplaireById,
    updateSortieExemplaire,
    deleteSortieExemplaire,
    ExemplaireSortieCommande,
  };
};

export default useSortieExemplaireService;
