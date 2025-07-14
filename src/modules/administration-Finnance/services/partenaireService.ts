import axios from 'axios';
// import { Interlocuteur, Partenaires, Entite, Projet } from '../administration/types/interfaces';
import { Interlocuteur, Partenaires, Entite} from '../administration/types/interfaces';

const API_URL = import.meta.env.VITE_APP_API_URL;

// Services des partenaires
export const fetchPartners = async (): Promise<Partenaires[]> => {
  try {
    // Récupérer tous les partenaires
    const response = await axios.get(`${API_URL}/administration/partenaires`);
    const partenaires = response.data;

    // Pour chaque partenaire, récupérer ses interlocuteurs
    const partenairesWithInterlocuteurs = await Promise.all(
      partenaires.map(async (partenaire: Partenaires) => {
        try {
          const interlocuteursResponse = await axios.get(
            `${API_URL}/administration/interlocuteurs/partenaire/${partenaire.id_partenaire}`
          );
          return {
            ...partenaire,
            interlocuteurs: interlocuteursResponse.data
          };
        } catch (error) {
          console.error(`Erreur lors de la récupération des interlocuteurs pour le partenaire ${partenaire.id_partenaire}:`, error);
          return {
            ...partenaire,
            interlocuteurs: []
          };
        }
      })
    );

    return partenairesWithInterlocuteurs;
  } catch (error) {
    console.error("Erreur de recherche de partenaires:", error);
    throw error;
  }
};

export const fetchPartnerById = async (id: string | number): Promise<Partenaires> => {
  try {
    const response = await axios.get(`${API_URL}/administration/partenaires/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur de recherche de partenaires par ID:", error);
    throw error;
  }
};

export const addPartner = async (partnerData: Omit<Partenaires, 'id_partenaire'>): Promise<Partenaires> => {
  try {
    const response = await axios.post(`${API_URL}/administration/partenaires`, partnerData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors d'ajout d'un partenaire:", error);
    throw error;
  }
};

export const updatePartner = async (id: string | number, partnerData: Partial<Partenaires>): Promise<Partenaires> => {
  try {
    console.log('Données envoyées pour la mise à jour du partenaire:', {
      id,
      data: partnerData
    });
    const response = await axios.put(`${API_URL}/administration/partenaires/${id}`, partnerData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erreur détaillée lors de la mise à jour du partenaire:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    }
    throw error;
  }
};

export const deletePartner = async (id: string | number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/administration/partenaires/${id}`);
  } catch (error) {
    console.error("Erreur de suppression du partenaire:", error);
    throw error;
  }
};

// Services pour les interlocuteurs
export const fetchInterlocuteursByPartenaire = async (id_partenaire: number): Promise<Interlocuteur[]> => {
  try {
    const response = await axios.get(`${API_URL}/administration/interlocuteurs/partenaire/${id_partenaire}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des interlocuteurs:', error);
    throw error;
  }
};

export const addInterlocuteur = async (interlocuteur: Omit<Interlocuteur, 'id_interlocuteur'>): Promise<Interlocuteur> => {
  try {
    // Formatage des données selon la structure attendue par l'API
    const formattedData = {
      nom_interlocuteur: interlocuteur.nom_interlocuteur,
      prenom_interlocuteur: interlocuteur.prenom_interlocuteur,
      contact_interlocuteur: interlocuteur.contact_interlocuteur,
      email_interlocuteur: interlocuteur.email_interlocuteur,
      fonction_interlocuteur: interlocuteur.fonction_interlocuteur,
      id_partenaire: interlocuteur.id_partenaire
    };

    console.log('Données formatées pour l\'ajout de l\'interlocuteur:', formattedData);

    const response = await axios.post(`${API_URL}/administration/interlocuteurs`, formattedData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erreur détaillée lors de l\'ajout de l\'interlocuteur:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    }
    throw error;
  }
};

export const updateInterlocuteur = async (id: number, interlocuteur: Partial<Interlocuteur>): Promise<Interlocuteur> => {
  try {
    // Formatage des données selon la structure attendue par l'API
    const formattedData = {
      nom_interlocuteur: interlocuteur.nom_interlocuteur,
      prenom_interlocuteur: interlocuteur.prenom_interlocuteur,
      contact_interlocuteur: interlocuteur.contact_interlocuteur,
      email_interlocuteur: interlocuteur.email_interlocuteur,
      fonction_interlocuteur: interlocuteur.fonction_interlocuteur,
      id_partenaire: interlocuteur.id_partenaire
    };

    console.log('Données formatées pour la mise à jour de l\'interlocuteur:', {
      id,
      data: formattedData
    });

    const response = await axios.put(`${API_URL}/administration/interlocuteurs/${id}`, formattedData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erreur détaillée lors de la mise à jour de l\'interlocuteur:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: `${API_URL}/administration/interlocuteurs/${id}`
      });
    }
    throw error;
  }
};

export const deleteInterlocuteur = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/administration/interlocuteurs/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'interlocuteur:', error);
    throw error;
  }
};

export const fetchInterlocuteurById = async (id: number): Promise<Interlocuteur> => {
  try {
    const response = await axios.get(`${API_URL}/administration/interlocuteurs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'interlocuteur:', error);
    throw error;
  }
};

