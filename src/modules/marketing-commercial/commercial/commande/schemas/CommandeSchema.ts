import { z } from "zod";

export const formCommandeSchema = z
  .object({
    produitsQuantites: z
      .record(z.string(), z.number())
      .refine((val) => Object.keys(val).length > 0, {
        message: "Au moins un produit doit être ajouté",
      }),

    lieuLivraison: z.string().min(1, "Le lieu de livraison est obligatoire"),

    id_client: z.string().optional(),
    partenaireId: z.string().optional(),
    dateLivraison: z.union([
      z.string().min(1, "La date de livraison est obligatoire"),
      z.number().min(1, "La date de livraison est obligatoire"),
    ]),
    modePaiement: z.string().min(1, "Le mode de paiement est obligatoire"),
  })
  .refine((data) => !!data.id_client || !!data.partenaireId, {
    message: "Un client ou un partenaire doit être sélectionné",
    path: ["partenaireId"], // ou "id_client"
  });
