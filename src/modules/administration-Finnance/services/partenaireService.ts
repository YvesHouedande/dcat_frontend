import axios from 'axios';
import { Interlocuteur, Partenaires } from '../administration/types/interfaces';


const API_URL = import.meta.env.VITE_APP_API_URL;

// Services des partenaires
export const fetchPartners = async () => {
  try {
    const response = await axios.get(`${API_URL}/administration/partenaires`);
    return response.data;
  } catch (error) {
    console.error("Erreur de recherche de partenaires:", error);
    throw error;
  }
};

export const fetchPartnerById = async (id: string | undefined) => {
  try {
    const response = await axios.get(`${API_URL}/administration/partenaires/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur de recherche de partenaires par ID:", error);
    throw error;
  }
};

export const addPartner = async (partnerData: Partenaires) => {
  try {
    const response = await axios.post(`${API_URL}/administration/partenaires`, partnerData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors d'ajout d'un partenaire:", error);
    throw error;
  }
};

export const updatePartner = async (id: string | number, partnerData: Partenaires) => {
  try {
    const response = await axios.put(`${API_URL}/administration/partenaires/${id}`, partnerData);
    return response.data;
  } catch (error) {
    console.error("Erreur de mise à jour du partenaire:", error);
    throw error;
  }
};

export const deletePartner = async (id: string | number) => {
  try {
    const response = await axios.delete(`${API_URL}/administration/partenaires/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur de suppression du partenaire:", error);
    throw error;
  }
};

// Services pour les interlocuteurs
export const fetchInterlocuteurs = async (partnerId: string | number) => {
  try {
    const response = await axios.get(`${API_URL}/administration/partenaires/${partnerId}/interlocuteurs`);
    return response.data;
  } catch (error) {
    console.error("Erreur de récupération des interlocuteurs:", error);
    throw error;
  }
};

export const addInterlocuteur = async (partnerId: string | number, interlocuteurData: Omit<Interlocuteur, 'id_interlocuteur'>) => {
  try {
    const response = await axios.post(`${API_URL}/administration/partenaires/${partnerId}/interlocuteurs`, interlocuteurData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un interlocuteur:", error);
    throw error;
  }
};

export const updateInterlocuteur = async (
  partnerId: string | number,
  interlocuteurId: string | number,
  interlocuteurData: Partial<Interlocuteur>
) => {
  try {
    const response = await axios.put(
      `${API_URL}/administration/partenaires/${partnerId}/interlocuteurs/${interlocuteurId}`,
      interlocuteurData
    );
    return response.data;
  } catch (error) {
    console.error("Erreur de mise à jour d'un interlocuteur:", error);
    throw error;
  }
};

export const deleteInterlocuteur = async (partnerId: string | number, interlocuteurId: string | number) => {
  try {
    const response = await axios.delete(`${API_URL}/administration/partenaires/${partnerId}/interlocuteurs/${interlocuteurId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur de suppression d'un interlocuteur:", error);
    throw error;
  }
};

// Services pour les entités
export const fetchEntites = async () => {
  try {
    const response = await axios.get(`${API_URL}/administration/entites`);
    // alert(JSON.stringify(response.data[0], null, 2));
    return response.data;
  } catch (error) {
    console.error("Erreur de récupération des entités:", error);
    throw error;
  }
};

export const fetchEntiteById = async (id: string | number) => {
  try {
    const response = await axios.get(`${API_URL}/administration/entites/${id}`);
    
    return response.data;
  } catch (error) {
    console.error("Erreur de récupération d'une entité:", error);
    throw error;
  }
};

export const addEntite = async (entiteData: { denomination: string }) => {
  try {
    
    const response = await axios.post(`${API_URL}/administration/entites`, entiteData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une entité:", error);
    throw error;
  }
};

export const updateEntite = async (id: string | number, entiteData: { nom: string }) => {
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
    const response = await fetch(`${API_URL}/administration/entites/${id}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Échec de la suppression');
    }
  } catch (error) {
    console.error('Error deleting entite:', error);
    throw error;
  }
};
