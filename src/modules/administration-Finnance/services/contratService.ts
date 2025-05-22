import axios from 'axios';
import { Contrat, Document } from '../../administration-Finnance/administration/types/interfaces';

const API_URL = import.meta.env.VITE_APP_API_URL;

// Services pour les contrats
export const fetchContrats = async () => {
  try {
    const response = await axios.get(`${API_URL}/administration/contrats`);
    return response.data;
  } catch (error) {
    console.error("Erreur de récupération des contrats:", error);
    throw error;
  }
};

export const fetchContratById = async (id: string | number) => {
  try {
    const response = await axios.get(`${API_URL}/administration/contrats/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur de récupération d'un contrat:", error);
    throw error;
  }
};

export const addContrat = async (contratData: Omit<Contrat, 'id_contrat'>, documentFile?: File) => {
  try {
    let response;
    
    // Si un fichier est fourni, nous utilisons FormData pour l'upload
    if (documentFile) {
      const formData = new FormData();
      // Ajouter les données du contrat
      Object.keys(contratData).forEach((key) => {
        const value = contratData[key as keyof Omit<Contrat, 'id_contrat'>];
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      // Ajouter le fichier document
      formData.append('document', documentFile);
      
      response = await axios.post(`${API_URL}/administration/contrats`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Si pas de fichier, envoyer simplement les données JSON
      response = await axios.post(`${API_URL}/administration/contrats`, contratData);
    }
    
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un contrat:", error);
    throw error;
  }
};

export const updateContrat = async (id: string | number, contratData: Partial<Contrat>, documentFile?: File) => {
  try {
    let response;
    
    // Si un fichier est fourni, nous utilisons FormData pour l'upload
    if (documentFile) {
      const formData = new FormData();
      // Ajouter les données du contrat
      Object.keys(contratData).forEach((key) => {
        const value = contratData[key as keyof Partial<Contrat>];
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      // Ajouter le fichier document
      formData.append('document', documentFile);
      
      response = await axios.put(`${API_URL}/administration/contrats/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Si pas de fichier, envoyer simplement les données JSON
      response = await axios.put(`${API_URL}/administration/contrats/${id}`, contratData);
    }
    
    return response.data;
  } catch (error) {
    console.error("Erreur de mise à jour d'un contrat:", error);
    throw error;
  }
};

export const deleteContrat = async (id: string | number) => {
  try {
    const response = await axios.delete(`${API_URL}/administration/contrats/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur de suppression d'un contrat:", error);
    throw error;
  }
};

// Service pour les natures de document
export const fetchNaturesDocument = async () => {
  try {
    const response = await axios.get(`${API_URL}/administration/natures-document`);
    return response.data;
  } catch (error) {
    console.error("Erreur de récupération des natures de document:", error);
    throw error;
  }
};

// Services pour les documents liés aux contrats
export const addDocumentToContrat = async (contratId: string | number, documentData: Omit<Document, 'id_document'>, file: File) => {
  try {
    const formData = new FormData();
    // Ajouter les données du document
    Object.keys(documentData).forEach((key) => {
      const value = documentData[key as keyof Omit<Document, 'id_document'>];
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    // Ajouter le fichier
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/administration/contrats/${contratId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un document:", error);
    throw error;
  }
};

export const fetchDocumentsByContratId = async (contratId: string | number) => {
  try {
    const response = await axios.get(`${API_URL}/administration/contrats/${contratId}/documents`);
    return response.data;
  } catch (error) {
    console.error("Erreur de récupération des documents d'un contrat:", error);
    throw error;
  }
};

export const deleteDocument = async (contratId: string | number, documentId: string | number) => {
  try {
    const response = await axios.delete(`${API_URL}/administration/contrats/${contratId}/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur de suppression d'un document:", error);
    throw error;
  }
};