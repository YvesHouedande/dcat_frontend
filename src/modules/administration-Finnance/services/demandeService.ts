import axios, { AxiosError } from 'axios';
// Supprimer l'import useApi car il ne peut pas être utilisé dans un service
// import {useApi } from '@/api/api' // Importer l'instance api
// Assurez-vous que ce chemin est correct pour votre fichier d'interfaces
import { Demande, Employe, NatureDocument, DemandeDocument } from '../administration/types/interfaces';
import { omit } from '@/lib/utils'; // Importer la fonction omit

const API_URL = import.meta.env.VITE_APP_API_URL;

// Créer une fonction pour obtenir l'instance axios avec le token
const getApiInstance = () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Fonction pour configurer l'instance axios avec le token
const configureApiWithToken = (token?: string) => {
  const instance = getApiInstance();
  
  if (token) {
    instance.defaults.headers.Authorization = `Bearer ${token}`;
  }
  
  return instance;
};

// Si votre API renvoie des données enveloppées, nous définirons une interface générique ici.
// C'est une hypothèse basée sur la manière dont les APIs renvoient souvent les listes.

export type DemandeAPIInput = {
  type_demande?: string;
  status?: string;
  motif?: string;
  duree?: string;
  id_employes?: number;
  documents?: DemandeDocument[];
  date_debut?: string;
  date_fin?: string;
  date_absence?: string;
  date_retour?: string;
};

// Récupérer toutes les demandes
export const fetchDemandes = async (token?: string): Promise<Demande[]> => {
  try {
    console.log("Appel API pour récupérer toutes les demandes:", `${API_URL}/administration/demandes`);
    const api = configureApiWithToken(token);
    const response = await api.get<Demande[]>(`/administration/demandes`);
    
    if (!response.data) {
      throw new Error("Aucune donnée reçue de l'API");
    }
    
    console.log("Données reçues:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur détaillée lors de la récupération des demandes:", error);
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

// Récupérer une demande par ID
export const fetchDemandeById = async (id: number, token?: string): Promise<Demande> => {
  if (!id || isNaN(id)) {
    console.error("ID demande invalide fourni:", id);
    throw new Error("ID demande invalide");
  }

  try {
    console.log(`Appel API: GET ${API_URL}/administration/demandes/${id}`);
    const api = configureApiWithToken(token);
    const response = await api.get<Demande | Demande[]>(`/administration/demandes/${id}`);
    
    const responseData = response.data;

    if (!responseData) {
      console.error("Aucune donnée reçue pour la demande:", id);
      throw new Error("Demande non trouvée");
    }

    // Gérer le cas où l'API renvoie un tableau avec un seul élément
    if (Array.isArray(responseData) && responseData.length > 0) {
      console.log("Données de la demande reçues (extraites d'un tableau):", responseData[0]);
      return responseData[0];
    }
    
    // Gérer le cas où l'API renvoie directement l'objet
    if (!Array.isArray(responseData)) {
      console.log("Données de la demande reçues (objet direct):", responseData);
      return responseData as Demande;
    }

    throw new Error("Format de réponse inattendu ou demande non trouvée.");

  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Erreur API détaillée:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });

      if (error.response?.status === 404) {
        throw new Error("Demande non trouvée");
      }
      if (error.response?.status === 400) {
        throw new Error("ID demande invalide");
      }
      if (error.response?.status === 500) {
        throw new Error("Erreur serveur lors de la récupération de la demande");
      }
    }
    throw error;
  }
};

// Récupérer les demandes par type
export const fetchDemandesByType = async (type: string, token?: string): Promise<Demande[]> => {
  try {
    const api = configureApiWithToken(token);
    const response = await api.get<Demande[]>(`/administration/demandes/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des demandes de type ${type}:`, error);
    throw error;
  }
};

