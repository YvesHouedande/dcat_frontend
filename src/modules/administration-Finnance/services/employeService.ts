import axios, { AxiosError } from 'axios';
import { Employe } from '../administration/types/interfaces';

const API_URL = import.meta.env.VITE_APP_API_URL;

// Récupérer tous les employés
export const fetchEmployes = async (): Promise<Employe[]> => {
  try {
    const response = await axios.get(`${API_URL}/administration/employes`);
    
    if (!response.data) {
      throw new Error("Aucune donnée reçue de l'API");
    }
    
    // Valider et filtrer les employés
    const employes = response.data;
    if (!Array.isArray(employes)) {
      throw new Error("Format de données invalide");
    }

    // Filtrer les employés valides et logger les invalides
    const validEmployes = employes.filter((employe, index) => {
      const isValid = employe.id_employes && 
                     (employe.nom_employes || employe.prenom_employes); // Au moins un nom ou prénom requis
      
      if (!isValid) {
        console.warn(`Employé invalide ou incomplet à l'index ${index}:`, employe);
      }
      
      return isValid;
    });

    if (validEmployes.length === 0) {
      console.warn("Aucun employé valide trouvé dans les données");
    } else if (validEmployes.length < employes.length) {
      console.warn(`${employes.length - validEmployes.length} employé(s) filtré(s) car invalides ou incomplets`);
    }
    
    return validEmployes;
  } catch (error) {
    console.error("Erreur lors de la récupération des employés:", error);
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

// Récupérer un employé par ID
export const fetchEmployeById = async (id: number): Promise<Employe> => {
  if (!id || isNaN(id) || id <= 0) {
    throw new Error("ID employé invalide");
  }

  try {
    const response = await axios.get(`${API_URL}/administration/employes/${id}`);
    
    if (!response.data) {
      throw new Error("Employé non trouvé");
    }

    const employe = response.data;
    
    // Validation moins stricte pour un employé individuel
    if (!employe.id_employes) {
      throw new Error("Les données de l'employé sont invalides (ID manquant)");
    }

    // Compléter les champs manquants avec des valeurs par défaut
    return {
      ...employe,
      nom_employes: employe.nom_employes || '',
      prenom_employes: employe.prenom_employes || '',
      email_employes: employe.email_employes || '',
      contact_employes: employe.contact_employes || '',
      adresse_employes: employe.adresse_employes || '',
      status_employes: employe.status_employes || 'actif',
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Erreur API détaillée:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });

      switch (error.response?.status) {
        case 404:
          throw new Error("Employé non trouvé");
        case 400:
          throw new Error("ID employé invalide");
        case 500:
          throw new Error("Erreur serveur lors de la récupération de l'employé");
        default:
          throw new Error("Erreur lors de la récupération de l'employé");
      }
    }
    throw error;
  }
};

// Récupérer les employés par fonction
export const fetchEmployesByFonction = async (id_fonction: number): Promise<Employe[]> => {
  if (!id_fonction || isNaN(id_fonction) || id_fonction <= 0) {
    throw new Error("ID fonction invalide");
  }

  try {
    const response = await axios.get(`${API_URL}/administration/employes/fonction/${id_fonction}`);
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Format de données invalide");
    }

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des employés par fonction:", error);
    throw error;
  }
};

// Récupérer les employés par statut
export const fetchEmployesByStatut = async (statut: string): Promise<Employe[]> => {
  if (!statut || typeof statut !== 'string') {
    throw new Error("Statut invalide");
  }

  try {
    const response = await axios.get(`${API_URL}/administration/employes/statut/${statut}`);
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Format de données invalide");
    }

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des employés par statut:", error);
    throw error;
  }
};

// Mettre à jour un employé
export const updateEmploye = async (id: number, employeData: Partial<Employe>): Promise<Employe> => {
  if (!id || isNaN(id) || id <= 0) {
    throw new Error("ID employé invalide");
  }

  if (!employeData || typeof employeData !== 'object') {
    throw new Error("Données de mise à jour invalides");
  }

  try {
    const response = await axios.put(`${API_URL}/administration/employes/${id}`, employeData);
    
    if (!response.data || !response.data.id_employes) {
      throw new Error("Les données mises à jour sont invalides");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      switch (error.response?.status) {
        case 404:
          throw new Error("Employé non trouvé");
        case 400:
          throw new Error("Données de mise à jour invalides");
        case 500:
          throw new Error("Erreur serveur lors de la mise à jour");
        default:
          throw new Error("Erreur lors de la mise à jour de l'employé");
      }
    }
    throw error;
  }
};
