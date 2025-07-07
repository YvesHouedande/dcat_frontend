// src/schemas/ExemplaireProduitSchema.ts
import { z } from "zod";

export const ExemplaireOutilsSchema = z.object({
  id_exemplaire: z.union([z.string(), z.number()]).optional(),
  num_serie: z.string().min(1, "Le numéro de série est requis"),
  date_entree: z.string().min(1, "La date d'entrée est requise"),
  etat_vente: z
    .enum(["vendu", "invendu", "bon", "endommage"])
    .default("invendu"),
  id_livraison: z.union([
    z.string().min(1, "L'identifiant est requis"),
    z.number().min(1, "L'identifiant est requis"),
  ]),
  id_produit: z.union([
    z.string().min(1, "L'identifiant est requis"),
    z.number().min(1, "L'identifiant est requis"),
  ]),
  commentaire: z.string().optional(),
});

export const ExemplaireOutilsEditSchema =
  ExemplaireOutilsSchema.partial().extend({
    id_exemplaire: z.union([
      z.string().min(1, "L'identifiant est requis"),
      z.number().min(1, "L'identifiant est requis"),
    ]),
  });
export type ExemplaireOutilsFromEdit = z.infer<
  typeof ExemplaireOutilsEditSchema
>;
export type ExemplaireOutilsFormValues = z.infer<
  typeof ExemplaireOutilsSchema
>;
