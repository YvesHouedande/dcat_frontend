import axios from 'axios';
import { DemandeDocument, NatureDocument } from '../administration/types/interfaces';


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

// Récupérer tous les documents
export const getAllDocuments = async (token?: string): Promise<DemandeDocument[]> => {
  try {
    const api = configureApiWithToken(token);
    const response = await api.get("/documents");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    throw error;
  }
};

// Récupérer tous les types de documents (natures)
export const getAllNatureDocuments = async (token?: string): Promise<NatureDocument[]> => {
  try {
    const api = configureApiWithToken(token);
    const response = await api.get("/administration/natures/");
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des types de documents:", error);
    throw error;
  }
};

// Récupérer un document par ID
export const getDocumentById = async (id: number, token?: string): Promise<DemandeDocument> => {
  try {
    const api = configureApiWithToken(token);
    const response = await api.get(`/administration/documents/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du document:", error);
    throw error;
  }
};

// Créer un nouveau document
export const createDocument = async (documentData: Partial<DemandeDocument> | FormData, token?: string): Promise<DemandeDocument> => {
  try {
    const api = configureApiWithToken(token);
    const response = await api.post(
      "/administration/documents/ajouter",
      documentData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du document:", error);
    throw error;
  }
};

// Mettre à jour un document
export const updateDocument = async (
  id: number,
  documentData: Partial<DemandeDocument> & { document?: File | null },
  token?: string
): Promise<DemandeDocument> => {
  try {
    const api = configureApiWithToken(token);
    const formData = new FormData();
    // Ajoute tous les champs texte
    Object.entries(documentData).forEach(([key, value]) => {
      if (key === 'document' && value instanceof File) {
        formData.append('document', value);
      } else if (value !== undefined && value !== null && key !== 'document') {
        formData.append(key, String(value));
      }
    });
    const response = await api.put(
      `/administration/documents/modifier/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du document:', error);
    throw error;
  }
};

// Supprimer un document
export const deleteDocument = async (id: number, token?: string): Promise<void> => {
  try {
    const api = configureApiWithToken(token);
    await api.delete(`/administration/documents/supprimer/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression du document:', error);
    throw error;
  }
};

// Récupérer les documents par nature (finance ou comptabilité)
export const getDocumentsByNature = async (natureId: number, token?: string): Promise<DemandeDocument[]> => {
  try {
    const api = configureApiWithToken(token);
    const response = await api.get(`/administration/documents/nature/${natureId}`);
    const responseData = response.data;
    // Gérer les différentes structures de réponse possibles pour toujours retourner un tableau
    if (Array.isArray(responseData)) {
      return responseData;
    }
    if (responseData && Array.isArray(responseData.data)) {
      return responseData.data;
    }
    // Si la réponse n'est ni un tableau, ni un objet avec un tableau dans .data
    console.warn("getDocumentsByNature: La réponse n'est pas dans un format attendu. Réponse:", responseData);
    return []; // Retourner un tableau vide pour éviter les erreurs
  } catch (error) {
    console.error("Erreur lors de la récupération des documents par nature:", error);
    throw error;
  }
};

// Rechercher des documents
export const searchDocuments = async (query: string, token?: string): Promise<DemandeDocument[]> => {
  try {
    const api = configureApiWithToken(token);
    const response = await api.get(`/administration/documents/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la recherche de documents:", error);
    throw error;
  }
};