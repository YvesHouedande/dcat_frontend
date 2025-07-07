// src/schemas/ExemplaireProduitSchema.ts
import { z } from "zod";

export const ExemplaireProduitSchema = z.object({
  id_exemplaire: z.union([z.string(), z.number()]).optional(),
  num_serie: z.string().min(1, "Le numéro de série est requis"),
  date_entree: z.string().min(1, "La date d'entrée est requise"),
  prix_exemplaire: z.string().optional(),
  etat_exemplaire: z.string().default("Disponible"),
  prix_vente: z.union([z.string(), z.number()]).optional(),
  prix_achat: z.union([z.string(), z.number()]).optional(),
  variante: z.union([z.string(), z.number()]).optional(),
  marge_haute: z.union([z.string(), z.number()]).optional(),
  marge_basse: z.union([z.string(), z.number()]).optional(),
  prix_revient: z.union([z.string(), z.number()]).optional(),
  id_livraison: z.union([
    z.string().min(1, "L'identifiant est requis"),
    z.number().min(1, "L'identifiant est requis"),
  ]),
  id_produit: z.union([
    z.string().min(1, "L'identifiant est requis"),
    z.number().min(1, "L'identifiant est requis"),
  ]),
  commentaire: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const ExemplaireProduitEditSchema =
  ExemplaireProduitSchema.partial().extend({
    id_exemplaire: z.union([
      z.string().min(1, "L'identifiant est requis"),
      z.number().min(1, "L'identifiant est requis"),
    ]),
  });
export type ExemplaireProduitFromEdit = z.infer<
  typeof ExemplaireProduitEditSchema
>;
export type ExemplaireProduitFormValues = z.infer<
  typeof ExemplaireProduitSchema
>;
export type ExemplaireProduit = z.infer<typeof ExemplaireProduitSchema>;
