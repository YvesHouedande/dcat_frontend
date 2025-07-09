import axios, { AxiosError } from 'axios';
import { Fonction } from '../administration/types/interfaces';

const API_URL = import.meta.env.VITE_APP_API_URL;


// Récupérer toutes les fonctions
export const fetchFonctions = async (): Promise<Fonction[]> => {
  try {
    console.log("Appel API pour récupérer toutes les fonctions:", `${API_URL}/administration/fonctions`);
    const response = await axios.get(`${API_URL}/administration/fonctions`);
    
    if (!response.data) {
      throw new Error("Aucune donnée reçue de l'API");
    }
    
    console.log("Données reçues:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur détaillée lors de la récupération des fonctions:", error);
    if (error instanceof AxiosError) {
      console.error("Détails de l'erreur Axios:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
    }
    throw error;
  }
};

// Récupérer une fonction par ID
export const fetchFonctionById = async (id: number): Promise<Fonction> => {
  if (!id || isNaN(id)) {
    console.error("ID fonction invalide fourni:", id);
    throw new Error("ID fonction invalide");
  }

  try {
    console.log(`Appel API: GET ${API_URL}/administration/fonctions/${id}`);
    const response = await axios.get(`${API_URL}/administration/fonctions/${id}`);
    
    if (!response.data) {
      console.error("Aucune donnée reçue pour la fonction:", id);
      throw new Error("Fonction non trouvée");
    }

    // Validation des données reçues
    if (!response.data.id_fonction || !response.data.nom_fonction) {
      console.error("Données de fonction invalides reçues:", response.data);
      throw new Error("Données de la fonction invalides ou incomplètes");
    }

    console.log("Données de la fonction reçues:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Erreur API détaillée:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });

      if (error.response?.status === 404) {
        throw new Error("Fonction non trouvée");
      }
      if (error.response?.status === 400) {
        throw new Error("ID fonction invalide");
      }
      if (error.response?.status === 500) {
        throw new Error("Erreur serveur lors de la récupération de la fonction");
      }
    }
    throw error;
  }
};

// Créer une nouvelle fonction
export const createFonction = async (fonctionData: Omit<Fonction, 'id_fonction'>): Promise<Fonction> => {
  try {
    const response = await axios.post(`${API_URL}/administration/fonctions`, fonctionData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la fonction:", error);
    throw error;
  }
};

// Mettre à jour une fonction
export const updateFonction = async (id: number, fonctionData: Partial<Fonction>): Promise<Fonction> => {
  try {
    const response = await axios.put(`${API_URL}/administration/fonctions/${id}`, fonctionData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la fonction:", error);
    throw error;
  }
};

// Supprimer une fonction
export const deleteFonction = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/administration/fonctions/${id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de la fonction:", error);
    throw error;
  }
}; 