import { z } from 'zod';

export const exemplaireSchema = z.object({
  id_exemplaire: z.string().min(1, "L'ID est requis"),
  num_serie: z.string().min(6, "Le numéro de série doit avoir au moins 6 caractères"),
  prix_exemplaire: z.string().min(1, "Le prix est requis")
    .refine(val => !isNaN(parseFloat(val)), "Le prix doit être un nombre"),
  etat_disponible_indisponible_: z.enum(['disponible', 'indisponible']),
  Id_Commande: z.string().nullable(),
  id_livraison: z.string().nullable(),
  id_produit: z.string().min(1, "Un produit doit être sélectionné"),
  Code_produit: z.string().min(1, "Le code produit est requis")
});

export type ExemplaireFormValues = z.infer<typeof exemplaireSchema>;