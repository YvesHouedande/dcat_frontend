import { useCallback } from "react";
import { useApi } from "@/api/api";
import { PartenaireResponse, EntiteResponse } from "../administration/types/interfaces";

/**
 * Service commun pour les appels d'API fréquemment utilisés
 * Évite la duplication de code et centralise la logique commune
 */
export const useCommonApi = () => {
  const api = useApi();

  // Récupération des partenaires pour les formulaires (avec interlocuteurs)
  const fetchPartnersForForms = useCallback(
    async (): Promise<PartenaireResponse> => {
      const response = await api.get<PartenaireResponse>(
        "/administration/partenaires",
        {
          params: {
            page: 1,
            limit: 1000, // Récupérer tous les partenaires pour les formulaires
          },
        }
      );
      
      // Récupérer les interlocuteurs pour chaque partenaire de manière optimisée
      const partenairesWithInterlocuteurs = await Promise.all(
        response.data.data.map(async (partenaire) => {
          try {
            const interlocuteursResponse = await api.get(
              `/administration/interlocuteurs/partenaire/${partenaire.id_partenaire}`
            );
            return {
              ...partenaire,
              interlocuteurs: interlocuteursResponse.data || [],
            };
          } catch (error) {
            console.error(
              `Erreur lors de la récupération des interlocuteurs pour le partenaire ${partenaire.id_partenaire}:`,
              error
            );
            return {
              ...partenaire,
              interlocuteurs: [],
            };
          }
        })
      );

      return {
        data: partenairesWithInterlocuteurs,
        pagination: response.data.pagination,
      };
    },
    [api]
  );

  // Récupération des entités pour les formulaires
  const fetchEntitesForForms = useCallback(
    async (): Promise<EntiteResponse> => {
      const response = await api.get<EntiteResponse>(
        "/administration/entites",
        {
          params: {
            page: 1,
            limit: 1000, // Récupérer toutes les entités pour les formulaires
          },
        }
      );
      return response.data;
    },
    [api]
  );

  // Récupération des partenaires avec pagination (sans interlocuteurs)
  const fetchPartnersPaginated = useCallback(
    async (page: number, limit: number): Promise<PartenaireResponse> => {
      const safeLimit = Math.min(limit, 50); // Limite de sécurité
      
      const response = await api.get<PartenaireResponse>(
        "/administration/partenaires",
        {
          params: {
            page,
            limit: safeLimit,
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

  // Récupération des interlocuteurs d'un partenaire spécifique
  const fetchInterlocuteursByPartenaire = useCallback(
    async (idPartenaire: number) => {
      try {
        const response = await api.get(`/administration/interlocuteurs/partenaire/${idPartenaire}`);
        return response.data || [];
      } catch (error) {
        console.error(`Erreur lors de la récupération des interlocuteurs pour le partenaire ${idPartenaire}:`, error);
        return [];
      }
    },
    [api]
  );

  return {
    fetchPartnersForForms,
    fetchEntitesForForms,
    fetchPartnersPaginated,
    fetchInterlocuteursByPartenaire,
  };
};
