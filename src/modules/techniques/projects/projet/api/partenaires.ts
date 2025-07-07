import axios from 'axios';
import { Partenaire } from '../../types/types';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const getPartenaires = async (): Promise<Partenaire[]> => {
    try {
        const response = await axios.get(`${API_URL}/administration/partenaires`);

        // *** CHANGEMENT ICI ***
        // Si la réponse est directement un tableau, il suffit de le retourner.
        const partenairesList = response.data;

        if (Array.isArray(partenairesList)) {
            console.log("[API] Partenaires récupérés :", partenairesList);
            return partenairesList; // Retourne directement le tableau des partenaires
        } else {
            // Si jamais l'API renvoie quelque chose d'inattendu (pas un tableau)
            console.warn("La réponse de l'API pour les partenaires n'est pas un tableau valide.", response.data);
            return [];
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des partenaires :", error);
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || `Erreur serveur (${error.response?.status})`;
            throw new Error(errorMessage);
        }
        throw error;
    }
};