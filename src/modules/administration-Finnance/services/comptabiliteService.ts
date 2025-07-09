import axios from 'axios';
import { DemandeDocument, NatureDocument } from '../administration/types/interfaces';

const API_URL = import.meta.env.VITE_APP_API_URL;

// Récupérer tous les documents Comptabilité
export const getAllDocuments = async (): Promise<DemandeDocument[]> => {
  const response = await axios.get<DemandeDocument[]>(`${API_URL}/administration/documents`);
  return response.data;
};

// Ajouter un nouveau document (upload)
export const addDocument = async (formData: FormData): Promise<DemandeDocument> => {
  const response = await axios.post<DemandeDocument>(
    `${API_URL}/administration/documents/ajouter`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};

// Modifier un document
export const updateDocument = async (id: number, formData: FormData): Promise<DemandeDocument> => {
  const response = await axios.put<DemandeDocument>(
    `${API_URL}/administration/documents/modifier/${id}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};

// Supprimer un document
export const deleteDocument = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/administration/documents/supprimer/${id}`);
};

// Récupérer toutes les natures de documents
export const getAllNatureDocuments = async (): Promise<NatureDocument[]> => {
  const response = await axios.get<NatureDocument[]>(`${API_URL}/administration/documents/nature`);
  return response.data;
};

// Récupérer un document par son id
export const getDocumentById = async (id: number): Promise<DemandeDocument> => {
  const response = await axios.get<DemandeDocument>(`${API_URL}/administration/documents/${id}`);
  return response.data;
}; 