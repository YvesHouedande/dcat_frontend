// Schema de validation Zod
// src/schemas/moyenDeTravailSchema.ts
import { z } from 'zod';

export const moyenDeTravailSchema = z.object({
  denomination: z.string().min(1, "La dénomination est requise").max(50, "La dénomination ne peut pas dépasser 50 caractères"),
  date_acquisition: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Date d'acquisition invalide",
  }),
  section: z.string().min(1, "La section est requise").max(50, "La section ne peut pas dépasser 50 caractères"),
});

export type MoyenDeTravailFormValues = z.infer<typeof moyenDeTravailSchema>;