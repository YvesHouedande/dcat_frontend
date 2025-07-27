// import { Interlocuteur, Partenaires, Entite, Projet } from '../administration/types/interfaces';
import {
  Interlocuteur,
  Partenaires,
  Entite,
  PartenaireResponse,
} from "../administration/types/interfaces";
import { useCallback } from "react";
import { useApi } from "@/api/api";

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
      const response = await api.get<PartenaireResponse>(
        "/administration/partenaires",
        {
          params: {
            page,
            limit,
          },
        }
      );
      const partenaires = response.data.data;
      const partenairesWithInterlocuteurs = await Promise.all(
        partenaires.map(async (partenaire: Partenaires) => {
          try {
            const interlocuteursResponse = await api.get(
              `/administration/interlocuteurs/partenaire/${partenaire.id_partenaire}`
            );
            return {
              ...partenaire,
              interlocuteurs: interlocuteursResponse.data,
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

      const partenaireWithInterlocuteurs = {
        data: partenairesWithInterlocuteurs,
        pagination: response.data.pagination,
      };

      return partenaireWithInterlocuteurs;
    },
    [api]
  );

  const fetchPartnerById = useCallback(
    async (id: string | number): Promise<Partenaires> => {
      const response = await api.get(`/administration/partenaires/${id}`);
      return response.data;
    },
    [api]
  );

  const addPartner = useCallback(
    async (
      partnerData: Omit<Partenaires, "id_partenaire">
    ): Promise<Partenaires> => {
      const response = await api.post(
        `/administration/partenaires`,
        partnerData
      );
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
    async (id: string | number): Promise<void> => {
      const response = await api.delete(`/administration/partenaires/${id}`);
      return response.data;
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

  // ENTITÉS
  const fetchEntites = useCallback(async (): Promise<Entite[]> => {
    const response = await api.get(`/administration/entites`);
    return response.data;
  }, [api]);

  const fetchEntiteById = useCallback(
    async (id: string | number): Promise<Entite> => {
      const response = await api.get(`/administration/entites/${id}`);
      return response.data;
    },
    [api]
  );

  const addEntite = useCallback(
    async (entite: { denomination: string }): Promise<Entite> => {
      const response = await api.post(`/administration/entites`, entite);
      return response.data;
    },
    [api]
  );

  const updateEntite = useCallback(
    async (
      id: string | number,
      entite: { denomination: string }
    ): Promise<Entite> => {
      const response = await api.put(`/administration/entites/${id}`, entite);
      return response.data;
    },
    [api]
  );

  const deleteEntite = useCallback(
    async (id: number): Promise<void> => {
      const response = await api.delete(`/administration/entites/${id}`);
      return response.data;
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

    // Entité
    fetchEntites,
    fetchEntiteById,
    addEntite,
    updateEntite,
    deleteEntite,

    // Intervention
    fetchInterventionsByPartenaire,
  };
};