export const addMultipleInterlocuteurs = async (
  interlocuteurs: Omit<Interlocuteur, 'id_interlocuteur' | 'id_partenaire'>[],
  id_partenaire: number
): Promise<Interlocuteur[]> => {
  try {
    console.log('Tentative d\'ajout multiple d\'interlocuteurs:', {
      nombre: interlocuteurs.length,
      id_partenaire,
      interlocuteurs
    });

    const responses = await Promise.all(
      interlocuteurs.map(interlocuteur => {
        // Formatage des données pour chaque interlocuteur
        const formattedData = {
          nom_interlocuteur: interlocuteur.nom_interlocuteur,
          prenom_interlocuteur: interlocuteur.prenom_interlocuteur,
          contact_interlocuteur: interlocuteur.contact_interlocuteur,
          email_interlocuteur: interlocuteur.email_interlocuteur,
          fonction_interlocuteur: interlocuteur.fonction_interlocuteur,
          id_partenaire
        };

        return axios.post(`${API_URL}/administration/interlocuteurs`, formattedData);
      })
    );
    return responses.map(response => response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erreur détaillée lors de l\'ajout multiple des interlocuteurs:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    }
    throw error;
  }
};

// Services pour les entités
export const fetchEntites = async (): Promise<Entite[]> => {
  try {
    const response = await axios.get(`${API_URL}/administration/entites`);
    return response.data;
  } catch (error) {
    console.error("Erreur de récupération des entités:", error);
    throw error;
  }
};

export const fetchEntiteById = async (id: string | number): Promise<Entite> => {
  try {
    const response = await axios.get(`${API_URL}/administration/entites/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur de récupération d'une entité:", error);
    throw error;
  }
};

export const addEntite = async (entiteData: { denomination: string }): Promise<Entite> => {
  try {
    const response = await axios.post(`${API_URL}/administration/entites`, entiteData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une entité:", error);
    throw error;
  }
};

export const updateEntite = async (id: string | number, entiteData: { denomination: string }): Promise<Entite> => {
  try {
    const response = await axios.put(`${API_URL}/administration/entites/${id}`, entiteData);
    return response.data;
  } catch (error) {
    console.error("Erreur de mise à jour d'une entité:", error);
    throw error;
  }
};

export const deleteEntite = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/administration/entites/${id}`);
  } catch (error) {
    console.error('Erreur de suppression de l\'entité:', error);
    throw error;
  }
};

// Services pour les projets
// export const fetchProjetsByPartenaire = async (id_partenaire: number): Promise<Projet[]> => {
//   try {
//     const response = await axios.get(`${API_URL}/administration/projets/partenaire/${id_partenaire}`);
//     return response.data;
//   } catch (error) {
//     console.error('Erreur lors de la récupération des projets:', error);
//     // Si l'endpoint n'existe pas (404) ou autre erreur, retourner un tableau vide
//     // pour ne pas bloquer l'affichage du reste du profil
//     return [];
//   }
// };

// Type pour la réponse d'une intervention liée à un partenaire
export interface TypeInterventionPartenaire {
  intervention: {
    id_intervention: number;
    date_intervention: string;
    cause_defaillance: string;
    rapport_intervention: string;
    type_intervention: string;
    type_defaillance: string;
    id_partenaire: number;
    id_contrat: number;
  };
  partenaire: {
    id_partenaire: number;
    nom_partenaire: string;
  };
  contrat: {
    id_contrat: number;
    nom_contrat: string;
    duree_contrat: string;
    date_debut: string;
    date_fin: string;
    reference: string;
    type_de_contrat: string;
    statut: string;
  };
  employes: Array<{
    id_employes: number;
    nom_employes: string;
    prenom_employes: string;
  }>;
}

// Récupérer toutes les interventions d'un partenaire
export const fetchInterventionsByPartenaire = async (id_partenaire: number): Promise<TypeInterventionPartenaire[]> => {
  try {
    const response = await axios.get(`${API_URL}/technique/interventions/partenaire/${id_partenaire}`);
    // On suppose que la réponse est de la forme { success, message, data: [...] }
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des interventions du partenaire:", error);
    throw error;
  }
};