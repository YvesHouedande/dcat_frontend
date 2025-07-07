import { categorieTypes, familleTypes, marqueTypes, modeleTypes } from "@/modules/stocks/types/reference";



export const productBrands = {
  getAll: async (): Promise<marqueTypes[]> => {
    // const response = await api.get("/deliveries");
      // Marques pour le filtre
      const productBrands: marqueTypes[] = [
        
      ];
    // return response.data;
    return productBrands;
  }
};

export const productCategories = {
  getAll: async (): Promise<categorieTypes[]> => {
    // const response = await api.get("/deliveries");
      const productCategories: categorieTypes[] = [
        
      ];
    // return response.data;
    return productCategories;
  }
};



export const  productModels = {
  getAll: async (): Promise<modeleTypes[]> => {
    // const response = await api.get("/deliveries");
   
     // Modèles pour le filtre
     const productModels: modeleTypes[] = [
      
     ];
   
    // return response.data;
    return  productModels;
  }
};

export const  productFamilies = {
  getAll: async (): Promise<familleTypes[]> => {
    // const response = await api.get("/deliveries");
   
    const productFamilies: familleTypes[] = [
       
      ];
    // return response.data;
    return  productFamilies;
  }
};