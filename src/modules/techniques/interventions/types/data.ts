import { z } from "zod";


// Définition du schéma de validation avec Zod
export const ficheInterventionSchema = z
  .object({
    date: z.date({
      required_error: "La date est requise",
    }),
    client: z
      .string({
        required_error: "Le client est requis",
      })
      .min(1, "Le client est requis"),
    intervenants: z
      .array(z.string())
      .min(1, "Au moins un intervenant est requis"),
    problemeSignale: z
      .string({
        required_error: "La description du problème est requise",
      })
      .min(10, "La description doit contenir au moins 10 caractères"),
    typeMaintenance: z.string({
      required_error: "Le type de maintenance est requis",
    }),
    typeDefaillance: z.string({
      required_error: "Le type de défaillance est requis",
    }),
    causeDefaillance: z.string({
      required_error: "La cause de défaillance est requise",
    }),
    descriptionCause: z
      .string({
        required_error: "La description de la cause est requise",
      })
      .min(10, "La description doit contenir au moins 10 caractères"),
    rapportIntervention: z
      .string({
        required_error: "Le rapport d'intervention est requis",
      })
      .min(10, "Le rapport doit contenir au moins 10 caractères"),
    duree: z
      .string({
        required_error: "La durée est requise",
      })
      .min(1, "La durée est requise"),
    piecesRechange: z
      .array(
        z.object({
          id: z.string(),
          quantity: z.number().int().positive(),
        })
      )
      .optional(),
    superviseur: z
      .string({
        required_error: "Le superviseur est requis",
      })
      .min(1, "Le superviseur est requis"),
  })
  .refine(
    (data) => {
      // Vérifier qu'au moins une option est sélectionnée parmi les trois
      const optionsCount = [
        !!data.typeMaintenance,
        !!data.typeDefaillance,
        !!data.causeDefaillance,
      ].filter(Boolean).length;

      return optionsCount >= 1;
    },
    {
      message:
        "Au moins un type de maintenance, défaillance ou cause doit être sélectionné",
      path: ["typeMaintenance"], // Le chemin où l'erreur apparaîtra
    }
  );
export type FicheInterventionFormValues = z.infer<typeof ficheInterventionSchema>;