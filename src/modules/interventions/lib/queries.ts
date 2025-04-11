import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  getPartenaires,
  getProduits,
  createFileIntervention,
  getInterventions,
} from "./datafetch";
import { toast } from "sonner";

// Hook pour récupérer la liste des utilisateurs
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

// Hook pour récupérer la liste des utilisateurs
export const usePartenaires = () => {
  return useQuery({
    queryKey: ["Partenaires"],
    queryFn: getPartenaires,
  });
};

// Hook pour récupérer la liste des utilisateurs
export const useProduits = () => {
  return useQuery({
    queryKey: ["Produits"],
    queryFn: getProduits,
  });
};

export const useInterventions = () => {
  return useQuery({
    queryKey: ["interventions"],
    queryFn: getInterventions,
  });
};

export const useCreateIntervention = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFileIntervention,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["interventions"] }); // Rafraîchir la liste

      // Afficher le toast de succès
      toast.success("Fiche d'intervention enregistrée avec succès", {
        description: `Intervention pour le client ${
          data.client
        } enregistrée le ${data.date.toLocaleDateString()}`,
        action: {
          label: "Voir les détails",
          // onClick: () => navigate("/interventions"),
          onClick: () => {},
        },
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error("Erreur lors de l'enregistrement", {
          description: error.message,
        });
      } else {
        toast.error("Erreur lors de l'enregistrement", {
          description: "Une erreur inconnue est survenue.",
        });
      }
    },
  });
};
