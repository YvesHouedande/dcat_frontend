// src/schemas/productInstanceSchema.ts
import { z } from "zod";

export const productInstanceSchema = z.object({
  id_exemplaire: z.union([z.string(), z.number()]).optional(),
  nom_produit: z.string().optional(),
  image_produit: z.string().optional(),
  num_serie: z.string().min(1, "Le numéro de série est requis"),
  date_entree: z.string().min(1, "La date d'entrée est requise"),
  prix_exemplaire: z.string().optional(),
  prix_de_vente: z.union([z.string(), z.number()]).optional(),
  frais_divers: z.union([z.string(), z.number()]).optional(),
  prix_achat: z.union([z.string(), z.number()]).optional(),
  coef_divers: z.number().optional(),
  marge_haute: z.union([z.string(), z.number()]).optional(),
  marge_basse: z.union([z.string(), z.number()]).optional(),
  prix_de_revient: z.union([z.string(), z.number()]).optional(),
  etat_exemplaire: z
    .enum(["vendu", "invendu", "bon", "endommage", "disponible", "reserve"])
    .default("disponible"),
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

export const ProductInstanceEditSchema = productInstanceSchema
  .partial()
  .extend({
    id_exemplaire: z.union([
      z.string().min(1, "L'identifiant est requis"),
      z.number().min(1, "L'identifiant est requis"),
    ]),
  });
export type ProductInstanceFromEdit = z.infer<typeof ProductInstanceEditSchema>;
export type ProductInstanceFormValues = z.infer<typeof productInstanceSchema>;

export const SortieSchema = z.object({
  type_sortie: z.enum(["vente directe", "vente en ligne"]),
  id_commande: z.union([
    z.string().min(1, "L'identifiant est requis"),
    z.number().min(1, "L'identifiant est requis"),
  ]),
  id_exemplaire: z.union([
    z.string().min(1, "L'identifiant est requis"),
    z.number().min(1, "L'identifiant est requis"),
  ]),
});

export type SortieFormValues = z.infer<typeof SortieSchema>;
