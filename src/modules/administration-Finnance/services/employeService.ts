import { useCallback } from "react";
import { AxiosError } from "axios";
import { useApi } from "@/api/api";
import { Employe, EmployeDocument, NatureDocument } from "../administration/types/interfaces";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const useEmployesApi = () => {
  const api = useApi();

  const fetchEmployes = useCallback(async (page: number = 1, limit: number = 10): Promise<{ data: Employe[], pagination: { total: number; page: number; limit: number; totalPages: number } }> => {
    try {
      const response = await api.get(`${API_URL}/administration/employes`, {
        params: { page, limit }
      });

      const employes = response.data.data;
      const pagination = response.data.pagination;
      
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

      return { data: validEmployes, pagination };
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

  const deleteEmploye = useCallback(async (id: number): Promise<void> => {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error("ID employé invalide");
    }

    try {
      await api.delete(`${API_URL}/administration/employes/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        switch (status) {
          case 404:
            throw new Error("Employé non trouvé");
          case 400:
            throw new Error("Impossible de supprimer cet employé");
          case 403:
            throw new Error("Vous n'avez pas les permissions pour supprimer cet employé");
          case 500:
            throw new Error("Erreur serveur lors de la suppression");
          default:
            throw new Error("Erreur lors de la suppression de l'employé");
        }
      }
      throw error;
    }
  }, [api]);

  // ===== GESTION DES DOCUMENTS EMPLOYÉS =====

  /**
   * Ajouter un document à un employé
   */
  const addDocumentToEmploye = useCallback(async (
    employeId: number,
    documentData: {
      file: File;
      libelle_document: string;
      id_nature_document: number;
      etat_document?: string;
      classification?: string;
      id_dossier?: number;
    }
  ): Promise<EmployeDocument> => {
    try {
      const formData = new FormData();
      formData.append("document", documentData.file);
      formData.append("libelle_document", documentData.libelle_document);
      formData.append("id_nature_document", documentData.id_nature_document.toString());
      
      // Ajouter la classification si elle existe
      if (documentData.classification) {
        formData.append("classification_document", documentData.classification);
      }
      
      if (documentData.id_dossier) {
        formData.append("id_dossier", documentData.id_dossier.toString());
      }
      
      // Ajouter l'état du document s'il existe
      if (documentData.etat_document) {
        formData.append("etat_document", documentData.etat_document);
      }

      console.log("Upload document to employe:", {
        employeId,
        fileName: documentData.file.name,
        fileSize: documentData.file.size,
        formDataKeys: Array.from(formData.keys()),
        id_dossier: documentData.id_dossier
      });

      const response = await api.post<{ success: boolean; message: string; data: EmployeDocument }>(
        `${API_URL}/administration/employes/${employeId}/doc`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      throw error;
    }
  }, [api]);

  /**
   * Récupérer les documents d'un employé
   */
  const fetchDocumentsByEmploye = useCallback(async (employeId: number): Promise<EmployeDocument[]> => {
    try {
      const response = await api.get<{ data: EmployeDocument[] }>(
        `${API_URL}/administration/employes/${employeId}/documents`
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        // Si l'erreur est 404, cela signifie qu'il n'y a pas de documents
        // Retourner un tableau vide au lieu de lever une erreur
        if (status === 404) {
          console.log(`Aucun document trouvé pour l'employé ${employeId}`);
          return [];
        }
      }
      console.error("Erreur lors de la récupération des documents:", error);
      throw error;
    }
  }, [api]);

  /**
   * Supprimer un document d'un employé
   */
  const deleteDocumentFromEmploye = useCallback(async (employeId: number, documentId: number): Promise<void> => {
    try {
      await api.delete(`${API_URL}/administration/employes/${employeId}/doc/${documentId}`);
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      throw error;
    }
  }, [api]);

  // ===== GESTION DES NATURES DE DOCUMENTS =====

  /**
   * Récupérer toutes les natures de documents
   */
  const fetchNatures = useCallback(async (): Promise<Array<{ id: number; libelle: string }>> => {
    try {
      console.log("🌐 Appel API fetchNatures vers:", `${API_URL}/administration/natures/`);
      const response = await api.get(`${API_URL}/administration/natures/`);
      console.log("✅ Réponse API fetchNatures:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des natures:", error);
      throw error;
    }
  }, [api]);

  const fetchNatureDocumentById = useCallback(async (id: string): Promise<NatureDocument> => {
    const response = await api.get(`${API_URL}/administration/natures/${id}`);
    return response.data;
  }, [api]);

  /**
   * Créer une nouvelle nature
   */
  const createNature = useCallback(async (libelle: string): Promise<{ id: number; libelle: string }> => {
    try {
      const response = await api.post(`${API_URL}/administration/natures/`, {
        libelle
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la nature:", error);
      throw error;
    }
  }, [api]);

  /**
   * Mettre à jour une nature
   */
  const updateNature = useCallback(async (id: number, libelle: string): Promise<{ id: number; libelle: string }> => {
    try {
      const response = await api.put(`${API_URL}/administration/natures/${id}`, {
        libelle
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la nature:", error);
      throw error;
    }
  }, [api]);

  /**
   * Supprimer une nature
   */
  const deleteNature = useCallback(async (id: number): Promise<void> => {
    try {
      await api.delete(`${API_URL}/administration/natures/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        
        switch (status) {
          case 400:
            if (message.includes("utilisé") || message.includes("used") || message.includes("contrainte")) {
              throw new Error("Cette nature ne peut pas être supprimée car elle est utilisée par des documents existants.");
            }
            throw new Error("Impossible de supprimer cette nature");
          case 404:
            throw new Error("Nature non trouvée");
          case 403:
            throw new Error("Vous n'avez pas les permissions pour supprimer cette nature");
          case 500:
            throw new Error("Cette nature ne peut pas être supprimée car elle est utilisée par des documents existants.");
       
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
    deleteEmploye,
    addDocumentToEmploye,
    fetchDocumentsByEmploye,
    deleteDocumentFromEmploye,
    fetchNatures,
    fetchNatureDocumentById,
    createNature,
    updateNature,
    deleteNature,
  };
};
