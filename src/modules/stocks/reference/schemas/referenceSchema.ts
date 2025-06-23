import * as z from "zod";

/**
 * @description Schema for validating reference data
 * @param {number} id_produit - The ID of the product (optional)
 * @param {string} code_produit - The code of the product (optional)
 * @param {string} desi_produit - The designation of the product (required)
 * @param {string} desc_produit - The description of the product (optional)
 * @param {string} image_produit - The image of the product (optional)
 * @param {string} emplacement_produit - The location of the product (required)
 * @param {string} caracteristiques - The characteristics of the product (optional)
 * @param {number} id_categorie - The ID of the category (required)
 * @param {number} id_type_produit - The ID of the type of product (required)
 * @param {number} id_modele - The ID of the model (required)
 * @param {number} id_famille - The ID of the family (required)
 * @param {number} id_marque - The ID of the brand (required)
 */

// Définition du schéma d'une image produit
export const imageProduitSchema = z.object({
  id_image: z.number().optional(),
  libelle_image: z.string(),
  lien_image: z.string(),
  numero_image: z.number(),
  created_at: z.string().optional(),
  url: z.string().optional(),
});

export const referenceSchema = z.object({
  id_produit: z.union([z.number(), z.string()]).optional(),
  code_produit: z.string().optional(),
  desi_produit: z.string().min(1, "La désignation est obligatoire"),
  desc_produit: z.string().optional(),
  image_produit: z.array(imageProduitSchema).optional(),
  emplacement_produit: z.string().min(1, "L'emplacement est obligatoire"),
  caracteristiques: z.string().optional(),
  id_categorie: z.number().min(1, "La catégorie est obligatoire"),
  id_type_produit: z.number().min(1, "Le type est obligatoire"),
  id_modele: z.number().min(1, "Le modèle est obligatoire"),
  id_famille: z.number().min(1, "La famille est obligatoire"),
  id_marque: z.number().min(1, "La marque est obligatoire"),
  categorie: z.string().optional(),
  type_produit: z.string().optional(),
  modele: z.string().optional(),
  famille: z.string().optional(),
  marque: z.string().optional(),
  qte_produit: z.number().optional(),
});

export type FormValues = z.infer<typeof referenceSchema>;