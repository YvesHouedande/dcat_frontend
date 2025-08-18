import axios from 'axios';
import { 
  Intervention, 
  CreateInterventionPayload, 
  UpdateInterventionPayload, 
  Employe,
  ApiResponse,
  Nature,
  InterventionDocument,
  CreateInterventionDocumentTextPayload
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
    console.log("[API] Tentative de création d'intervention avec payload:", payload);
    const response = await axios.post(BASE_PATH, payload);
    console.log("[API] Intervention créée avec succès:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] Erreur lors de la création de l'intervention:", error);
    throw error;
  }
};

export const updateIntervention = async (id: number, payload: UpdateInterventionPayload): Promise<ApiResponse<Intervention>> => {
  try {
    console.log(`[API] Tentative de mise à jour de l'intervention ${id}`);
    console.log(`[API] Payload envoyé:`, payload);
    console.log(`[API] URL: ${BASE_PATH}/${id}`);
    
    // Configuration avec timeout plus long pour les textes longs
    const config = {
      timeout: 30000, // 30 secondes au lieu du timeout par défaut
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    const response = await axios.put(`${BASE_PATH}/${id}`, payload, config);
    
    console.log(`[API] Réponse de mise à jour:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[API] Erreur lors de la mise à jour de l'intervention ${id}:`, error);
    
    // Type guard pour vérifier si c'est une erreur Axios
    if (axios.isAxiosError(error)) {
      console.error(`[API] Détails de l'erreur:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error(`[API] Erreur non-Axios:`, error);
    }
    
    throw error;
  }
};

export const deleteIntervention = async (id: number): Promise<ApiResponse<void>> => {
  try {
    console.log(`[API] Tentative de suppression de l'intervention ${id} avec dissociation des employés et documents`);
    
    // Récupérer les employés assignés à cette intervention
    try {
      const employeesResponse = await getInterventionEmployees(id);
      const employees = employeesResponse.data || [];
      
      // Dissocier tous les employés
      for (const employee of employees) {
        try {
          await removeEmployeeFromIntervention(id, employee.id_employes);
          console.log(`[API] Employé ${employee.id_employes} dissocié de l'intervention ${id}`);
        } catch (employeeError) {
          console.error(`[API] Erreur lors de la dissociation de l'employé ${employee.id_employes}:`, employeeError);
        }
      }
    } catch (employeesError) {
      console.error(`[API] Erreur lors de la récupération des employés de l'intervention ${id}:`, employeesError);
    }
    
    // Récupérer les documents de cette intervention
    try {
      const documentsResponse = await getInterventionDocuments(id);
      const documents = documentsResponse.data || [];
      
      // Supprimer tous les documents
      for (const document of documents) {
        try {
          await removeDocumentFromIntervention(id, document.id_documents);
          console.log(`[API] Document ${document.id_documents} supprimé de l'intervention ${id}`);
        } catch (documentError) {
          console.error(`[API] Erreur lors de la suppression du document ${document.id_documents}:`, documentError);
        }
      }
    } catch (documentsError) {
      console.error(`[API] Erreur lors de la récupération des documents de l'intervention ${id}:`, documentsError);
    }
    
    // Supprimer l'intervention elle-même
    const response = await axios.delete(`${BASE_PATH}/${id}`);
    console.log(`[API] Intervention ${id} supprimée avec succès`);
    return response.data;
  } catch (error) {
    console.error(`[API] Erreur lors de la suppression de l'intervention ${id}:`, error);
    throw error;
  }
};

// Employee Management for Interventions
export const assignEmployeeToIntervention = async (interventionId: number, employeeId: number): Promise<ApiResponse<void>> => {
  try {
    console.log(`[API] Tentative d'assignation: intervention ${interventionId}, employé ${employeeId}`);
    const response = await axios.post(`${BASE_PATH}/${interventionId}/employes`, { id_employes: employeeId });
    console.log(`[API] Assignation réussie:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[API] Erreur lors de l'assignation de l'employé ${employeeId} à l'intervention ${interventionId}:`, error);
    throw error;
  }
};

// Fonction spécifique pour assigner un superviseur
export const assignSuperviseurToIntervention = async (interventionId: number, superviseurId: number): Promise<ApiResponse<Intervention>> => {
  try {
    console.log(`[API] Tentative d'assignation du superviseur: intervention ${interventionId}, superviseur ${superviseurId}`);
    
    // Essayer d'abord la mise à jour directe du champ id_superviseur
    try {
      const response = await updateIntervention(interventionId, { id_superviseur: superviseurId });
      console.log(`[API] Assignation du superviseur réussie via updateIntervention:`, response);
      return response;
    } catch (updateError) {
      console.log(`[API] Échec de la mise à jour directe, tentative via assignEmployeeToIntervention:`, updateError);
      
      // Fallback : utiliser assignEmployeeToIntervention
      await assignEmployeeToIntervention(interventionId, superviseurId);
      
      // Retourner une réponse simulée
      return {
        success: true,
        message: 'Superviseur assigné via relation employé-intervention',
        intervention: await getInterventionById(interventionId).then(res => res.data)
      } as ApiResponse<Intervention>;
    }
  } catch (error) {
    console.error(`[API] Erreur lors de l'assignation du superviseur ${superviseurId} à l'intervention ${interventionId}:`, error);
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
  textPayload: CreateInterventionDocumentTextPayload
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

/**
 * Récupère tous les documents des interventions avec pagination.
 * @param page - Numéro de page (défaut: 1)
 * @param limit - Nombre d'éléments par page (défaut: 10)
 * @returns Promesse résolue avec un tableau de InterventionDocument et pagination.
 */
export const getAllInterventionDocuments = async (page: number = 1, limit: number = 10): Promise<ApiResponse<InterventionDocument[]>> => {
  try {
    console.log('[API Interventions] Tentative de récupération de tous les documents des interventions...', { page, limit });
    const response = await axios.get(`${API_URL}/administration/dossier/documents/intervention`, {
      params: { page, limit }
    });
    console.log('[API Interventions] Documents des interventions récupérés:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API Interventions] Erreur lors de la récupération des documents des interventions:', error);
    throw error;
  }
};