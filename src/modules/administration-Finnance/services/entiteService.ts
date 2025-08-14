import { Entite, EntiteResponse } from "../administration/types/interfaces";
import { useCallback } from "react";
import { useApi } from "@/api/api";

export const useEntiteApi = () => {
  const api = useApi();

  // Récupérer toutes les entités
  const fetchEntites = useCallback(async (): Promise<Entite[]> => {
    const response = await api.get<EntiteResponse>("/administration/entites");
    return response.data.data;
  }, [api]);

  // Récupérer une entité par ID
  const fetchEntiteById = useCallback(
    async (id: string | number): Promise<Entite> => {
      const response = await api.get<Entite>(`/administration/entites/${id}`);
      console.log(response.data);
      return response.data;
    },
    [api]
  );

  // Créer une nouvelle entité
  const addEntite = useCallback(
    async (entite: {
      denomination: string;
      abreviation_nom?: string;
      contact?: string;
      adresse_postal?: string;
      localisation?: string;
      id_partenaire?: number;
    }): Promise<Entite> => {
      const response = await api.post<Entite>(
        "/administration/entites",
        entite
      );
      return response.data;
    },
    [api]
  );

  // Mettre à jour une entité
  const updateEntite = useCallback(
    async (
      id: string | number,
      entite: {
        denomination?: string;
        abreviation_nom?: string;
        contact?: string;
        adresse_postal?: string;
        localisation?: string;
        id_partenaire?: number;
      }
    ): Promise<Entite> => {
      const response = await api.put<Entite>(
        `/administration/entites/${id}`,
        entite
      );
      return response.data;
    },
    [api]
  );

  // Supprimer une entité
  const deleteEntite = useCallback(
    async (id: number): Promise<{ success: boolean; message: string; deletedId?: number }> => {
      try {
        return {
          success: true,
          message: "Entité supprimée avec succès",
          deletedId: id
        };
      } catch (error: unknown) {
        console.error("Erreur lors de la suppression de l'entité:", error);
        
        // Vérifier si c'est une erreur de contrainte de clé étrangère
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string; details?: string } } };
          const errorMessage = axiosError.response?.data?.message || "";
          const errorDetails = axiosError.response?.data?.details || "";
          
          // Détecter les erreurs de contrainte de clé étrangère
          if (errorMessage.includes("foreign key") || 
              errorDetails.includes("foreign key") ||
              errorMessage.includes("contrainte") ||
              errorDetails.includes("contrainte") ||
              errorMessage.includes("contrat") ||
              errorDetails.includes("contrat")) {
            return {
              success: false,
              message: "Cette entité est liée à un ou plusieurs contrats. Veuillez d'abord dissocier l'entité des contrats avant de la supprimer."
            };
          }
        }
        
        return {
          success: false,
          message: "Echec de la suppression de l'entité. Vérifiez que l'entité n'est pas liée à un ou plusieurs contrats."
        };
      }
    },
    [api]
  );

  // Récupérer les entités d'un partenaire
  const fetchEntitesByPartenaire = useCallback(
    async (id_partenaire: number): Promise<Entite[]> => {
      const response = await api.get<Entite[]>(
        `/administration/entites/partenaire/${id_partenaire}`
      );
      return response.data;
    },
    [api]
  );

  return {
    fetchEntites,
    fetchEntiteById,
    addEntite,
    updateEntite,
    deleteEntite,
    fetchEntitesByPartenaire,
  };
};
