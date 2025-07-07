// src/index.ts
// Point d'entrée principal qui exporte tous les composants et fonctionnalités

// Composants
export { ExemplaireOutilsDashboard } from "./components//ExemplaireOutilsDashboard";
export { ExemplaireOutilsTable } from "./components/ExemplaireOutilsTable";

// Hooks
export { useExemplaireOutils } from "./hooks/ExemaplaireOutils";

// Services
export { ExemplaireOutilsService } from "./services/ExemplaireOutils.service";

// Types
export type {
  ExemplaireProduit,
  Delivery,
  Product,
  PaginationParams,
  PaginatedResponse,
} from "./types";

// Schemas
export {
  ExemplaireOutilsSchema,
  type ExemplaireOutilsFormValues,
  ExemplaireOutilsEditSchema,
} from "./schemas/ExemplaireOutilsSchema";

// Utils
export { cn, formatDate, generateUniqueId } from "./utils/helpers";

// Application principale
export { default as ExemplaireApp } from "./pages/Dashboard";
