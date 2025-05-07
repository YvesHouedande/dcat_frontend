import { z } from "zod";
import { RetourSchemaForms } from "../schema/retourSchema";

export type RetourSchemaFormsValue = z.infer<typeof RetourSchemaForms>;