import { z } from "zod";

export const livraisonSchema = z.object({
  id_livraison: z.coerce.number().optional(),
  frais_divers: z.string(),
  Periode_achat: z.string().optional(),
  prix_achat: z.string().min(1, "Le prix d'achat est requis"),
  prix_de_revient: z.string().min(1, "Le prix de revient est requis"),
  prix_de_vente: z.string().min(1, "Le prix de vente est requis"),
  id_partenaire: z.coerce.number().min(1, "Le partenaire est requis"),
  reference: z.string().min(1, "La référence est requise"),
});

export const livraisonUpdateSchema = livraisonSchema.partial().extend({
  id_livraison: z.coerce.number().min(1, "L'ID de livraison est requis"),
  });

export type LivraisonFormValues = z.infer<typeof livraisonSchema>;


