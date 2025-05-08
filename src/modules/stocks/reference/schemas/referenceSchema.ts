import * as z from "zod";

export const referenceSchema = z.object({
  id_produit: z.union([z.number(), z.string()]).optional(),
  code_produit: z.string().optional(),
  desi_produit: z.string().min(1, "La désignation est obligatoire"),
  desc_produit: z.string().optional(),
  image_produit: z.string().optional(),
  emplacement: z.string().min(1, "L'emplacement est obligatoire"),
  caracteristiques: z.string().optional(),
  id_categorie: z.number().min(1, "La catégorie est obligatoire"),
  id_type_produit: z.number().min(1, "Le type est obligatoire"),
  id_modele: z.number().min(1, "Le modèle est obligatoire"),
  id_famille: z.number().min(1, "La famille est obligatoire"),
  id_marque: z.number().min(1, "La marque est obligatoire"),
});

