import { z } from "zod";

// Schéma de base pour les maintenances
export const maintenanceSchema = z.object({
  recurrence: z.string().min(1, "la recurrence est requise").max(50),
  operations: z.string().min(1,"les opérations sont requisent"),
  recommandations: z.string(),
  type_maintenance: z.string().min(1,"le type de maintenance est requis").max(50),
  autre_intervenant: z.string().max(50).optional(),
  date:z.string().min(1, "la date est requise"),
  id_partenaire: z.union([z.number().optional(),z.string().optional()]),
  id_intervenants: z.union([z.number().optional(),z.string().optional()]),
  id_section: z.union([z.number().min(1,"la section est requise"),z.string().min(1,"la section est requise") ]),
  id_exemplaire_produit: z.union([z.number().min(1,"l'equipement est requis"),z.string().min(1,"l'equipement est requis") ]),
});


export type  MaintenanceSchema = z.infer<typeof maintenanceSchema>;
