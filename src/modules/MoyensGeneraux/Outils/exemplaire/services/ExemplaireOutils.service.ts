// src/services/ExemplaireProduitService.ts
import { useApi } from "@/api/api";
import {
  PaginatedResponse,
  PaginationParams,
  ExemplaireProduit,
} from "../types";
// import { OutilEntreeType } from "../../types/OutilsType";
import {
  OutilMovement,
  OutilStatistiques,
  OutilEtat,
  ExemplaireSortieFormValues,
} from "../../sorties/types";

export const ExemplaireOutilsService = () => {
  const api = useApi();
  // const prod = [
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 1,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 13,
  //     id_employes: 12,
  //     but_usage: "Réparation d'urgence",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site A",
  //     commentaire: "Doit être ramené demain",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 2,
  //     id_employes: 15,
  //     but_usage: "Installation temporaire",
  //     etat_avant: "endommage",
  //     date_de_sortie: "2025-05-01",
  //     site_intervention: "Site B",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 3,
  //     id_employes: 7,
  //     but_usage: "Inspection périodique",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-04-28",
  //     site_intervention: "Entrepôt Nord",
  //     commentaire: "",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 4,
  //     id_employes: 3,
  //     but_usage: "Test de performance",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-02",
  //     site_intervention: "Site C",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 5,
  //     id_employes: 18,
  //     but_usage: "Remplacement provisoire",
  //     etat_avant: "endommage",
  //     date_de_sortie: "2025-04-30",
  //     site_intervention: "Unité mobile 1",
  //     commentaire: "Remplacé par un outil neuf",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 6,
  //     id_employes: 22,
  //     but_usage: "Mission de dépannage",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-04-29",
  //     site_intervention: "Atelier Central",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 7,
  //     id_employes: 5,
  //     but_usage: "Diagnostic réseau",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-03",
  //     site_intervention: "Site D",
  //     commentaire: "Besoin d'une rallonge",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 8,
  //     id_employes: 11,
  //     but_usage: "Essai de nouvel équipement",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-05-01",
  //     site_intervention: "Salle Test",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 9,
  //     id_employes: 19,
  //     but_usage: "Utilisation pour formation",
  //     etat_avant: "endommage",
  //     date_de_sortie: "2025-05-02",
  //     site_intervention: "Centre de formation",
  //     commentaire: "Endommagé légèrement",
  //     id_commande: 0,
  //   },
  //   {
  //     id_exemplaire: 10,
  //     id_employes: 6,
  //     but_usage: "Suivi client",
  //     etat_avant: "bon",
  //     date_de_sortie: "2025-04-27",
  //     site_intervention: "Client Z",
  //     id_commande: 0,
  //   },
  // ];

  return {
    // GET /moyens-generaux/outils/exemplaires - Récupère les exemplaires d'outils
    getAllExemplaire: async (
      params: PaginationParams
    ): Promise<PaginatedResponse<ExemplaireSortieFormValues>> => {
      const response = await api.get("/moyens-generaux/outils/exemplaires", {
        params,
      });
      return response.data;
    },

    // GET /moyens-generaux/outils/exemplaires/{id} - Récupère les exemplaires d'un outil spécifique avec pagination
    getExemplairesByOutil: async (
      id: string | number,
      params: PaginationParams
    ): Promise<PaginatedResponse<ExemplaireSortieFormValues>> => {
      const response = await api.get(
        `/moyens-generaux/outils/exemplaires/${id}`,
        {
          params,
        }
      );
      return response.data;
    },

    // POST /moyens-generaux/outils/sortie - Enregistre une sortie d'outil
    createSortie: async (
      data: Omit<OutilMovement, "type">
    ): Promise<OutilMovement> => {
      const response = await api.post("/moyens-generaux/outils/sortie", data);
      return response.data;
    },

    // POST /moyens-generaux/outils/entree - Enregistre le retour d'un outil
    createEntree: async (
      data: Omit<OutilMovement, "type">
    ): Promise<OutilMovement> => {
      const response = await api.post("/moyens-generaux/outils/entree", data);
      return response.data;
    },

    // GET /moyens-generaux/outils/etat/{id_exemplaire}/{id_employes} - Vérifie si un outil a été retourné
    getEtatOutil: async (
      id_exemplaire: string | number,
      id_employes: string | number
    ): Promise<OutilEtat> => {
      const response = await api.get(
        `/moyens-generaux/outils/etat/${id_exemplaire}/${id_employes}`
      );
      return response.data;
    },

    // Méthode pour récupérer les outils disponibles (non sortis ou retournés)
    getOutilsDisponibles: async (
      params: PaginationParams
    ): Promise<ExemplaireSortieFormValues[]> => {
      const response = await api.get<
        PaginatedResponse<ExemplaireSortieFormValues>
      >("/moyens-generaux/outils/exemplaires", {
        params,
      });
      const exemplairesDisponibles = response.data.data;
      // Filtrer les outils disponibles :
      // - Jamais sortis (date_sortie_outil === null)
      // - Ou sortis puis retournés (date_retour_outil > date_sortie_outil)
      // On ne peut pas utiliser filter avec une fonction asynchrone, il faut donc utiliser Promise.all et filterer après.
      const outilsDisponibles: ExemplaireSortieFormValues[] = [];
      for (const outil of exemplairesDisponibles) {
        // Jamais sorti
        const response = await api.get<{ retourne: boolean }>(
          `/moyens-generaux/outils/etat/${outil.id_exemplaire}/${outil.id_employes}`
        );
        if (response.data.retourne) {
          outilsDisponibles.push(outil);
        }
      }

      return outilsDisponibles;
    },

    // GET /moyens-generaux/outils/historique/{id} - Récupère l'historique d'un outil spécifique
    getHistoriqueOutil: async (
      id: string | number,
      params: PaginationParams
    ): Promise<PaginatedResponse<OutilMovement>> => {
      const response = await api.get(
        `/moyens-generaux/outils/historique/${id}`,
        {
          params,
        }
      );
      return response.data;
    },

    // GET /moyens-generaux/outils/sorties/{id} - Récupère toutes les sorties d'un outil spécifique
    getSortiesOutil: async (
      id: string | number,
      params: PaginationParams
    ): Promise<PaginatedResponse<OutilMovement>> => {
      const response = await api.get(`/moyens-generaux/outils/sorties/${id}`, {
        params,
      });
      return response.data;
    },

    // GET /moyens-generaux/outils/entrees/{id} - Récupère toutes les entrées d'un outil spécifique
    getEntreesOutil: async (
      id: string | number,
      params: PaginationParams
    ): Promise<PaginatedResponse<OutilMovement>> => {
      const response = await api.get(`/moyens-generaux/outils/entrees/${id}`, {
        params,
      });
      return response.data;
    },

    // GET /moyens-generaux/outils/historiques - Récupère l'historique global de tous les outils
    getHistoriqueGlobal: async (
      params: PaginationParams
    ): Promise<PaginatedResponse<OutilMovement>> => {
      const response = await api.get("/moyens-generaux/outils/historiques", {
        params,
      });
      return response.data;
    },

    // GET /moyens-generaux/outils/sortis - Liste des exemplaires actuellement sortis
    getOutilsSortis: async (
      params: PaginationParams
    ): Promise<PaginatedResponse<ExemplaireSortieFormValues>> => {
      const response = await api.get("/moyens-generaux/outils/sortis", {
        params,
      });
      return response.data;
    },

    // GET /moyens-generaux/outils/sortis/employe/{id_employe} - Liste des outils sortis par un employé
    getOutilsSortisParEmploye: async (
      id_employe: string | number,
      params: PaginationParams
    ): Promise<PaginatedResponse<ExemplaireSortieFormValues>> => {
      const response = await api.get(
        `/moyens-generaux/outils/sortis/employe/${id_employe}`,
        {
          params,
        }
      );
      return response.data;
    },

    // GET /moyens-generaux/outils/mouvement/{type}/{id_exemplaire}/{id_employes} - Détail d'un mouvement précis (pas de pagination)
    getMouvementDetail: async (
      type: "sortie" | "entree",
      id_exemplaire: string | number,
      id_employes: string | number
    ): Promise<OutilMovement> => {
      const response = await api.get(
        `/moyens-generaux/outils/mouvement/${type}/${id_exemplaire}/${id_employes}`
      );
      return response.data;
    },

    // DELETE /moyens-generaux/outils/mouvement/{type}/{id_exemplaire}/{id_employes} - Suppression d'un mouvement
    deleteMouvement: async (
      type: "sortie" | "entree",
      id_exemplaire: string | number,
      id_employes: string | number
    ): Promise<void> => {
      await api.delete(
        `/moyens-generaux/outils/mouvement/${type}/${id_exemplaire}/${id_employes}`
      );
    },

    // PUT /moyens-generaux/outils/mouvement/{type}/{id_exemplaire}/{id_employes} - Modification d'un mouvement
    updateMouvement: async (
      type: "sortie" | "entree",
      id_exemplaire: string | number,
      id_employes: string | number,
      data: Partial<OutilMovement>
    ): Promise<OutilMovement> => {
      const response = await api.put(
        `/moyens-generaux/outils/mouvement/${type}/${id_exemplaire}/${id_employes}`,
        data
      );
      return response.data;
    },

    // GET /moyens-generaux/outils/statistiques - Statistiques globales (pas de pagination)
    getStatistiques: async (): Promise<OutilStatistiques> => {
      const response = await api.get("/moyens-generaux/outils/statistiques");
      return response.data;
    },

    // Méthodes anciennes conservées pour compatibilité (si nécessaire)
    delete: async (id: string | number): Promise<void> => {
      return await api.delete(`/stocks/exemplaires/${id}`);
    },

    getById: async (id: string): Promise<ExemplaireProduit> => {
      const response = await api.get(
        `/moyens-generaux/outils/exemplaires/${id}`
      );
      return response.data;
    },

    create: async (
      data: Omit<ExemplaireProduit, "id_exemplaire" | "prix_exemplaire">
    ): Promise<ExemplaireProduit> => {
      const response = await api.post(
        "/moyens-generaux/outils/exemplaires",
        data
      );
      return response.data;
    },

    update: async (
      id: string | number,
      data: Omit<ExemplaireProduit, "prix_exemplaire">
    ): Promise<ExemplaireProduit> => {
      const response = await api.put(
        `/moyens-generaux/outils/exemplaires/${id}`,
        data
      );
      return response.data;
    },
  };
};
