import axios from "axios";
import { ApiResponse, Operation, Tache } from "../../types/types";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const getAllOperations = async (page = 1, limit = 10): Promise<ApiResponse<Operation[]>> => {
  const response = await axios.get(`${API_URL}/technique/operations`, {
    params: { page, limit },
  });
  return response.data;
};

export const createOperation = async (payload: Omit<Operation, "id_operation">): Promise<Operation> => {
  const response = await axios.post(`${API_URL}/technique/operations`, payload);
  return response.data.data;
};

export const getOperationById = async (id: number): Promise<Operation> => {
  const response = await axios.get(`${API_URL}/technique/operations/${id}`);
  return response.data.data;
};

export const updateOperation = async (id: number, payload: Partial<Omit<Operation, "id_operation">>): Promise<Operation> => {
  const response = await axios.put(`${API_URL}/technique/operations/${id}`, payload);
  return response.data.data;
};

export const deleteOperation = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_URL}/technique/operations/${id}`);
  return response.data;
};

export const getTachesByOperation = async (id_operation: number): Promise<ApiResponse<Tache[]>> => {
  const response = await axios.get(`${API_URL}/technique/operations/${id_operation}/taches`);
  return response.data;
};

export const getOperationsByProjet = async (id_projet: number, page?: number, limit?: number): Promise<ApiResponse<Operation[]>> => {
  const params: Record<string, string | number> = {};
  if (page !== undefined) params.page = page;
  if (limit !== undefined) params.limit = limit;
  const response = await axios.get(`${API_URL}/technique/operations/projet/${id_projet}`, Object.keys(params).length ? { params } : undefined);
  return response.data;
}; 