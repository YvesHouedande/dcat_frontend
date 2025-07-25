import axios, { AxiosError } from 'axios';
import { Demande, Employe, NatureDocument, DemandeDocument } from '../administration/types/interfaces';
import { omit } from '@/lib/utils';

const API_URL = import.meta.env.VITE_APP_API_URL;

// Configuration de l'instance axios avec intercepteurs
const createApiInstance = (token?: string) => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
  });

  // Intercepteur pour les erreurs
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      console.error('Erreur API:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data
      });
      return Promise.reject(error);
    }
  );

  return instance;
};

// Types pour les données d'entrée
export type CreateDemandeData = Omit<Demande, 'id_demandes' | 'created_at' | 'updated_at' | 'documents'>;
export type UpdateDemandeData = Partial<CreateDemandeData>;

export type AddDocumentData = {
  file: File;
  libelle_document: string;
  classification_document: string;
  id_nature_document: number;
};

// ===== ENDPOINTS PRINCIPAUX =====

/**
 * Créer une nouvelle demande RH
 * POST /administration/demandes
 */
export const createDemande = async (
  data: CreateDemandeData,
  token?: string
): Promise<Demande> => {
  try {
    const api = createApiInstance(token);
    
    // Les données sont déjà nettoyées grâce au type CreateDemandeData
    // qui exclut automatiquement id_demandes et documents
    const response = await api.post<Demande>('/administration/demandes', data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Échec de la création: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

/**
 * Récupérer toutes les demandes RH
 * GET /administration/demandes
 */
export const fetchDemandes = async (token?: string): Promise<Demande[]> => {
  try {
    const api = createApiInstance(token);
    const response = await api.get<Demande[]>('/administration/demandes');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Erreur lors de la récupération: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

/**
 * Récupérer une demande RH par son ID
 * GET /administration/demandes/{id}
 */
export const fetchDemandeById = async (id: number, token?: string): Promise<Demande> => {
  if (!id || isNaN(id)) {
    throw new Error("ID demande invalide");
  }

  try {
    const api = createApiInstance(token);
    const response = await api.get<Demande>(`/administration/demandes/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Demande non trouvée");
      }
      throw new Error(`Erreur lors de la récupération: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

/**
 * Mettre à jour une demande RH
 * PUT /administration/demandes/{id}
 */
export const updateDemande = async (
  id: number,
  data: Partial<Demande>,
  token?: string
): Promise<Demande> => {
  try {
    const api = createApiInstance(token);
    
    // Nettoyer les données avant envoi en utilisant omit
    // Exclure les champs qui ne doivent pas être envoyés à l'API
    const cleanedData = omit(data, ['id_demandes', 'documents']);
    
    const response = await api.put<Demande>(`/administration/demandes/${id}`, cleanedData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Erreur lors de la mise à jour: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

/**
 * Supprimer une demande RH
 * DELETE /administration/demandes/{id}
 */
export const deleteDemande = async (id: number, token?: string): Promise<void> => {
  try {
    const api = createApiInstance(token);
    await api.delete(`/administration/demandes/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Erreur lors de la suppression: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

// ===== ENDPOINTS DE FILTRAGE =====

/**
 * Récupérer les demandes par type
 * GET /administration/demandes/type/{type}
 */
export const fetchDemandesByType = async (type: string, token?: string): Promise<Demande[]> => {
  try {
    const api = createApiInstance(token);
    const response = await api.get<Demande[]>(`/administration/demandes/type/${type}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Erreur lors de la récupération par type: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

/**
 * Récupérer les demandes par employé
 * GET /administration/demandes/employe/{id_employe}
 */
export const fetchDemandesByEmploye = async (id_employe: number, token?: string): Promise<Demande[]> => {
  try {
    const api = createApiInstance(token);
    const response = await api.get<Demande[]>(`/administration/demandes/employe/${id_employe}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Erreur lors de la récupération par employé: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

// ===== GESTION DES DOCUMENTS =====

/**
 * Ajouter un document à une demande RH
 * POST /administration/demandes/{id}/documents
 */
export const addDocumentToDemande = async (
  demandeId: number,
  documentData: AddDocumentData,
  token?: string
): Promise<DemandeDocument> => {
  try {
    const api = createApiInstance(token);
    
    const formData = new FormData();
    formData.append('document', documentData.file);
    formData.append('libelle_document', documentData.libelle_document);
    formData.append('classification_document', documentData.classification_document);
    formData.append('id_nature_document', documentData.id_nature_document.toString());

    const response = await api.post<DemandeDocument>(
      `/administration/demandes/${demandeId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Erreur lors de l'ajout du document: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

/**
 * Supprimer un document d'une demande RH
 * DELETE /administration/demandes/{id}/docdemande/{docid}
 */
export const deleteDocumentFromDemande = async (
  demandeId: number,
  documentId: number,
  token?: string
): Promise<void> => {
  try {
    const api = createApiInstance(token);
    await api.delete(`/administration/demandes/${demandeId}/docdemande/${documentId}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Erreur lors de la suppression du document: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

// ===== ACTIONS SPÉCIALES =====

/**
 * Approuver une demande
 */
export const approuverDemande = async (
  id: number, 
  commentaire?: string, 
  token?: string
): Promise<Demande> => {
  return updateDemande(id, {
    status: "Approuvée",
    ...(commentaire && { commentaire_approbation: commentaire })
  }, token);
};

/**
 * Refuser une demande
 */
export const refuserDemande = async (
  id: number, 
  motif?: string, 
  token?: string
): Promise<Demande> => {
  return updateDemande(id, {
    status: "Refusée",
    ...(motif && { motif_refus: motif })
  }, token);
};

// ===== SERVICES UTILITAIRES =====

/**
 * Récupérer tous les employés
 */
export const getAllEmployes = async (token?: string): Promise<Employe[]> => {
  try {
    const api = createApiInstance(token);
    const response = await api.get<Employe[]>('/administration/employes');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Erreur lors de la récupération des employés: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

/**
 * Récupérer un employé par ID
 */
export const fetchEmployeById = async (id: number, token?: string): Promise<Employe> => {
  try {
    const api = createApiInstance(token);
    const response = await api.get<Employe>(`/administration/employes/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error(`Employé avec l'ID ${id} non trouvé`);
      }
      throw new Error(`Erreur lors de la récupération de l'employé: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

/**
 * Récupérer toutes les natures de documents
 */
export const getAllNatureDocuments = async (token?: string): Promise<NatureDocument[]> => {
  try {
    const api = createApiInstance(token);
    const response = await api.get<NatureDocument[]>('/administration/natures');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Erreur lors de la récupération des natures de documents: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

/**
 * Récupérer les documents d'une demande
 * Note: Cette fonction utilise l'endpoint de récupération de la demande complète
 * car les documents sont inclus dans la réponse de la demande
 */
export const fetchDocumentsByDemande = async (demandeId: number, token?: string): Promise<DemandeDocument[]> => {
  try {
    const demande = await fetchDemandeById(demandeId, token);
    return demande.documents || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    return [];
  }
};