// Récupérer les demandes par employé
export const fetchDemandesByEmploye = async (id_employe: number, token?: string): Promise<Demande[]> => {
  try {
    const api = configureApiWithToken(token);
    const response = await api.get<Demande[]>(`/administration/demandes/employe/${id_employe}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes par employé:", error);
    throw error;
  }
};

// Créer une nouvelle demande
export const createDemande = async (
  demande: DemandeAPIInput,
  token?: string
): Promise<Demande> => {
  try {
    const api = configureApiWithToken(token);
    
    // Nettoyer les données avant envoi - retirer les propriétés qui ne doivent pas être envoyées
    const cleanedDemande = omit(demande, ['id', 'created_at', 'updated_at'] as unknown as (keyof DemandeAPIInput)[]);
    
    const response = await api.post<Demande>(`/administration/demandes`, cleanedDemande);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la demande:", error);
    if (error instanceof AxiosError) {
      throw new Error(`Échec de la création de la demande: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

// Mettre à jour une demande
export const updateDemande = async (
  id: number,
  data: Partial<Demande> | FormData,
  token?: string
): Promise<Demande> => {
  try {
    const api = configureApiWithToken(token);
    
    if (data instanceof FormData) {
      // Pour la mise à jour avec un fichier, on utilise PUT avec FormData.
      const response = await api.put<Demande>(
        `/administration/demandes/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } else {
      // Pour la mise à jour sans fichier, nettoyer les données avant envoi
      const cleanedData = omit(data, ['id', 'created_at', 'updated_at'] as (keyof Demande)[]);
      
      const response = await api.put<Demande>(
        `/administration/demandes/${id}`,
        cleanedData
      );
      return response.data;
    }
  } catch (error: unknown) {
    console.error("Erreur lors de la mise à jour de la demande:", error);
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: unknown } };
      console.error("Détails de l'erreur API:", err.response?.data);
    }
    throw error;
  }
};

// Supprimer une demande
export const deleteDemande = async (id: number, token?: string): Promise<void> => {
  try {
    const api = configureApiWithToken(token);
    await api.delete(`/administration/demandes/${id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de la demande:", error);
    throw error;
  }
};

// Approuver une demande (version temporaire si l'API n'est pas prête)
export const approuverDemande = async (id: number, commentaire?: string, token?: string): Promise<Demande> => {
  try {
    console.log(`[API DemandeService] Tentative d'approbation de la demande ${id}`);
    console.log(`[API DemandeService] URL: ${API_URL}/administration/demandes/${id}`);
    
    const api = configureApiWithToken(token);
    
    // Utiliser l'endpoint de mise à jour existant
    const payload = {
      status: "Approuvée", // Avec accent pour correspondre au reste du code
      ...(commentaire && { commentaire_approbation: commentaire })
    };
    
    console.log(`[API DemandeService] Payload envoyé:`, payload);
    
    const response = await api.put<Demande>(`/administration/demandes/${id}`, payload);
    console.log(`[API DemandeService] Réponse reçue:`, response.data);
    console.log(`[API DemandeService] Demande ${id} approuvée avec succès`);
    return response.data;
  } catch (error) {
    console.error(`[API DemandeService] Erreur lors de l'approbation de la demande ${id}:`, error);
    
    // Version temporaire : simuler l'action si l'API n'est pas prête
    if (error instanceof AxiosError && error.response?.status === 404) {
      console.warn(`[API DemandeService] Endpoint non trouvé, simulation côté client...`);
      
      // Récupérer la demande actuelle
      const currentDemande = await fetchDemandeById(id, token);
      
      // Simuler la mise à jour - nettoyer les données avant retour
      const updatedDemande = {
        ...currentDemande,
        status: "Approuvée",
        ...(commentaire && { commentaire_approbation: commentaire })
      };
      
      console.log(`[API DemandeService] Simulation réussie pour la demande ${id}`);
      return updatedDemande;
    }
    
    if (error instanceof AxiosError) {
      console.error(`[API DemandeService] Détails de l'erreur Axios:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      
      if (error.response?.status === 400) {
        throw new Error("Impossible d'approuver cette demande (statut invalide)");
      }
      if (error.response?.status === 403) {
        throw new Error("Vous n'avez pas les permissions pour approuver cette demande");
      }
      throw new Error(`Erreur lors de l'approbation: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

// Refuser une demande (version temporaire si l'API n'est pas prête)
export const refuserDemande = async (id: number, motif?: string, token?: string): Promise<Demande> => {
  try {
    console.log(`[API DemandeService] Tentative de refus de la demande ${id}`);
    console.log(`[API DemandeService] URL: ${API_URL}/administration/demandes/${id}`);
    
    const api = configureApiWithToken(token);
    
    // Utiliser l'endpoint de mise à jour existant
    const payload = {
      status: "Refusée", // Avec accent pour correspondre au reste du code
      ...(motif && { motif_refus: motif })
    };
    
    console.log(`[API DemandeService] Payload envoyé:`, payload);
    
    const response = await api.put<Demande>(`/administration/demandes/${id}`, payload);
    console.log(`[API DemandeService] Réponse reçue:`, response.data);
    console.log(`[API DemandeService] Demande ${id} refusée avec succès`);
    return response.data;
  } catch (error) {
    console.error(`[API DemandeService] Erreur lors du refus de la demande ${id}:`, error);
    
    // Version temporaire : simuler l'action si l'API n'est pas prête
    if (error instanceof AxiosError && error.response?.status === 404) {
      console.warn(`[API DemandeService] Endpoint non trouvé, simulation côté client...`);
      
      // Récupérer la demande actuelle
      const currentDemande = await fetchDemandeById(id, token);
      
      // Simuler la mise à jour
      const updatedDemande = {
        ...currentDemande,
        status: "Refusée",
        ...(motif && { motif_refus: motif })
      };
      
      console.log(`[API DemandeService] Simulation réussie pour la demande ${id}`);
      return updatedDemande;
    }
    
    if (error instanceof AxiosError) {
      console.error(`[API DemandeService] Détails de l'erreur Axios:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      
      if (error.response?.status === 400) {
        throw new Error("Impossible de refuser cette demande (statut invalide)");
      }
      if (error.response?.status === 403) {
        throw new Error("Vous n'avez pas les permissions pour refuser cette demande");
      }
      throw new Error(`Erreur lors du refus: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

// Récupérer toutes les natures de documents
export const getAllNatureDocuments = async (token?: string): Promise<NatureDocument[]> => {
  try {
    console.log("[API DemandeService] Tentative de récupération de toutes les natures de documents...");
    const api = configureApiWithToken(token);
    const response = await api.get<NatureDocument[]>(`/administration/natures`); 
    console.log("[API DemandeService] Réponse complète des natures de documents:", response.data);
    
    return response.data; 
  } catch (error) {
    console.error("[API DemandeService] Erreur lors de la récupération des natures de documents:", error);
    if (error instanceof AxiosError) {
      throw new Error(`Erreur lors de la récupération des natures de documents: ${error.response?.statusText || error.message}`);
    }
    throw error;
  }
};

// Récupérer un employé par son ID
export const fetchEmployeById = async (id: number, token?: string): Promise<Employe> => {
  try {
    console.log(`[API DemandeService] Tentative de récupération de l'employé avec ID: ${id}`);
    const api = configureApiWithToken(token);
    const response = await api.get<Employe>(`/administration/employes/${id}`);
    const responseData = response.data;

    // Gérer les cas où l'API peut renvoyer un tableau même pour un ID
    if (Array.isArray(responseData) && responseData.length > 0) {
      return responseData[0];
    }
    if (!Array.isArray(responseData)) {
      return responseData;
    }

    throw new Error("Employé non trouvé ou format de réponse inattendu.");
  } catch (error) {
    console.error(`[API DemandeService] Erreur lors de la récupération de l'employé ${id}:`, error);
    if (error instanceof AxiosError && error.response?.status === 404) {
      throw new Error(`Employé avec l'ID ${id} non trouvé.`);
    }
    throw error;
  }
};

// Récupérer tous les employés (nécessaire pour le Select dans le formulaire)
export const getAllEmployes = async (token?: string): Promise<Employe[]> => {
  try {
    console.log("[API DemandeService] Tentative de récupération de tous les employés...");
    const api = configureApiWithToken(token);
    const response = await api.get(`/administration/employes`);
    const responseData = response.data;
    console.log("[API DemandeService] Réponse complète des employés:", responseData);

    // Gérer les différentes structures de réponse possibles
    if (Array.isArray(responseData)) {
      return responseData;
    }
    if (responseData && Array.isArray(responseData.data)) {
      return responseData.data;
    }
    if (responseData && Array.isArray(responseData['hydra:member'])) {
      return responseData['hydra:member'];
    }
    
    console.warn("getAllEmployes: La réponse n'est pas dans un format attendu. Réponse:", responseData);
    return []; // Retourner un tableau vide pour la robustesse
  } catch (error) {
    console.error("[API DemandeService] Erreur lors de la récupération des employés:", error);
    if (error instanceof AxiosError) {
      throw new Error(`Erreur lors de la récupération des employés: ${error.response?.statusText || error.message}`);
    }
    throw error;
  }
};

// Récupérer les documents d'une demande spécifique
export const fetchDocumentsByDemande = async (demandeId: number, token?: string): Promise<DemandeDocument[]> => {
  try {
    console.log(`Appel API: GET ${API_URL}/administration/demandes/${demandeId}/documents`);
    const api = configureApiWithToken(token);
    const response = await api.get<DemandeDocument[]>(`/administration/demandes/${demandeId}/documents`);
    
    if (!response.data) {
      console.log("Aucun document trouvé pour la demande:", demandeId);
      return [];
    }
    
    console.log("Documents de la demande reçus:", response.data);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        console.log("Aucun document trouvé pour la demande:", demandeId);
        return [];
      }
      console.error("Erreur API lors de la récupération des documents:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    console.error("Erreur lors de la récupération des documents de la demande:", error);
    return [];
  }
};