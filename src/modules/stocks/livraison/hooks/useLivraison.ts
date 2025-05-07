import {useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchLivraisons,
  fetchPartenaires,
  createLivraison,
  updateLivraison,
  deleteLivraison,
  LivraisonById,
} from "../services/livraison.service";
import { Livraison, Partenaire } from "../types/types";
import { LivraisonFormValues } from "../schema/schema";

export const useLivraisonData = (id?:string | number) => {
  // Query pour les livraisons
  const {
    data: livraisons = [],
    isLoading: isLoadingLivraisons,
    refetch: refetchLivraisons
  } = useQuery({
    queryKey: ["livraisons"],
    queryFn: fetchLivraisons,
    staleTime: 15 * 60 * 1000, // 15 minutes (optionnel)
    // refetchOnWindowFocus: false, // Ne pas refetch lors du focus de la fenêtre (optionnel)
    // refetchOnReconnect: false, // Ne pas refetch lors de la reconnexion (optionnel)
    // retry: 1, // Nombre de tentatives en cas d'erreur (optionnel)
    // retryDelay: 1000, // Délai entre les tentatives (optionnel)
    // cacheTime: 10 * 60 * 1000, // Durée de mise en cache (optionnel)
    // enabled: false, // Désactiver la requête au démarrage (optionnel)
    // onSuccess: (data) => console.log("Deliveries fetched successfully", data), // Callback de succès (optionnel)
    // onError: (error) => console.error("Error fetching deliveries", error), // Callback d'erreur (optionnel)
    // onSettled: () => console.log("Fetch deliveries settled"), // Callback de fin (optionnel)
    // select: (data) => data.filter(delivery => delivery.status === "active"), // Sélectionner les données (optionnel)
  });

  // Query pour les partenaires
  const {
    data: partenaires = [],
    isLoading: isLoadingPartenaires
  } = useQuery({
    queryKey: ["partenaires"],
    queryFn: fetchPartenaires
  });

  // Créer un dictionnaire des partenaires pour faciliter l'accès par ID
  const partenaireDict = useMemo(() => {
    const dict: { [key: number]: Partenaire } = {};
    partenaires.forEach(partenaire => {
      dict[partenaire.id_partenaire] = partenaire;
    });
    return dict;
  }, [partenaires]);

    // mutation pour recuperer une livraison
    const {
      data: livraison,
    } = useQuery({
      queryKey: ["livraison", id],
      queryFn: () => LivraisonById(id!), // Utilisation de ! car on sait que id est défini grâce à enabled
      enabled: !!id, // Désactiver la requête si l'ID n'est pas défini
    });


  // État global de chargement
  const isLoading = isLoadingLivraisons || isLoadingPartenaires;

  return {
    livraison ,
    livraisons,
    partenaires,
    partenaireDict,
    isLoading,
    refetchLivraisons
  };
};

export const useLivraisonMutations = () => {
  const queryClient = useQueryClient();

  // Mutation pour créer une livraison
  const createMutation = useMutation({
    mutationFn: createLivraison,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livraisons"] });
      toast.success("Succès", {
        description: "L'achat créé avec succès",
      });
    },
    onError: () => {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la création",
      });
    }
  });


  // Mutation pour mettre à jour une livraison
  const updateMutation = useMutation({
    mutationFn: updateLivraison,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livraisons"] });
      toast.success("Succès", {
        description: "L'achat mis à jour avec succès",
      });
    },
    onError: () => {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la mise à jour",
      });
    }
  });

  // Mutation pour supprimer une livraison
  const deleteMutation = useMutation({
    mutationFn: deleteLivraison,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livraisons"] });
      toast.success("Succès", { 
        description: "L'achat supprimé avec succès" 
      });
    },
    onError: () => {
      toast.error("Erreur", { 
        description: "Impossible de supprimer l'achat" 
      });
    }
  });

  // Fonction simplifiée pour soumettre un formulaire (création ou mise à jour)
  const submitLivraison = (values: LivraisonFormValues, currentLivraison: Livraison | null) => {
    if (currentLivraison) {
      // Mise à jour
      return updateMutation.mutateAsync({
        ...currentLivraison,
        ...values,
      });
    } else {
      // Création
      return createMutation.mutateAsync(values as Livraison);
    }
  };

  // Fonction simplifiée pour supprimer une livraison
  const removeLivraison = (id: number) => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    submitLivraison,
    removeLivraison,
    isSubmitting: createMutation.isLoading || updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
};