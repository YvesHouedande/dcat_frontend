import { z } from "zod";

export const livraisonSchema = z.object({
  id_livraison: z.coerce.number().optional(),
  reference_livraison: z.string().min(1, "La référence est requise"),
  qteProduits: z.number().min(1, "La quantité de produits est requise"),
  Commentaire: z.string().optional(),
  date_livraison: z.string().min(1, "La date de livraison est requise"),
  frais_divers: z.number().min(1, "Les frais divers sont requis"),
});
export const livraisonSchemaWithId = livraisonSchema.extend({
  id_livraison: z.coerce.number().min(1, "L'ID de livraison est requis"),
});
export type LivraisonFormValues = z.infer<typeof livraisonSchema>;

export const achatSchema = z.object({
  id_livraison: z.coerce.number().min(1, "L'ID de livraison est requis"),
  reference_livraison: z.string().min(1, "La référence est requise"),
  qteProduits: z.number().min(1, "La quantité de produits est requise"),
  Commentaire: z.string().optional(),
  date_livraison: z.string().min(1, "La date de livraison est requise"),
  frais_divers: z.number().min(1, "Les frais divers sont requis"),
  id_partenaire: z.coerce.number().min(1, "Le partenaire est requis"),
});
export type AchatFormValues = z.infer<typeof achatSchema>;

