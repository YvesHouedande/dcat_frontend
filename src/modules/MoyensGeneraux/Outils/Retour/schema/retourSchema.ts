import z from "zod"
import { TYPE_ETAT_OPTIONS } from "../../sorties/types"

export const RetourSchemaForms = z.object({
    id_exemplaire: z.union([z.number().min(1, "l'outils est requis"), z.string().min(1, "l'outils est requis")]),
    id_employes: z.union([z.number().min(1, "la personne est requise"), z.string().min(1, "la personne est requise")]),
    etat_apres: z.enum(TYPE_ETAT_OPTIONS as [string, ...string[]]),
    date_de_retour: z.string().min(1, "La date de retour est requise"),
    commentaire: z.string().optional(),
})