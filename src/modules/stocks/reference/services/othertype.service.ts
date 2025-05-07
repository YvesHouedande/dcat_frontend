import { categorieTypes, familleTypes, marqueTypes, modeleTypes } from "../../types/reference";


export const productBrands = {
  getAll: async (): Promise<marqueTypes[]> => {
    // const response = await api.get("/deliveries");
      // Marques pour le filtre
      const productBrands: marqueTypes[] = [
        { id: 1, libelle_marque: "Marque 05" },
        { id: 2, libelle_marque: "Marque 08" },
        { id: 3, libelle_marque: "Marque 12" },
        { id: 4, libelle_marque: "Marque 07" },
        { id: 5, libelle_marque: "Marque 09" },
        { id: 6, libelle_marque: "Marque 03" },
      ];
    // return response.data;
    return productBrands;
  }
};

export const productCategories = {
  getAll: async (): Promise<categorieTypes[]> => {
    // const response = await api.get("/deliveries");
      const productCategories: categorieTypes[] = [
        { id: 1, libelle_categorie: "Informatique" },
        { id: 2, libelle_categorie: "Bureautique" },
        { id: 3, libelle_categorie: "Périphériques" },
        { id: 4, libelle_categorie: "Stockage" },
        { id: 5, libelle_categorie: "Audio" },
        { id: 6, libelle_categorie: "Graphisme" },
        { id: 7, libelle_categorie: "Réseau" },
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
       { id: 1, libelle_modele: "Modèle 123" },
       { id: 2, libelle_modele: "Modèle 456" },
       { id: 3, libelle_modele: "Modèle 789" },
       { id: 4, libelle_modele: "Modèle 012" },
       { id: 5, libelle_modele: "Modèle 345" },
       { id: 6, libelle_modele: "Modèle 678" },
       { id: 7, libelle_modele: "Modèle 901" },
       { id: 8, libelle_modele: "Modèle 234" },
     ];
   
    // return response.data;
    return  productModels;
  }
};

export const  productFamilies = {
  getAll: async (): Promise<familleTypes[]> => {
    // const response = await api.get("/deliveries");
   
    const productFamilies: familleTypes[] = [
        { id: 1, libelle_famille: "Laptop" },
        { id: 2, libelle_famille: "Moniteur" },
        { id: 3, libelle_famille: "Accessoires PC" },
        { id: 4, libelle_famille: "Imprimante" },
        { id: 5, libelle_famille: "Externe" },
        { id: 6, libelle_famille: "Networking" },
        { id: 7, libelle_famille: "Casque audio" },
        { id: 8, libelle_famille: "Création numérique" },
        { id: 9, libelle_famille: "Connectivité" },
      ];
    // return response.data;
    return  productFamilies;
  }
};