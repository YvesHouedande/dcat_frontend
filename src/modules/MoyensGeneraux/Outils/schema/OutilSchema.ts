import { z } from "zod";


export const OutilEntreeSchema = z.object({
  id_exemplaire: z.number(),
  num_serie: z.string(),
  date_entree: z.string(),
  id_produi: z.string(),
  nom_produit: z.number(),
  etat_exemplaire: z.string(),
  image_produit: z.string(),
  id_produit: z.coerce.number(),
  fournisseur: z.number().optional(),
  date_sortie_outil: z.string().optional(),
  date_retour_outil: z.string().optional(),
});