// src/schemas/exemplaireSortieSchema.ts
import { z } from "zod";
import { TYPE_ETAT_OPTIONS} from "../types";

export const exemplaireSortieSchema = z.object({
  id_exemplaire: z.union([z.number().min(1,"l'outil est requis"),z.string().min(1,"l'outil est requis")]),
  id_employes: z.union([z.number().min(1,"la personne est requise"),z.string().min(1,"la personne est requise")]), 
  but_usage: z.string().min(1,"le motif est requis"),
  etat_avant: z.enum(TYPE_ETAT_OPTIONS as [string, ...string[]]),
  date_de_sortie: z.string().min(1, "La date de sortie est requise"),
  site_intervention: z.string().min(1,"le site d'intervention est requis"),
  commentaire: z.string().optional(),
  id_commande: z.union([z.number().min(1,"la commande est requise"),z.string().min(1,"la commande est requise")]),
});

