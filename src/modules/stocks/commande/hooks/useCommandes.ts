import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { CommandesService } from "../services/commande.service";
import { Commande, ProduitDetail, UpdateCommande } from "../types/commande";
import { useNavigate } from "react-router-dom";
import { CommandeLimit } from "../../exemplaire/types/const";

// Hooks personnalisés

export const useCommandes = (filters = {}) => {
  const commandesServiceInstance = CommandesService();
  return useInfiniteQuery({
    queryKey: ["commandes", filters],
    queryFn: ({ pageParam = 1 }) =>
      commandesServiceInstance.getAll(pageParam, CommandeLimit, filters), // ⚠️ Doit être adapté dans le service
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.currentPage;
      const totalPages = lastPage.totalPages;
      if (currentPage < totalPages) {
        
        return currentPage + 1;
      }
      
      return undefined; // Plus de pages à charger
    },
  });
};



/**
 * Récupère une commande par son ID.
 *
 * @param {number} id - L'ID de la commande.
 * @returns {UseQueryResult<Commande>} Un objet {data, error, isLoading, isSuccess} pour gérer la requête
 * de récupération d'une commande.
 *
 * La clé de requête est "commande" suivie de l'ID de la commande.
 * La requête est activée si l'ID est non nul.
 */
export const useCommande = (id: number) => {
  const commandesServiceInstance = CommandesService();
  return useQuery({
    queryKey: ["commande", id],
    queryFn: () => commandesServiceInstance.getById(id),
    enabled: !!id,
  });
};

/**
 * Crée une nouvelle commande.
 *
 * @returns un objet {mutate, error, isLoading, isSuccess} pour gérer la requête
 * de création d'une commande.
 *
 * Lors de la création, la clé de requête "commandes" est invalidée pour forcer
 * la requête de la liste des commandes.
 */

export const useCreateCommande = () => {
  const queryClient = useQueryClient();
  const commandesServiceInstance = CommandesService();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: commandesServiceInstance.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      navigate("/stocks/commandes");
    },
  });
};
/**
 * Crée une nouvelle commande dans la section "Marketing Commercial".
 *
 * @returns un objet {mutate, error, isLoading, isSuccess} pour gérer la requête
 * de création d'une commande.
 *
 * Lors de la création, la clé de requête "commandes" est invalidée pour forcer
 * la requête de la liste des commandes.
 */

export const useCreateCommandeWithMarketing = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const commandesServiceInstance = CommandesService();
  return useMutation({
    mutationFn: commandesServiceInstance.createWithMarketing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      navigate("/stocks/commandes");
    },
  });
};

/**
 * Met à jour une commande.
 *
 * @returns un objet {mutate, error, isLoading, isSuccess} pour gérer la requête
 * de mise à jour d'une commande.
 *
 * Lors de la mise à jour, les clés de requête "commandes" et "commande" sont
 * invalidées pour forcer la requête de la liste des commandes et des détails
 * de la commande.
 */

export const useUpdateCommande = () => {
  const queryClient = useQueryClient();
  const commandesServiceInstance = CommandesService();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UpdateCommande> }) =>
      commandesServiceInstance.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      queryClient.invalidateQueries({ queryKey: ["commande", id] });
    },
  });
};

/**
 * Supprime une commande.
 *
 * @returns un objet {mutate, error, isLoading, isSuccess} pour gérer la requête
 * de suppression d'une commande.
 *
 * Lors de la suppression, la clé de requête "commandes" est invalidée pour
 * forcer la requête de la liste des commandes.
 */
export const useDeleteCommande = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const commandesServiceInstance = CommandesService();
  return useMutation({
    mutationFn: ({ id, type }: { id: number; type: string }) =>
      commandesServiceInstance.delete(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      queryClient.invalidateQueries({ queryKey: ["commande"] });
      navigate("/stocks/commandes");
    },
  });
};

/**
 * Met à jour le statut d'une commande.
 *
 * @returns un objet {mutate, error, isLoading, isSuccess} pour gérer la requête
 * de mise à jour du statut d'une commande.
 *
 * Lors de la mise à jour, les clés de requête "commandes" et "commande" sont
 * invalidées pour forcer la requête de la commande et de la liste des
 * commandes.
 */
