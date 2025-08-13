import axios from "axios";
import { ApiResponse, Operation, Tache } from "../../types/types";
import { deleteTacheSafely } from "../../tasks/api/taches";

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
    console.log(`[API] Suppression de l'opération ${id} avec ses tâches...`);
    
    // 1. Récupérer toutes les tâches de l'opération
    const tachesResponse = await getTachesByOperation(id);
    const taches = tachesResponse.data || [];
    console.log(`[API] ${taches.length} tâche(s) trouvée(s) pour l'opération ${id}`);
    
    // 2. Supprimer toutes les tâches de l'opération
    if (taches.length > 0) {
      console.log(`[API] Suppression des ${taches.length} tâche(s)...`);
      await Promise.all(
        taches.map(async (tache) => {
          try {
            // Utiliser deleteTacheSafely qui gère déjà les employés assignés
            await deleteTacheSafely(tache.id_tache);
            console.log(`[API] ✓ Tâche ${tache.id_tache} supprimée`);
          } catch (error) {
            console.error(`[API] Erreur lors de la suppression de la tâche ${tache.id_tache}:`, error);
            throw error;
          }
        })
      );
      console.log(`[API] ✓ Toutes les tâches supprimées`);
    }
    
    // 3. Maintenant supprimer l'opération
    console.log(`[API] Suppression de l'opération ${id}...`);
    const response = await axios.delete(`${API_URL}/technique/operations/${id}`);
    const apiResponse = response.data;
    
    if (!apiResponse.success) {
      throw new Error(
        apiResponse.message || "Erreur lors de la suppression de l'opération"
      );
    }
    
    const result = {
      success: true,
      message: taches.length > 0 
        ? `Opération et ${taches.length} tâche(s) supprimée(s) avec succès`
        : apiResponse.message || "Opération supprimée avec succès"
    };
    console.log(`[API] ✓ Opération ${id} supprimée avec succès.`);
    return result;
  } catch (error: unknown) {
    console.error(`[API] Erreur lors de la suppression de l'opération ${id}:`, error);
    if (axios.isAxiosError(error) && (error.response?.status === 409 || error.response?.data?.message?.includes('foreign key'))) {
      return {
        success: false,
        message: "Cette opération ne peut pas être supprimée pour le moment. Veuillez d'abord le dissocier de toutes les entités qui lui sont liées."
      };
    }
    return {
      success: false,
      message: (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error as Error)?.message || "Une erreur inattendue est survenue lors de la suppression de l'opération."
    };
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