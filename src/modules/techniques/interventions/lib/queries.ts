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
};// Assurez-vous que cette fonction existe

export const useInterventions = (id?: string | number) => {
  return useQuery({
    queryKey: ["interventions", id],  // La clé inclut 'id', ce qui permet de refetcher les données lorsque l'id change
    queryFn: () => getInterventions(id),  // Assurez-vous que getInterventions accepte un id si nécessaire
    enabled: false,  // La requête sera effectuée uniquement si id est défini
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
