import { useCallback } from "react";
import { AxiosError } from "axios";
import { useApi } from "@/api/api";
import { Employe } from "../administration/types/interfaces";

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

  return {
    fetchEmployes,
    fetchEmployeById,
    fetchEmployesByFonction,
    fetchEmployesByStatut,
    updateEmploye,
  };
};
