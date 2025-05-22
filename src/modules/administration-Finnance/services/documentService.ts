import axios from 'axios';
import { Contrat, Document } from '../../administration-Finnance/administration/types/interfaces';

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

// Services for documents related to contracts
export const addDocumentToContrat = async (contratId: string | number, documentData: Omit<Document, 'id_document'>, file: File) => {
  try {
    const formData = new FormData();
    Object.keys(documentData).forEach((key) => {
      const value = documentData[key as keyof Omit<Document, 'id_document'>];
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/administration/contrats/${contratId}/documents`, formData, {
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

export const fetchDocumentsByContratId = async (contratId: string | number) => {
  try {
    const response = await axios.get(`${API_URL}/administration/contrats/${contratId}/documents`);
    return response.data;
  } catch (error) {
    console.error("Error fetching documents for contract:", error);
    throw error;
  }
};

export const deleteDocument = async (contratId: string | number, documentId: string | number) => {
  try {
    const response = await axios.delete(`${API_URL}/administration/contrats/${contratId}/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

// Additional document-related API calls
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
        formData.append(key, value.toString());
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

export const updateDocument = async (id: number, documentData: Partial<Document>, file?: File) => {
  try {
    const formData = new FormData();
    Object.keys(documentData).forEach((key) => {
      const value = documentData[key as keyof Partial<Document>];
      if (value !== undefined) {
        formData.append(key, value.toString());
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

export const deleteDocumentById = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/administration/documents/${id}`);
    return response.data;
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
