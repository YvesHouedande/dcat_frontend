import { categorieTypes, familleTypes, marqueTypes, modeleTypes } from "../../types/reference";
import { api } from "@/api/api";

export const useProductMarquesService = () => {
  const apis = api();
  const getAll = async (): Promise<marqueTypes[]> => {
    const response = await apis.get("/stocks/marques");
    return response.data;
  }
  const getById = async (id: string | number): Promise<marqueTypes> => {
    const response = await apis.get(`/stocks/marques/${id}`);
    return response.data; 
  }
  const create = async (data: marqueTypes): Promise<marqueTypes> => {
    const response = await apis.post("/stocks/marques", data);
    return response.data;
  }
  const update = async (id: string | number, data: marqueTypes): Promise<marqueTypes> => {
    const response = await apis.put(`/stocks/marques/${id}`, data);
    return response.data;
  }
  const remove = async (id: string | number): Promise<void> => {
    await apis.delete(`/stocks/marques/${id}`);
  }
  return {
    getAll,
    getById,
    create,
    update,
    delete: remove,
  };
};

export const useProductCategoriesService = () => {
  const apis = api();
  const getAll = async (): Promise<categorieTypes[]> => {
      const response = await apis.get("/stocks/categories");
    return response.data;
  }
  const getById = async (id: string | number): Promise<categorieTypes> => {
    const response = await apis.get(`/stocks/categories/${id}`);
    return response.data; 
  }
  const create = async (data: categorieTypes): Promise<categorieTypes> => {
    const response = await apis.post("/stocks/categories", data);
    return response.data;
  }
  const update = async (id: string | number, data: categorieTypes): Promise<categorieTypes> => {
    const response = await apis.put(`/stocks/categories/${id}`, data);
    return response.data;
  }
  const remove = async (id: string | number): Promise<void> => {
    await apis.delete(`/stocks/categories/${id}`);
  }
  return {
    getAll,
    getById,
    create,
    update,
    delete: remove,
  };
};



export const  useProductModelsService = () => {
  const apis = api();
  const getAll = async (): Promise<modeleTypes[]> => {
    const response = await apis.get("/stocks/modeles");
    return response.data;
  }
  const getById = async (id: string | number): Promise<modeleTypes> => {
    const response = await apis.get(`/stocks/modeles/${id}`);
    return response.data; 
  }
  const create = async (data: modeleTypes): Promise<modeleTypes> => {
    const response = await apis.post("/stocks/modeles", data);
    return response.data;
  }
  const update = async (id: string | number, data: modeleTypes): Promise<modeleTypes> => {
    const response = await apis.put(`/stocks/modeles/${id}`, data);
    return response.data;
  }
  const remove = async (id: string | number): Promise<void> => {
    await apis.delete(`/stocks/modeles/${id}`);
  }
  return {
    getAll,
    getById,
    create,
    update,
    delete: remove,
  };
};

export const  useProductFamiliesService = () => {
  const apis = api(); 
  const getAll = async (): Promise<familleTypes[]> => {
    const response = await apis.get("/stocks/familles");
    return response.data;
  }
  const getById = async (id: string | number): Promise<familleTypes> => {
    const response = await apis.get(`/stocks/familles/${id}`);
    return response.data; 
  }
  const create = async (data: familleTypes): Promise<familleTypes> => {
    const response = await apis.post("/stocks/familles", data);
    return response.data;
  }
  const update = async (id: string | number, data: familleTypes): Promise<familleTypes> => {
    const response = await apis.put(`/stocks/familles/${id}`, data);
    return response.data;
  }
  const remove = async (id: string | number): Promise<void> => {
    await apis.delete(`/stocks/familles/${id}`);
  }

  return {
    getAll,
    getById,
    create,
    update,
    delete: remove,
  };
};