import * as z from "zod";

export const referenceSchema = z.object({
  desi_produit: z.string().min(1, "La désignation est requise"),
  desc_produit: z.string().optional(),
  image_produit: z.string().optional(),
  qte_produit: z.number().min(0),
  emplacement: z.string().min(1, "L'emplacement est requis"),
  caracteristiques: z.string().optional(),
  categorie: z.string().min(1, "La catégorie est requise"),
  type_produit: z.string().min(1, "Le type est requis"),
  modele: z.string().min(1, "Le modèle est requis"),
  famille: z.string().min(1, "La famille est requise"),
  marque: z.string().min(1, "La marque est requise"),
});