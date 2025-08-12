import axios from "axios";
import { ApiResponse, Operation, Tache } from "../../types/types";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const getAllOperations = async (page = 1, limit = 10): Promise<ApiResponse<Operation[]>> => {
  const response = await axios.get(`${API_URL}/technique/operations`, {
    params: { page, limit },
  });
  return response.data;
};

export const createOperation = async (payload: Omit<Operation, "id_operation">): Promise<Operation> => {
  const response = await axios.post(`${API_URL}/technique/operations`, payload);
  return response.data.data;
};

export const getOperationById = async (id: number): Promise<Operation> => {
  const response = await axios.get(`${API_URL}/technique/operations/${id}`);
  return response.data.data;
};

export const updateOperation = async (id: number, payload: Partial<Omit<Operation, "id_operation">>): Promise<Operation> => {
  const response = await axios.put(`${API_URL}/technique/operations/${id}`, payload);
  return response.data.data;
};

export const deleteOperation = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.delete(`${API_URL}/technique/operations/${id}`);
    return response.data;
  } catch (error: unknown) {
    // Si l'erreur est liée à des contraintes de clés étrangères (tâches liées)
    if (axios.isAxiosError(error) && (error.response?.status === 409 || error.response?.data?.message?.includes('foreign key'))) {
      return {
        success: false,
        message: "Cette opération ne peut pas être supprimée pour le moment. Veuillez d'abord supprimer toutes les tâches liées à cette opération."
      };
    }
    // Pour les autres erreurs, on propage l'erreur originale
    throw error;
  }
};

export const getTachesByOperation = async (id_operation: number): Promise<ApiResponse<Tache[]>> => {
  const response = await axios.get(`${API_URL}/technique/operations/${id_operation}/taches`);
  return response.data;
};

export const getOperationsByProjet = async (id_projet: number, page?: number, limit?: number): Promise<ApiResponse<Operation[]>> => {
  const params: Record<string, string | number> = {};
  if (page !== undefined) params.page = page;
  if (limit !== undefined) params.limit = limit;
  const response = await axios.get(`${API_URL}/technique/operations/projet/${id_projet}`, Object.keys(params).length ? { params } : undefined);
  return response.data;
};

// Fonction simple pour supprimer une opération (sans confirmation)
export const deleteOperationSimple = async (
  operationId: number
): Promise<{ success: boolean; message: string }> => {
  return await deleteOperation(operationId);
}; 