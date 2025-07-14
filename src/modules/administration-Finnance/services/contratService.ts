import axios from 'axios';
import { 
  // Contrat, 
  // EmployeDocument, 
  ContratDocument,
  ContratResponse, 
  CreateContratData, 
  UpdateContratData,
  // CreateDocumentData,
  ApiResponse 
} from '../../administration-Finnance/administration/types/interfaces';

const API_URL = import.meta.env.VITE_APP_API_URL;

// Lister tous les contrats
export const fetchContrats = async () => {
  const response = await axios.get(`${API_URL}/administration/contrats`);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data)) return response.data.data;
  return [];
};

// Créer un nouveau contrat
export const addContrat = async (contratData: CreateContratData, documentFile?: File): Promise<ContratResponse> => {
  
  let response;
  if (documentFile) {
    const formData = new FormData();
    Object.keys(contratData).forEach((key) => {
      const value = contratData[key as keyof CreateContratData];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    formData.append('document', documentFile);
    response = await axios.post<ContratResponse>(`${API_URL}/administration/contrats`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } else {
    // Nettoyer les données avant envoi
    const cleanData = Object.fromEntries(
      Object.entries(contratData).filter(([, value]) => value !== undefined && value !== null)
    );
    response = await axios.post<ContratResponse>(`${API_URL}/administration/contrats`, cleanData);
  }
  return response.data;
};

// Obtenir un contrat par ID
export const fetchContratById = async (id: string | number): Promise<ContratResponse | null> => {
  const response = await axios.get<ApiResponse<ContratResponse[]>>(`${API_URL}/administration/contrats/${id}`);
  
  if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
    const contrat = response.data.data[0];
    
    // Normaliser les documents en tableau
    if (contrat.documents) {
      if (Array.isArray(contrat.documents)) {
        // Déjà un tableau, pas de changement
        // Rien à faire
      } else {
        // C'est un objet unique, le convertir en tableau
        contrat.documents = [contrat.documents];
      }
    } else {
      // Aucun document
      contrat.documents = [];
    }
    
    return contrat;
  }
  return null;
};

// Modifier un contrat
export const updateContrat = async (id: string | number, contratData: UpdateContratData, documentFile?: File): Promise<ContratResponse> => {
  
  let response;
  if (documentFile) {
    const formData = new FormData();
    Object.keys(contratData).forEach((key) => {
      const value = contratData[key as keyof UpdateContratData];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    formData.append('document', documentFile);
    response = await axios.put<ContratResponse>(`${API_URL}/administration/contrats/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } else {
    // Nettoyer les données avant envoi
    const cleanData = Object.fromEntries(
      Object.entries(contratData).filter(([, value]) => value !== undefined && value !== null)
    );
    response = await axios.put<ContratResponse>(`${API_URL}/administration/contrats/${id}`, cleanData);
  }
  return response.data;
};

// Supprimer un contrat (supprime d'abord les documents associés)
export const deleteContrat = async (id: string | number) => {
  try {
    // Récupérer d'abord le contrat avec ses documents
    const contratResponse = await axios.get(`${API_URL}/administration/contrats/${id}`);
    const contrat = contratResponse.data;
    
    // Supprimer tous les documents associés
    if (contrat.documents && Array.isArray(contrat.documents) && contrat.documents.length > 0) {
      for (const doc of contrat.documents) {
        await axios.delete(`${API_URL}/administration/contrats/docContrat/${doc.id_documents}`);
      }
    }
    
    // Supprimer le contrat
    const response = await axios.delete(`${API_URL}/administration/contrats/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du contrat:', error);
    throw error;
  }
};

// Obtenir les contrats par type
export const fetchContratsByType = async (type: string) => {
  const response = await axios.get(`${API_URL}/administration/contrats/type/${type}`);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data)) return response.data.data;
  return [];
};

// Obtenir les contrats par partenaire
export const fetchContratsByPartenaire = async (id_partenaire: string | number) => {
  const response = await axios.get(`${API_URL}/administration/contrats/partenaire/${id_partenaire}`);
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data)) return response.data.data;
  return [];
};

// Ajouter un document à un contrat
export const addDocumentToContrat = async (
  contratId: string | number,
  documentData: Omit<ContratDocument, 'id_documents' | 'id_contrat'>,
  file: File
): Promise<ContratDocument> => {
  const formData = new FormData();
  
  // Ajouter le fichier (comme dans les interventions)
  formData.append('document', file);
  
  // Ajouter les autres champs de texte au FormData (comme dans les interventions)
  Object.keys(documentData).forEach(key => {
    const value = documentData[key as keyof typeof documentData];
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  // Ajouter l'ID du contrat
  formData.append('id_contrat', String(contratId));
  
  const response = await axios.post<ContratDocument>(`${API_URL}/administration/contrats/${contratId}/doc`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response.data;
};

// Supprimer un document d'un contrat
export const deleteDocumentFromContrat = async (docId: string | number) => {
  console.log('Suppression document, id envoyé :', docId);
  const response = await axios.delete(`${API_URL}/administration/contrats/docContrat/${docId}`);
  return response.data;
};



// Service pour les natures de document
export const fetchNaturesDocument = async () => {
  const response = await axios.get(`${API_URL}/administration/natures`);
  return response.data;
};
