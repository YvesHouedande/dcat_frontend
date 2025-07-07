import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  LivraisonService
} from "../services/livraison.service";


export const useLivraisonData = (id?:string | number) => {
  // Query pour les livraisons
  const livraisonService = LivraisonService();
  const livraisons = useQuery({
    queryKey: ["livraisons"],
    queryFn: livraisonService.fetchLivraisons,
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


    // recuperatin de la livraison par ID
    const {
      data: livraison,
    } = useQuery({
      queryKey: ["livraison", id],
      queryFn: () => livraisonService.LivraisonById(id!), // Utilisation de ! car on sait que id est défini grâce à enabled
      enabled: !!id, // Désactiver la requête si l'ID n'est pas défini
    });


  // État global de chargement


  return {
    livraison ,
    livraisons:livraisons.data,
    isLoading: livraisons.isLoading,
    errorLivraisons: livraisons.error,
    refetchLivraisons: livraisons.refetch,
  };
};

export const useLivraisonMutations = () => {
  const queryClient = useQueryClient();
  const livraisonService = LivraisonService();
  // Mutation pour créer une livraison
  const createMutation = useMutation({

    mutationFn: livraisonService.createLivraison,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livraisons"] });
     
    },
  });

  // Mutation pour mettre à jour une livraison
  const updateMutation = useMutation({
    mutationFn: livraisonService.updateLivraison,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livraisons"] });
    },
  });

  // Mutation pour supprimer une livraison
  const deleteMutation = useMutation({
    mutationFn:livraisonService.deleteLivraison,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livraisons"] });
    },
    
  });



  return {
    createMutation,
    updateMutation,
    deleteMutation,
    isSubmitting: createMutation.isLoading || updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
};