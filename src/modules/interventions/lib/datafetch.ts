<<<<<<< HEAD
=======

>>>>>>> 9ef29a9 (jjk)
import { apiClient } from "@/api/api";
import { FicheInterventionFormValues } from "../types/data";
export const getUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

<<<<<<< HEAD
export const getPartenaires = async () => {
  const response = await apiClient.get("/partenaire");
  return response.data;
};

export const getProduits = async () => {
  const response = await apiClient.get("/produits");
  return response.data;
};

export const createFileIntervention = async (
  interventionData: FicheInterventionFormValues
) => {
  const response = await apiClient.post("/FileIntervention", interventionData);
  return response.data;
};

export const getInterventions = async (id?: string | number) => {
  const response = await apiClient.get("/Interventions", {
    params: {
      id: id,
    },
  });
  return response.data;
};
=======

export const getPartenaires = async () => {
    const response = await apiClient.get("/partenaire");
    return response.data;
  };
 
  
  export const getProduits = async () => {
    const response = await apiClient.get("/produits");
    return response.data;
  };


  export const createFileIntervention = async (interventionData: FicheInterventionFormValues) => {
    const response = await apiClient.post("/FileIntervention", interventionData);
    return response.data;
  };



  export const  getInterventions = async () => {
    const response = await apiClient.get("/Interventions");
    return response.data;
  };
  
>>>>>>> 9ef29a9 (jjk)
