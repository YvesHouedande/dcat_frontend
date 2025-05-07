// src/schemas/exemplaireSortieSchema.ts
import { z } from "zod";
import { TYPE_SORTIE_OPTIONS } from "../types";

export const exemplaireSortieSchema = z.object({
  id_sortie_exemplaire: z.number().optional(), // Auto-généré (COUNTER)
  type_sortie: z.enum(TYPE_SORTIE_OPTIONS as [string, ...string[]]),
  reference_id: z.string().min(1, "La référence est requise"),
  date_sortie: z.string().min(1, "La date de sortie est requise"),
  id_produit: z.number().min(1,"L'identifiant du produit est requis"),
  quantite: z.number().min(1, "La quantité doit être d'au moins 1").default(1)
});

export type ExemplaireSortieFormValues = z.infer<typeof exemplaireSortieSchema>;