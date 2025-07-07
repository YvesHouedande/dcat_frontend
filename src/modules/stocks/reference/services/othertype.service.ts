
import { categorieTypes, familleTypes, marqueTypes, modeleTypes, typeTypes } from "../../types/reference";
import { useApi } from "@/api/api";

export const useProductMarquesService = () => {
  const api = useApi();
  const getAll = async (): Promise<marqueTypes[]> => {
    const response = await api.get("/stocks/marques");
    return response.data;
  }
  const getById = async (id: string | number): Promise<marqueTypes> => {
    const response = await api.get(`/stocks/marques/${id}`);
    return response.data; 
  }
  const create = async (data: Omit<marqueTypes, "id_marque">): Promise<marqueTypes> => {
    const response = await api.post("/stocks/marques", data);
    return response.data;
  }
  const update = async (id: string | number, data: marqueTypes): Promise<marqueTypes> => {
    alert(data.libelle_marque);
    const response = await api.put(`/stocks/marques/${id}`, data);
    alert(JSON.stringify(response.data));
    return response.data;
  }
  const remove = async (id: string | number): Promise<void> => {
    await api.delete(`/stocks/marques/${id}`);
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
  const api = useApi();
  const getAll = async (): Promise<categorieTypes[]> => {
      const response = await api.get("/stocks/categories");
    return response.data;
  }
  const getById = async (id: string | number): Promise<categorieTypes> => {
    const response = await api.get(`/stocks/categories/${id}`);
    return response.data; 
  }
  const create = async (data: Omit<categorieTypes, "id_categorie">): Promise<categorieTypes> => {
    console.log("Creating category with data:", data);
    const response = await api.post("/stocks/categories", data);
    return response.data;
  }
  const update = async (id: string | number, data: categorieTypes): Promise<categorieTypes> => {
    const response = await api.put(`/stocks/categories/${id}`, data);
    return response.data;
  }
  const remove = async (id: string | number): Promise<void> => {
    await api.delete(`/stocks/categories/${id}`);
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
  const api = useApi();
  const getAll = async (): Promise<modeleTypes[]> => {
    const response = await api.get("/stocks/modeles");
    return response.data;
  }
  const getById = async (id: string | number): Promise<modeleTypes> => {
    const response = await api.get(`/stocks/modeles/${id}`);
    return response.data; 
  }
  const create = async (data: Omit<modeleTypes, "id_modele">): Promise<modeleTypes> => {
    const response = await api.post("/stocks/modeles", data);
    return response.data;
  }
  const update = async (id: string | number, data: modeleTypes): Promise<modeleTypes> => {
    const response = await api.put(`/stocks/modeles/${id}`, data);
    return response.data;
  }
  const remove = async (id: string | number): Promise<void> => {
    await api.delete(`/stocks/modeles/${id}`);
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
  const api = useApi(); 
  const getAll = async (): Promise<familleTypes[]> => {
    const response = await api.get("/stocks/familles");
    return response.data;
  }
  const getById = async (id: string | number): Promise<familleTypes> => {
    const response = await api.get(`/stocks/familles/${id}`);
    return response.data; 
  }
  const create = async (data: Omit<familleTypes, "id_famille">): Promise<familleTypes> => {
    const response = await api.post("/stocks/familles", data);
    return response.data;
  }
  const update = async (id: string | number, data: familleTypes): Promise<familleTypes> => {
    const response = await api.put(`/stocks/familles/${id}`, data);
    return response.data;
  }
  const remove = async (id: string | number): Promise<void> => {
    await api.delete(`/stocks/familles/${id}`);
  }

  return {
    getAll,
    getById,
    create,
    update,
    delete: remove,
  };
};
export const  useProductTypeService = () => {
  const api = useApi(); 
  const getAll = async (): Promise<typeTypes[]> => {
    const response = await api.get("/stocks/types-produits");
    return response.data;
  }
  const getById = async (id: string | number): Promise<typeTypes> => {
    const response = await api.get(`/stocks/types-produits/${id}`);
    return response.data; 
  }
  const create = async (data: Omit<typeTypes, "id_type_produit">): Promise<typeTypes> => {
    const response = await api.post("/stocks/types-produits", data);
    return response.data;
  }
  const update = async (id: string | number, data: typeTypes): Promise<typeTypes> => {
    const response = await api.put(`/stocks/types-produits/${id}`, data);
    return response.data;
  }
  const remove = async (id: string | number): Promise<void> => {
    await api.delete(`/stocks/types-produits/${id}`);
  }

  return {
    getAll,
    getById,
    create,
    update,
    delete: remove,
  };
};