// src/index.ts
// Point d'entrée principal qui exporte tous les composants et fonctionnalités

// Composants
export { ExemplaireProduitDashboard } from "./components/dashboard/ExemplaireProduitDashboard";
export { ExemplaireProduitForm } from "./components/forms/ExemplaireProduitForm";
export { ExemplaireProduitTable } from "./components/tables/ExemplaireProduitTable";
export { DeliveryCombobox } from "@/components/combobox/DeliveryCombobox";
export { ProductCombobox } from "@/components/combobox/ProductCombobox";

// Hooks
export { useExemplaireProduits } from "./hooks/useExemplaireProduits";
export { useProducts } from "../reference/hooks/useProducts";

// Services
export { useExemplaireProduitService } from "./services/ExemplaireProduitservice";

// Types
export type {
  Delivery,
  Product,
  PaginationParams,
  PaginatedResponse,
} from "./types";

// Schemas
export {
  ExemplaireProduitSchema,
  type ExemplaireProduitFormValues,
} from "./schemas/ExemplaireProduitSchema";

// Utils
export { cn, formatDate, generateUniqueId } from "./utils/helpers";

// Application principale
export { default as ExemplaireApp } from "./pages/Dashboard";
