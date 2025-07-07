import axios from 'axios';
import { Famille } from '../../types/types'; // Assurez-vous que le chemin est correct

const API_URL = import.meta.env.VITE_APP_API_URL;
export const getFamilles = async (): Promise<Famille[]> => {
  try {
    const response = await axios.get(`${API_URL}/stocks/familles`);
    // L'API semble retourner un objet avec une propriété 'data' qui est le tableau
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des familles :", error);
    throw error;
  }
};