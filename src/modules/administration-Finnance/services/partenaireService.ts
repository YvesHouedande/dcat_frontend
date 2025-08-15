// import { Interlocuteur, Partenaires, Entite, Projet } from '../administration/types/interfaces';
import {
  Interlocuteur,
  Partenaires,
  PartenaireResponse,
} from "../administration/types/interfaces";
import { useCallback } from "react";
import { useApi } from "@/api/api";
import axios from "axios";

// Services pour les projets
// export const fetchProjetsByPartenaire = async (id_partenaire: number): Promise<Projet[]> => {
//   try {
//     const response = await axios.get(`${API_URL}/administration/projets/partenaire/${id_partenaire}`);
//     return response.data;
//   } catch (error) {
//     console.error('Erreur lors de la récupération des projets:', error);
//     // Si l'endpoint n'existe pas (404) ou autre erreur, retourner un tableau vide
//     // pour ne pas bloquer l'affichage du reste du profil
//     return [];
//   }
// };

// Type pour la réponse d'une intervention liée à un partenaire
export interface TypeInterventionPartenaire {
  intervention: {
    id_intervention: number;
    date_intervention: string;
    cause_defaillance: string;
    rapport_intervention: string;
    type_intervention: string;
    type_defaillance: string;
    id_partenaire: number;
    id_contrat: number;
  };
  partenaire: {
    id_partenaire: number;
    nom_partenaire: string;
  };
  contrat: {
    id_contrat: number;
    nom_contrat: string;
    duree_contrat: string;
    date_debut: string;
    date_fin: string;
    reference: string;
    type_de_contrat: string;
    statut: string;
  };
  employes: Array<{
    id_employes: number;
    nom_employes: string;
    prenom_employes: string;
  }>;
}

// src/modules/administration/hooks/usePartenaireApi.ts
// Ton hook personnalisé

