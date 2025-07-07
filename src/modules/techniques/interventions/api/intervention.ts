import axios from 'axios';
import { 
  Intervention, 
  CreateInterventionPayload, 
  UpdateInterventionPayload, 
  Employe,
  ApiResponse,
  Nature,
  InterventionDocument
} from '../interface/interface';

const API_URL = import.meta.env.VITE_APP_API_URL;
const BASE_PATH = `${API_URL}/technique/interventions`;

// CRUD Operations for Interventions
export const getInterventions = async (page: number = 1, limit: number = 10): Promise<ApiResponse<Intervention[]>> => {
  try {
    const response = await axios.get(`${BASE_PATH}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des interventions:", error);
    throw error;
  }
};

export const getInterventionById = async (id: number): Promise<ApiResponse<Intervention>> => {
  try {
    const response = await axios.get(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'intervention ${id}:`, error);
    throw error;
  }
};

export const createIntervention = async (payload: CreateInterventionPayload): Promise<ApiResponse<Intervention>> => {
  try {
    const response = await axios.post(BASE_PATH, payload);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'intervention:", error);
    throw error;
  }
};

export const updateIntervention = async (id: number, payload: UpdateInterventionPayload): Promise<ApiResponse<Intervention>> => {
  try {
    const response = await axios.put(`${BASE_PATH}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'intervention ${id}:`, error);
    throw error;
  }
};

export const deleteIntervention = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await axios.delete(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'intervention ${id}:`, error);
    throw error;
  }
};

// Employee Management for Interventions
export const assignEmployeeToIntervention = async (interventionId: number, employeeId: number): Promise<ApiResponse<void>> => {
  try {
    const response = await axios.post(`${BASE_PATH}/${interventionId}/employes`, { id_employes: employeeId });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de l'assignation de l'employé à l'intervention:`, error);
    throw error;
  }
};

export const getInterventionEmployees = async (interventionId: number): Promise<ApiResponse<Employe[]>> => {
  try {
    const response = await axios.get(`${BASE_PATH}/${interventionId}/employes`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des employés de l'intervention:`, error);
    throw error;
  }
};

export const removeEmployeeFromIntervention = async (interventionId: number, employeeId: number): Promise<ApiResponse<void>> => {
  try {
    const response = await axios.delete(`${BASE_PATH}/${interventionId}/employes/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors du retrait de l'employé de l'intervention:`, error);
    throw error;
  }
};

// Document Management for Interventions
export const getInterventionDocuments = async (interventionId: number): Promise<ApiResponse<InterventionDocument[]>> => {
  try {
    const response = await axios.get(`${BASE_PATH}/${interventionId}/documents`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    throw error;
  }
};

export const addDocumentToIntervention = async (
  interventionId: number,
  file: File,
  textPayload: {
    libelle_document: string;
    classification_document: string;
    date_document: string;
    id_nature_document: number;
  }
): Promise<ApiResponse<InterventionDocument>> => {
  try {
    console.log('[API Interventions] Tentative d\'ajout de document...', { interventionId, textPayload });
    
    // Créer le FormData
    const formData = new FormData();
    formData.append('document', file);
    
    // Ajouter les autres champs de texte au FormData
    Object.keys(textPayload).forEach(key => {
      const value = textPayload[key as keyof typeof textPayload];
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await axios.post(
      `${BASE_PATH}/${interventionId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('[API Interventions] Document ajouté avec succès:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API Interventions] Erreur lors de l\'ajout du document:', error);
    throw error;
  }
};

export const removeDocumentFromIntervention = async (
  interventionId: number,
  documentId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await axios.delete(`${BASE_PATH}/${interventionId}/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du document:', error);
    throw error;
  }
};

export const downloadDocument = async (documentUrl: string): Promise<Blob> => {
  try {
    const response = await axios.get(documentUrl, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors du téléchargement du document:', error);
    throw error;
  }
};

// Monthly Report Generation
export const getMonthlyInterventions = async (year: number, month: number): Promise<ApiResponse<Intervention[]>> => {
  try {
    const response = await axios.get(`${BASE_PATH}`, {
      params: {
        year,
        month,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du rapport mensuel:", error);
    throw error;
  }
};

// Rapport generation
export const generateInterventionReport = async (interventionId: number): Promise<Blob> => {
  try {
    const response = await axios.get(`${BASE_PATH}/${interventionId}/report`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw error;
  }
};

// Récupération des interventions par partenaire
export const getInterventionsByPartenaire = async (partenaireId: number): Promise<ApiResponse<Intervention[]>> => {
  try {
    console.log('[API Interventions] Tentative de récupération des interventions pour le partenaire:', partenaireId);
    const response = await axios.get(`${BASE_PATH}/partenaire/${partenaireId}`);
    console.log('[API Interventions] Interventions du partenaire récupérées:', response.data);
    return response.data;
  } catch (error) {
    console.error(`[API Interventions] Erreur lors de la récupération des interventions du partenaire ${partenaireId}:`, error);
    throw error;
  }
};

/**
 * Récupère toutes les natures de documents disponibles.
 * @returns Promesse résolue avec un tableau de Nature.
 */
export const getAllNatureDocuments = async (): Promise<Nature[]> => {
  try {
    console.log('[API Interventions] Tentative de récupération des natures de documents...');
    const response = await axios.get<ApiResponse<Nature[]>>(`${API_URL}/administration/natures`);
    
    let naturesToReturn: Nature[] = [];
    
    // Gestion des différents formats de réponse possibles
    if (response.data.data && Array.isArray(response.data.data)) {
      naturesToReturn = response.data.data;
    } else if (response.data.natures && Array.isArray(response.data.natures)) {
      naturesToReturn = response.data.natures;
    } else if (Array.isArray(response.data)) {
      naturesToReturn = response.data;
    }
    
    // Vérification et transformation des données si nécessaire
    naturesToReturn = naturesToReturn.map(nature => ({
      id_nature_document: nature.id_nature_document,
      libelle: nature.libelle || ''
    }));
    
    console.log('[API Interventions] Natures de documents récupérées:', naturesToReturn);
    return naturesToReturn;
  } catch (error) {
    console.error('[API Interventions] Erreur lors de la récupération des natures de documents:', error);
    throw error;
  }
};
