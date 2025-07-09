import axios, { AxiosError } from 'axios';
import { Contrat} from '../../administration-Finnance/administration/types/interfaces';
import { EmployeDocument } from "../administration/types/interfaces";

const API_URL = import.meta.env.VITE_APP_API_URL;

// Services for contracts
export const fetchContrats = async () => {
  try {
    const response = await axios.get(`${API_URL}/administration/contrats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching contracts:", error);
    throw error;
  }
};

export const fetchContratById = async (id: string | number) => {
  try {
    const response = await axios.get(`${API_URL}/administration/contrats/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching contract by ID:", error);
    throw error;
  }
};

export const addContrat = async (contratData: Omit<Contrat, 'id_contrat'>, documentFile?: File) => {
  try {
    let response;

    if (documentFile) {
      const formData = new FormData();
      Object.keys(contratData).forEach((key) => {
        const value = contratData[key as keyof Omit<Contrat, 'id_contrat'>];
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      formData.append('document', documentFile);

      response = await axios.post(`${API_URL}/administration/contrats`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await axios.post(`${API_URL}/administration/contrats`, contratData);
    }

    return response.data;
  } catch (error) {
    console.error("Error adding contract:", error);
    throw error;
  }
};

export const updateContrat = async (id: string | number, contratData: Partial<Contrat>, documentFile?: File) => {
  try {
    let response;

    if (documentFile) {
      const formData = new FormData();
      Object.keys(contratData).forEach((key) => {
        const value = contratData[key as keyof Partial<Contrat>];
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      formData.append('document', documentFile);

      response = await axios.put(`${API_URL}/administration/contrats/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await axios.put(`${API_URL}/administration/contrats/${id}`, contratData);
    }

    return response.data;
  } catch (error) {
    console.error("Error updating contract:", error);
    throw error;
  }
};

export const deleteContrat = async (id: string | number) => {
  try {
    const response = await axios.delete(`${API_URL}/administration/contrats/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting contract:", error);
    throw error;
  }
};

// Service for document types
export const fetchNaturesDocument = async () => {
  try {
    const response = await axios.get(`${API_URL}/administration/natures`);
    return response.data;
  } catch (error) {
    console.error("Error fetching document types:", error);
    throw error;
  }
};

// Services for documents
export const fetchDocuments = async () => {
  try {
    const response = await axios.get(`${API_URL}/administration/documents`);
    return response.data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

export const fetchDocumentById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/administration/documents/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching document by ID:", error);
    throw error;
  }
};

export const addDocument = async (documentData: Omit<Document, 'id_document'>, file: File) => {
  try {
    const formData = new FormData();
    Object.keys(documentData).forEach((key) => {
      const value = documentData[key as keyof Omit<Document, 'id_document'>];
      if (value !== undefined) {
        formData.append(key, value ? value.toString() : "");
      }
    });
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/administration/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

// Unified update document function
export const updateDocument = async (id: string | number, updates: Partial<Document>, file?: File): Promise<Document> => {
  try {
    const formData = new FormData();
    Object.keys(updates).forEach((key) => {
      const value = updates[key as keyof Partial<Document>];
      if (value !== undefined) {
        formData.append(key, value ? value.toString() : "");
      }
    });
    if (file) {
      formData.append('file', file);
    }

    const response = await axios.put(`${API_URL}/administration/documents/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Unified delete document function
export const deleteDocument = async (id: string | number, contratId?: string | number): Promise<void> => {
  try {
    const url = contratId 
      ? `${API_URL}/administration/contrats/${contratId}/documents/${id}`
      : `${API_URL}/administration/documents/${id}`;
    
    await axios.delete(url);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

export const fetchDocumentsByProjetId = async (id_projet: number) => {
  try {
    const response = await axios.get(`${API_URL}/administration/documents/projet/${id_projet}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching documents by projet ID:", error);
    throw error;
  }
};

// Récupérer tous les documents d'un employé
export const fetchEmployeDocuments = async (id_employes: number): Promise<EmployeDocument[]> => {
  try {
    console.log(`Appel API: GET ${API_URL}/administration/employes/${id_employes}/documents`);
    const response = await axios.get(`${API_URL}/administration/employes/${id_employes}/documents`);
    
    if (!response.data) {
      throw new Error("Aucun document trouvé");
    }
    
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
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

// Télécharger un document
export const downloadDocument = async (id_document: string): Promise<Blob> => {
  try {
    const response = await axios.get(`${API_URL}/administration/documents/${id_document}/download`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors du téléchargement du document:", error);
    throw error;
  }
};

// Uploader un document
export const uploadDocument = async (id_employes: number, file: File, type: string): Promise<Document> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('id_employes', id_employes.toString());

    const response = await axios.post(`${API_URL}/administration/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'upload du document:", error);
    throw error;
  }
};