export const usePartenaireApi = () => {
  const api = useApi();

  // PARTENAIRES
  const fetchPartners = useCallback(
    async (page: number, limit: number): Promise<PartenaireResponse> => {
      // Limite de sécurité pour éviter les boucles infinies
      const safeLimit = Math.min(limit, 50);
      
      const response = await api.get<PartenaireResponse>(
        "/administration/partenaires",
        {
          params: {
            page,
            limit: safeLimit,
          },
        }
      );
      const partenaires = response.data.data;
      
      // Par défaut, utiliser la version sans interlocuteurs pour éviter les erreurs de ressources
      // et les boucles infinies
      const partenairesWithEmptyInterlocuteurs = partenaires.map(partenaire => ({
        ...partenaire,
        interlocuteurs: [],
      }));
      
      return {
        data: partenairesWithEmptyInterlocuteurs,
        pagination: response.data.pagination,
      };
    },
    [api]
  );

  // Version optimisée sans interlocuteurs pour éviter les erreurs de ressources
  const fetchPartnersWithoutInterlocuteurs = useCallback(
    async (page: number, limit: number): Promise<PartenaireResponse> => {
      const response = await api.get<PartenaireResponse>(
        "/administration/partenaires",
        {
          params: {
            page,
            limit,
          },
        }
      );
      
      // Ajouter un tableau vide d'interlocuteurs pour maintenir la compatibilité
      const partenairesWithEmptyInterlocuteurs = response.data.data.map(partenaire => ({
        ...partenaire,
        interlocuteurs: [],
      }));

      return {
        data: partenairesWithEmptyInterlocuteurs,
        pagination: response.data.pagination,
      };
    },
    [api]
  );

  // Fonction spéciale pour récupérer tous les partenaires pour les formulaires
  // Utilise maintenant le service commun pour éviter la duplication
  const fetchAllPartnersForForms = useCallback(
    async (): Promise<PartenaireResponse> => {
      const response = await api.get<PartenaireResponse>(
        "/administration/partenaires",
        {
          params: {
            page: 1,
            limit: 1000, // Récupérer tous les partenaires
          },
        }
      );
      
      // Ajouter un tableau vide d'interlocuteurs pour maintenir la compatibilité
      const partenairesWithEmptyInterlocuteurs = response.data.data.map(partenaire => ({
        ...partenaire,
        interlocuteurs: [],
      }));

      return {
        data: partenairesWithEmptyInterlocuteurs,
        pagination: response.data.pagination,
      };
    },
    [api]
  );

  // Fonction pour récupérer les interlocuteurs en batch avec gestion d'erreur
  const fetchInterlocuteursBatch = useCallback(
    async (partenaireIds: number[]): Promise<Record<number, Interlocuteur[]>> => {
      const interlocuteursMap: Record<number, Interlocuteur[]> = {};
      
      for (let i = 0; i < partenaireIds.length; i++) {
        const partenaireId = partenaireIds[i];
        try {
          const response = await api.get(`/administration/interlocuteurs/partenaire/${partenaireId}`);
          interlocuteursMap[partenaireId] = response.data || [];
        } catch (error) {
          console.error(`Erreur lors de la récupération des interlocuteurs pour le partenaire ${partenaireId}:`, error);
          interlocuteursMap[partenaireId] = [];
        }
        
        // Délai progressif pour éviter la surcharge
        const delay = Math.min(50 + (i * 10), 200);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      return interlocuteursMap;
    },
    [api]
  );

  const fetchPartnerById = useCallback(
    async (id: string | number): Promise<Partenaires> => {
      console.log("fetchPartnerById - Récupération du partenaire ID:", id);
      const response = await api.get(`/administration/partenaires/${id}`);
      console.log("fetchPartnerById - Réponse du backend:", response.data);
      console.log("fetchPartnerById - id_entite dans la réponse:", response.data?.id_entite);
      
      // S'assurer que l'id_entite est défini
      const partenaire = response.data;
      if (partenaire && partenaire.id_entite === undefined) {
        partenaire.id_entite = null; // ou 0 selon votre logique métier
      }
      
      return partenaire;
    },
    [api]
  );

  const addPartner = useCallback(
    async (
      partnerData: Omit<Partenaires, "id_partenaire">
    ): Promise<Partenaires> => {
      console.log("addPartner - Données envoyées au backend:", partnerData);
      console.log("addPartner - id_entite envoyé:", partnerData.id_entite);
      const response = await api.post(
        `/administration/partenaires`,
        partnerData
      );
      console.log("addPartner - Réponse du backend:", response.data);
      return response.data;
    },
    [api]
  );

  const updatePartner = useCallback(
    async (
      id: string | number,
      partnerData: Partial<Partenaires>
    ): Promise<Partenaires> => {
      const response = await api.put(
        `/administration/partenaires/${id}`,
        partnerData
      );
      return response.data;
    },
    [api]
  );

  const deletePartner = useCallback(
    async (id: string | number): Promise<{ success: boolean; message: string; deletedId: number }> => {
      try {
        console.log(`[API] Suppression du partenaire ${id} avec ses interlocuteurs...`);
        
        // 1. Récupérer tous les interlocuteurs du partenaire
        const interlocuteursResponse = await api.get(`/administration/interlocuteurs/partenaire/${id}`);
        const interlocuteurs = interlocuteursResponse.data;
        console.log(`[API] ${interlocuteurs.length} interlocuteur(s) trouvé(s) pour le partenaire ${id}`);
        
        // 2. Supprimer tous les interlocuteurs du partenaire
        if (interlocuteurs.length > 0) {
          console.log(`[API] Suppression des ${interlocuteurs.length} interlocuteur(s)...`);
          await Promise.all(
            interlocuteurs.map(async (interlocuteur: Interlocuteur) => {
              try {
                await api.delete(`/administration/interlocuteurs/${interlocuteur.id_interlocuteur}`);
                console.log(`[API] ✓ Interlocuteur ${interlocuteur.id_interlocuteur} supprimé`);
              } catch (error) {
                console.error(`[API] Erreur lors de la suppression de l'interlocuteur ${interlocuteur.id_interlocuteur}:`, error);
                throw error;
              }
            })
          );
          console.log(`[API] ✓ Tous les interlocuteurs supprimés`);
        }
        
        // 3. Maintenant supprimer le partenaire
        console.log(`[API] Suppression du partenaire ${id}...`);
        const response = await api.delete(`/administration/partenaires/${id}`);
        const apiResponse = response.data;
        
        if (!apiResponse.success) {
          throw new Error(
            apiResponse.message || "Erreur lors de la suppression du partenaire"
          );
        }
        
        const result = {
          success: true,
          message: interlocuteurs.length > 0 
            ? `Partenaire et ${interlocuteurs.length} interlocuteur(s) supprimé(s) avec succès`
            : apiResponse.message || "Partenaire supprimé avec succès",
          deletedId: apiResponse.data?.id || Number(id),
        };
        console.log(`[API] ✓ Partenaire ${id} supprimé avec succès.`);
        return result;
      } catch (error: unknown) {
        console.error(`[API] Erreur lors de la suppression du partenaire ${id}:`, error);
        if (axios.isAxiosError(error) && (error.response?.status === 409 || error.response?.data?.message?.includes('foreign key'))) {
          return {
            success: false,
            message: "Ce partenaire ne peut pas être supprimé pour le moment. Veuillez d'abord le dissocier de toutes les entités qui lui sont liées.",
            deletedId: Number(id),
          };
        }
        return {
          success: false,
          message: (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error as Error)?.message || "Une erreur inattendue est survenue lors de la suppression du partenaire.",
          deletedId: Number(id),
        };
      }
    },
    [api]
  );

  // INTERLOCUTEURS
  const fetchInterlocuteursByPartenaire = useCallback(
    async (id: number): Promise<Interlocuteur[]> => {
      const response = await api.get(
        `/administration/interlocuteurs/partenaire/${id}`
      );
      return response.data;
    },
    [api]
  );

  const fetchInterlocuteurById = useCallback(
    async (id: number): Promise<Interlocuteur> => {
      const response = await api.get(`/administration/interlocuteurs/${id}`);
      return response.data;
    },
    [api]
  );

  const addInterlocuteur = useCallback(
    async (
      interlocuteur: Omit<Interlocuteur, "id_interlocuteur">
    ): Promise<Interlocuteur> => {
      const formattedData = {
        nom_interlocuteur: interlocuteur.nom_interlocuteur,
        prenom_interlocuteur: interlocuteur.prenom_interlocuteur,
        contact_interlocuteur: interlocuteur.contact_interlocuteur,
        email_interlocuteur: interlocuteur.email_interlocuteur,
        fonction_interlocuteur: interlocuteur.fonction_interlocuteur,
        id_partenaire: interlocuteur.id_partenaire,
      };
      const response = await api.post(
        `/administration/interlocuteurs`,
        formattedData
      );
      return response.data;
    },
    [api]
  );

  const updateInterlocuteur = useCallback(
    async (
      id: number,
      interlocuteur: Partial<Interlocuteur>
    ): Promise<Interlocuteur> => {
      const formattedData = {
        nom_interlocuteur: interlocuteur.nom_interlocuteur,
        prenom_interlocuteur: interlocuteur.prenom_interlocuteur,
        contact_interlocuteur: interlocuteur.contact_interlocuteur,
        email_interlocuteur: interlocuteur.email_interlocuteur,
        fonction_interlocuteur: interlocuteur.fonction_interlocuteur,
        id_partenaire: interlocuteur.id_partenaire,
      };
      const response = await api.put(
        `/administration/interlocuteurs/${id}`,
        formattedData
      );
      return response.data;
    },
    [api]
  );

  const deleteInterlocuteur = useCallback(
    async (id: number): Promise<void> => {
      const response = await api.delete(`/administration/interlocuteurs/${id}`);
      return response.data;
    },
    [api]
  );

  const addMultipleInterlocuteurs = useCallback(
    async (
      interlocuteurs: Omit<
        Interlocuteur,
        "id_interlocuteur" | "id_partenaire"
      >[],
      id_partenaire: number
    ): Promise<Interlocuteur[]> => {
      const responses = await Promise.all(
        interlocuteurs.map((interlocuteur) => {
          // Formatage des données pour chaque interlocuteur
          const formattedData = {
            nom_interlocuteur: interlocuteur.nom_interlocuteur,
            prenom_interlocuteur: interlocuteur.prenom_interlocuteur,
            contact_interlocuteur: interlocuteur.contact_interlocuteur,
            email_interlocuteur: interlocuteur.email_interlocuteur,
            fonction_interlocuteur: interlocuteur.fonction_interlocuteur,
            id_partenaire,
          };

          const response = api.post(
            `/administration/interlocuteurs`,
            formattedData
          );
          return response.then((res) => res.data);
        })
      );
      return responses.map((response) => response.data);
    },
    [api]
  );

  // Récupérer les partenaires par type (pour le filtrage)
  const fetchPartnersByType = useCallback(
    async (type: string): Promise<PartenaireResponse> => {
      try {
        const response = await api.get<PartenaireResponse>(
          `/administration/partenaires/type/${encodeURIComponent(type)}`
        );
        
        // Retourner les partenaires sans interlocuteurs pour éviter les erreurs de ressources
        const partenairesWithoutInterlocuteurs = response.data.data.map(partenaire => ({
          ...partenaire,
          interlocuteurs: [],
        }));

        return {
          data: partenairesWithoutInterlocuteurs,
          pagination: response.data.pagination,
        };
      } catch (error) {
        console.error(`Erreur lors de la récupération des partenaires de type ${type}:`, error);
        // En cas d'erreur, retourner un tableau vide
        return {
          data: [],
          pagination: {
            page: 1,
            limit: 0,
            total: 0,
            totalPages: 0,
          },
        };
      }
    },
    [api]
  );



  // INTERVENTIONS
  const fetchInterventionsByPartenaire = useCallback(
    async (id_partenaire: number) => {
      const response = await api.get(
        `/technique/interventions/partenaire/${id_partenaire}`
      );
      return response.data;
    },
    [api]
  );

  return {
    // Partenaire
    fetchPartners,
    fetchPartnersWithoutInterlocuteurs,
    fetchAllPartnersForForms,
    fetchInterlocuteursBatch,
    fetchPartnersByType,
    fetchPartnerById,
    addPartner,
    updatePartner,
    deletePartner,

    // Interlocuteur
    fetchInterlocuteursByPartenaire,
    fetchInterlocuteurById,
    addInterlocuteur,
    updateInterlocuteur,
    deleteInterlocuteur,
    addMultipleInterlocuteurs,



    // Intervention
    fetchInterventionsByPartenaire,
  };
};
