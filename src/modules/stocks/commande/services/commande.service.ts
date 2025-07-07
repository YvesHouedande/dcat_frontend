import {
  Commande,
  CommandeApiResponse,
  CommandeDetail,
  CommandeFilter,
  CommandeFormValues,
  CommandeFormValuesWithProduits,
  CommandeServiceResponse,
  ProduitDetail,
  UpdateCommande,
} from "../types/commande";
import { useApi } from "@/api/api";

export const CommandesService = () => {
  const api = useApi();
  return {
    /**
     * Récupère toutes les commandes.
     * @returns {Promise<CommandeResponse[]>} Une promesse qui résout un tableau de CommandeResponse.
     */
    getAll: async (
      page: number,
      limit: number,
      filters: CommandeFilter
    ): Promise<CommandeServiceResponse> => {
      const params = { page, limit, ...filters };
      const { data } = await api.get<CommandeApiResponse>("stocks/commandes", {
        params,
      });
      return {
        data: data.data,
        currentPage: data.pagination.page,
        totalPages: data.pagination.totalPages,
        totalItems: data.pagination.total,
      };
    },

    /**
     * Retrieves a specific commande by its ID.
     * @param {number} id - The ID of the commande to retrieve.
     * @returns {Promise<Commande>} A promise that resolves to the Commande object.
     */

    getById: async (id: number): Promise<Commande> => {
      const { data } = await api.get(`stocks/commandes/${id}`);
      return data;
    },

    /**
     * Crée une nouvelle commande.
     * @param {Omit<Commande, 'id_commande' | 'created_at' | 'updated_at'>} commande - L'objet Commande à créer, sans l'ID, la date de création et la date de mise à jour.
     * @returns {Promise<Commande>} Une promesse qui résout l'objet Commande créé.
     */
    create: async (commande: CommandeFormValues): Promise<Commande> => {
      const { data } = await api.post("stocks/commandes", commande);
      return data;
    },

    /**
     * Crée une nouvelle commande dans la section "Marketing Commercial".
     * @param {Omit<ProduitDetail, 'id_produit'>} produit - L'objet ProduitDetail à créer, sans l'ID.
     * @returns {Promise<ProduitDetail>} Une promesse qui résout l'objet ProduitDetail créé.
     */
    createWithMarketing: async (
      produit: CommandeFormValuesWithProduits
    ): Promise<ProduitDetail> => {
      const { data } = await api.post(
        `/marketing_commercial/commandes`,
        produit
      );
      return data;
    },

    update: async (
      id: number,
      commande: Partial<UpdateCommande>
    ): Promise<Commande> => {
      const { data } = await api.put(`stocks/commandes/${id}`, commande);
      return data;
    },

    delete: async (id: number, type: string): Promise<void> => {
      await api.delete(`/stocks/commandes/${id}/${type}`);
    },

    updateStatus: async (
      id: number,
      status: Commande["etat_commande"]
    ): Promise<Commande> => {
      const { data } = await api.put(`/stocks/commandes/${id}`, {
        etat_commande: status,
      });
      return data;
    },
    commandeCancel: async (id: number, motif?: string): Promise<Commande> => {
      const { data } = await api.post(`/stocks/commandes/annuler/${id}`, {
        motif: motif,
      });
      return data;
    },
    commandeResereAll: async (id: number): Promise<Commande> => {
      const { data } = await api.post(`/stocks/commandes/reserver/${id}`);
      return data;
    },
    getCommandesByClient: async (clientId: number): Promise<Commande[]> => {
      const { data } = await api.get(`stocks/commandes/client/${clientId}`);
      return data;
    },
    getCommandesByStatus: async (
      status: Commande["etat_commande"]
    ): Promise<Commande[]> => {
      const { data } = await api.get(`stocks/commandes/status/${status}`);
      return data;
    },

    getCommandeProduits: async (
      commandeId: number
    ): Promise<CommandeDetail> => {
      const { data } = await api.get(`stocks/commandes/${commandeId}`);
      return data;
    },

    addProduitToCommande: async (
      commandeId: number,
      produit: Omit<ProduitDetail, "id_produit">
    ): Promise<ProduitDetail> => {
      const { data } = await api.post(
        `/commandes/${commandeId}/produits`,
        produit
      );
      return data;
    },

    updateProduitInCommande: async (
      commandeId: number,
      produitId: number,
      produit: Partial<ProduitDetail>
    ): Promise<ProduitDetail> => {
      const { data } = await api.put(
        `/commandes/${commandeId}/produits/${produitId}`,
        produit
      );
      return data;
    },

    removeProduitFromCommande: async (
      commandeId: number,
      produitId: number
    ): Promise<void> => {
      await api.delete(`/commandes/${commandeId}/produits/${produitId}`);
    },
  };
};
