// src/schemas/productInstanceSchema.ts
import { z } from "zod";

export const productInstanceSchema = z.object({
  id_exemplaire:z.union([z.string(), z.number()]).optional(),
  num_serie: z.string().min(1, "Le numéro de série est requis"),
  date_entree: z.string().min(1, "La date d'entrée est requise"),
  etat_vente: z.enum(["vendu", "invendu"]).default("invendu"),
  id_livraison: z.union([
    z.string().min(1, "L'identifiant est requis"),
    z.number().min(1, "L'identifiant est requis"),
  ]),
  id_produit: z.union([
    z.string().min(1, "L'identifiant est requis"),
    z.number().min(1, "L'identifiant est requis"),
  ]),
});


export const ProductInstanceEditSchema = productInstanceSchema.partial().extend({
  id_exemplaire: z.union([
    z.string().min(1, "L'identifiant est requis"),
    z.number().min(1, "L'identifiant est requis"),
  ]),
  });
export type ProductInstanceFromEdit = z.infer<typeof productInstanceSchema>;
export type ProductInstanceFormValues = z.infer<typeof productInstanceSchema>;