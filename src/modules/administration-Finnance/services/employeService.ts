import { useCallback } from "react";
import { AxiosError } from "axios";
import { useApi } from "@/api/api";
import { Employe, EmployeDocument } from "../administration/types/interfaces";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const useEmployesApi = () => {
  const api = useApi();

  const fetchEmployes = useCallback(async (): Promise<Employe[]> => {
    try {
      const response = await api.get(`${API_URL}/administration/employes`);

      const employes = response.data.data;
      if (!Array.isArray(employes)) {
        throw new Error("Format de données invalide");
      }

      const validEmployes = employes.filter((employe, index) => {
        const isValid =
          employe.id_employes &&
          (employe.nom_employes || employe.prenom_employes);
        if (!isValid) {
          console.warn(`Employé invalide à l'index ${index}:`, employe);
        }
        return isValid;
      });

      return validEmployes;
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error);
      if (error instanceof AxiosError) {
        console.error("Détails Axios:", {
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      throw error;
    }
  }, [api]);

  const fetchEmployeById = useCallback(async (id: number): Promise<Employe> => {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error("ID employé invalide");
    }

    try {
      const response = await api.get(`${API_URL}/administration/employes/${id}`);
      const employe = response.data;

      if (!employe?.id_employes) {
        throw new Error("Les données de l'employé sont invalides");
      }

      return {
        ...employe,
        nom_employes: employe.nom_employes || "",
        prenom_employes: employe.prenom_employes || "",
        email_employes: employe.email_employes || "",
        contact_employes: employe.contact_employes || "",
        adresse_employes: employe.adresse_employes || "",
        status_employes: employe.status_employes || "actif",
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        switch (status) {
          case 404:
            throw new Error("Employé non trouvé");
          case 400:
            throw new Error("ID employé invalide");
          case 500:
            throw new Error("Erreur serveur");
        }
      }
      throw error;
    }
  }, [api]);

  const fetchEmployesByFonction = useCallback(async (id_fonction: number): Promise<Employe[]> => {
    if (!id_fonction || isNaN(id_fonction) || id_fonction <= 0) {
      throw new Error("ID fonction invalide");
    }

    try {
      const response = await api.get(`${API_URL}/administration/employes/fonction/${id_fonction}`);
      if (!Array.isArray(response.data)) {
        throw new Error("Format de données invalide");
      }
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des employés par fonction:", error);
      throw error;
    }
  }, [api]);

  const fetchEmployesByStatut = useCallback(async (statut: string): Promise<Employe[]> => {
    if (!statut || typeof statut !== "string") {
      throw new Error("Statut invalide");
    }

    try {
      const response = await api.get(`${API_URL}/administration/employes/statut/${statut}`);
      if (!Array.isArray(response.data)) {
        throw new Error("Format de données invalide");
      }
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des employés par statut:", error);
      throw error;
    }
  }, [api]);

  const updateEmploye = useCallback(async (id: number, employeData: Partial<Employe>): Promise<Employe> => {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error("ID employé invalide");
    }

    if (!employeData || typeof employeData !== "object") {
      throw new Error("Données de mise à jour invalides");
    }

    try {
      const response = await api.put(`${API_URL}/administration/employes/${id}`, employeData);

      if (!response.data?.id_employes) {
        throw new Error("Les données mises à jour sont invalides");
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        switch (status) {
          case 404:
            throw new Error("Employé non trouvé");
          case 400:
            throw new Error("Données de mise à jour invalides");
          case 500:
            throw new Error("Erreur serveur lors de la mise à jour");
          default:
            throw new Error("Erreur lors de la mise à jour");
        }
      }
      throw error;
    }
  }, [api]);

  const uploadEmployePhoto = useCallback(async (id: number, photoFile: File): Promise<Employe> => {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error("ID employé invalide");
    }

    if (!photoFile || !(photoFile instanceof File)) {
      throw new Error("Fichier photo invalide");
    }

    try {
      const formData = new FormData();
      formData.append("photo", photoFile);

      console.log("Upload de photo pour l'employé:", id, "Fichier:", photoFile.name);
      
      // Essayer d'abord l'endpoint spécifique pour la photo
      let response;
      try {
        response = await api.post(`${API_URL}/administration/employes/${id}/photo`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (photoError) {
        console.warn("Erreur avec l'endpoint photo spécifique, tentative avec l'endpoint de mise à jour:", photoError);
        
        // Fallback: utiliser l'endpoint de mise à jour de l'employé
        const updateData = new FormData();
        updateData.append("photo", photoFile);
        
        response = await api.put(`${API_URL}/administration/employes/${id}`, updateData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      console.log("Réponse de l'upload de photo:", response.data);

      // L'API peut retourner différentes structures de réponse
      // Vérifier si c'est un message de succès ou les données de l'employé
      if (response.data?.message) {
        // Si c'est juste un message de succès, récupérer les données mises à jour de l'employé
        console.log("Message de succès reçu, récupération des données mises à jour");
        const updatedEmploye = await api.get(`${API_URL}/administration/employes/${id}`);
        return updatedEmploye.data;
      } else if (response.data?.id_employes) {
        // Si les données de l'employé sont directement retournées
        console.log("Données de l'employé directement retournées");
        return response.data;
      } else {
        // Si la réponse est différente, essayer de récupérer l'employé mis à jour
        console.log("Réponse différente, récupération des données mises à jour");
        const updatedEmploye = await api.get(`${API_URL}/administration/employes/${id}`);
        return updatedEmploye.data;
      }
    } catch (error) {
      console.error("Erreur lors de l'upload de photo:", error);
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        console.error("Status de l'erreur:", status, "Données:", error.response?.data);
        switch (status) {
          case 404:
            throw new Error("Employé non trouvé");
          case 400:
            throw new Error("Fichier photo invalide");
          case 413:
            throw new Error("Fichier trop volumineux");
          case 500:
            throw new Error("Erreur serveur lors de l'upload");
          default:
            throw new Error("Erreur lors de l'upload de la photo");
        }
      }
      throw error;
    }
  }, [api]);

  const fetchEmployeDocuments = useCallback(async (id: number, page: number = 1, limit: number = 10): Promise<{ data: EmployeDocument[]; total: number; page: number; limit: number }> => {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error("ID employé invalide");
    }

    try {
      const response = await api.get(`${API_URL}/administration/employes/${id}/documents?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        switch (status) {
          case 404:
            throw new Error("Employé non trouvé");
          case 500:
            throw new Error("Erreur serveur");
          default:
            throw new Error("Erreur lors de la récupération des documents");
        }
      }
      throw error;
    }
  }, [api]);

  return {
    fetchEmployes,
    fetchEmployeById,
    fetchEmployesByFonction,
    fetchEmployesByStatut,
    updateEmploye,
    uploadEmployePhoto,
    fetchEmployeDocuments,
  };
};
