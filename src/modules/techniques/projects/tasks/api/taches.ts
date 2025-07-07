// src/api/taches.ts

import axios, { AxiosError } from 'axios';
import { Tache, Employe, CreateTachePayload, UpdateTachePayload, ApiResponse } from '../../types/types'; 

const API_URL = import.meta.env.VITE_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error(
        `Erreur API - Statut: ${error.response.status}`,
        `Données: ${JSON.stringify(error.response.data)}`,
        `URL: ${error.config?.url}`,
        `Méthode: ${error.config?.method}`
      );
    } else if (error.request) {
      console.error(
        `Erreur réseau - Pas de réponse du serveur pour: ${error.config?.url}`,
        `Méthode: ${error.config?.method}`,
        error.message
      );
    } else {
      console.error(`Erreur inattendue lors de la requête: ${error.message}`, error.config);
    }
    
    return Promise.reject(error);
  }
);

export const createTache = async (tacheData: CreateTachePayload): Promise<Tache> => {
  try {
    const response = await apiClient.post(`/technique/taches`, tacheData);
    const apiResponse: ApiResponse<Tache> = response.data;
    
    if (apiResponse && apiResponse.data) {
      return apiResponse.data;
    }
    console.error("L'API n'a pas retourné l'objet Tache attendu après la création:", apiResponse);
    throw new Error("Échec de la création de la tâche: Format de réponse API inattendu.");
  } catch (error) {
    throw error; 
  }
};

export const getTacheById = async (id: number): Promise<Tache | undefined> => {
  try {
    const response = await apiClient.get(`/technique/taches/${id}`);
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return undefined;
    }
    throw error;
  }
};

export const getAllTaches = async (): Promise<Tache[]> => {
  try {
    const response = await axios.get(`${API_URL}/technique/taches`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    throw error;
  }
};

// *** CORRECTION ICI : Changer PATCH en PUT ***
export const updateTache = async (id: number, tacheData: UpdateTachePayload): Promise<Tache> => {
  try {
    console.log(`[updateTache] Tentative de mise à jour. URL: /technique/taches/${id}, Méthode: PUT`);
    
    const response = await apiClient.put(`/technique/taches/${id}`, tacheData); // <--- CHANGEMENT DE .patch À .put

    // Si l'API enveloppe la réponse dans 'data'
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data; // Fallback
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la tâche ${id}:`, error); // Log d'erreur plus spécifique
    throw error; 
  }
};

export const deleteTacheSafely = async (id: number): Promise<void> => {
  try {
    const employes = await getEmployesAssignes(id);
    
    if (employes.length > 0) {
      await Promise.all(
        employes.map(emp => 
          removeEmployeFromTache(id, emp.id_employes)
        )
      );
    }

    await apiClient.delete(`/technique/taches/${id}`);
  } catch (error) {
    throw error; 
  }
};

export const getEmployesAssignes = async (tacheId: number): Promise<Employe[]> => {
  try {
    const response = await apiClient.get(`/technique/taches/${tacheId}/employes`);
    
    const apiResponse: ApiResponse<Employe[]> = response.data;

    if (apiResponse && typeof apiResponse === 'object' && Array.isArray(apiResponse.data)) {
      return apiResponse.data; 
    } else {
      console.warn(`Unexpected API response structure for assigned employees for task ${tacheId}. Received:`, apiResponse);
      return []; 
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Error fetching assigned employees for task ${tacheId}:`, error.response.data);
      if (error.response.status === 404) {
          console.warn(`No assigned employees found for task ${tacheId} (404 response).`);
          return [];
      }
    }
    throw error;
  }
};

export const assignEmployeToTache = async (tacheId: number, employeId: number): Promise<void> => {
  try {
    console.log(`[assignEmployeToTache] Tentative d'assignation. Tâche ID (URL): ${tacheId}, Employé ID (param): ${employeId}, Type: ${typeof employeId}`);
    
    if (typeof tacheId !== 'number' || isNaN(tacheId)) {
        console.error(`[assignEmployeToTache] L'ID de la tâche n'est pas un nombre valide: ${tacheId}`);
        throw new Error("L'ID de la tâche n'est pas valide.");
    }
    if (typeof employeId !== 'number' || isNaN(employeId)) {
        console.error(`[assignEmployeToTache] L'ID de l'employé n'est pas un nombre valide: ${employeId}`);
        throw new Error("L'ID de l'employé n'est pas valide.");
    }

    const payload = {
        id_employes: employeId 
    };

    console.log(`[assignEmployeToTache] Envoi du payload:`, payload);

    await apiClient.post(`/technique/taches/${tacheId}/employes`, payload);
  } catch (error) {
    throw error; 
  }
};

export const removeEmployeFromTache = async (tacheId: number, employeId: number): Promise<void> => {
  try {
    await apiClient.delete(`/technique/taches/${tacheId}/employes/${employeId}`);
  } catch (error) {
    throw error; 
  }
};

export const getTachesByProjet = async (projetId: number): Promise<ApiResponse<Tache[]>> => {
  try {
    const response = await apiClient.get(`/technique/taches/projet/${projetId}`);
    return response.data;
  } catch (error) {
    throw error; 
  }
};