export const useUpdateCommandeStatus = () => {
  const queryClient = useQueryClient();
  const commandesServiceInstance = CommandesService();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: Commande["etat_commande"];
    }) => commandesServiceInstance.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      queryClient.invalidateQueries({ queryKey: ["commande", id] });
    },
  });
};
export const useCommandeCancel = () => {
  const queryClient = useQueryClient();
  const commandesServiceInstance = CommandesService();
  return useMutation({
    mutationFn: ({ id, motif }: { id: number; motif?: string }) =>
      commandesServiceInstance.commandeCancel(id, motif),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      queryClient.invalidateQueries({ queryKey: ["commande", id] });
    },
  });
};
export const useCommandeReserveAll = () => {
  const queryClient = useQueryClient();
  const commandesServiceInstance = CommandesService();
  return useMutation({
    mutationFn: ({ commandeId }: { commandeId: number }) =>
      commandesServiceInstance.commandeResereAll(commandeId),
    onSuccess: (_, { commandeId }) => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      queryClient.invalidateQueries({ queryKey: ["commande", commandeId] });
    },
  });
};

// Hooks pour les produits de commande
export const useCommandeProduits = (commandeId: number) => {
  const commandesServiceInstance = CommandesService();
  return useQuery({
    queryKey: ["commande-produits", commandeId],
    queryFn: () => commandesServiceInstance.getCommandeProduits(commandeId),
    enabled: !!commandeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Ajoute un produit à une commande.
 *
 * @returns un objet {mutate, error, isLoading, isSuccess} pour gérer la requête
 * d'ajout d'un produit.
 *
 * Lors de la mise à jour, les clés de requête "commande-produits" et "commande" sont
 * invalidées pour le bon fonctionnement de la liste des commandes et des détails
 * d'une commande.
 */
export const useAddProduitToCommande = () => {
  const queryClient = useQueryClient();
  const commandesServiceInstance = CommandesService();
  return useMutation({
    mutationFn: ({
      commandeId,
      produit,
    }: {
      commandeId: number;
      produit: Omit<ProduitDetail, "id_produit">;
    }) => commandesServiceInstance.addProduitToCommande(commandeId, produit),
    onSuccess: (_, { commandeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["commande-produits", commandeId],
      });
      queryClient.invalidateQueries({ queryKey: ["commande", commandeId] });
    },
  });
};

/**
 * Met à jour un produit dans une commande.
 *
 * @returns un objet {mutate, error, isLoading, isSuccess} pour gérer la requête
 * de mise à jour d'un produit.
 *
 * Lors de la mise à jour, les clés de requête "commande-produits" et "commande" sont
 * invalidées pour le bon fonctionnement de la liste des commandes et des détails
 * d'une commande.
 */
export const useUpdateProduitInCommande = () => {
  const queryClient = useQueryClient();
  const commandesServiceInstance = CommandesService();
  return useMutation({
    mutationFn: ({
      commandeId,
      produitId,
      produit,
    }: {
      commandeId: number;
      produitId: number;
      produit: Partial<ProduitDetail>;
    }) =>
      commandesServiceInstance.updateProduitInCommande(
        commandeId,
        produitId,
        produit
      ),
    onSuccess: (_, { commandeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["commande-produits", commandeId],
      });
      queryClient.invalidateQueries({ queryKey: ["commande", commandeId] });
    },
  });
};

export const useRemoveProduitFromCommande = () => {
  const queryClient = useQueryClient();
  const commandesServiceInstance = CommandesService();
  return useMutation({
    mutationFn: ({
      commandeId,
      produitId,
    }: {
      commandeId: number;
      produitId: number;
    }) =>
      commandesServiceInstance.removeProduitFromCommande(commandeId, produitId),
    onSuccess: (_, { commandeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["commande-produits", commandeId],
      });
      queryClient.invalidateQueries({ queryKey: ["commande", commandeId] });
    },
  });
};
