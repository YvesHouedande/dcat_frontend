import * as z from "zod";

export const moyenDeTravailSchema = z.object({
  denomination: z.string()
    .min(2, { message: "La dénomination doit comporter au moins 2 caractères" })
    .max(50, { message: "La dénomination ne peut pas dépasser 50 caractères" }),
  date_acquisition: z.string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "La date d'acquisition doit être une date valide",
    }),
  section: z.string()
    .min(2, { message: "La section doit comporter au moins 2 caractères" })
    .max(50, { message: "La section ne peut pas dépasser 50 caractères" }),
});

export type MoyenDeTravailSchema = z.infer<typeof moyenDeTravailSchema>;
