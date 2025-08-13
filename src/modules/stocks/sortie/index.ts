// src/index.ts
// Point d'entrée principal qui exporte tous les composants et fonctionnalités

// Composants
export { ProductSortieDashboard } from "./components/dashboard/ProductSortieDashboard";
export { ProductInstanceForm } from "./components/forms/ProductInstanceForm";
export { SortieInstanceTable } from "./components/tables/SortieInstanceTable";
export { DeliveryCombobox } from "@/components/combobox/DeliveryCombobox";
export { ProductCombobox } from "@/components/combobox/ProductCombobox";

// Hooks
export { useProductInstances } from "./hooks/useProductInstances";
export { useProducts } from "../reference/hooks/useProducts";

// Services
export { ProductInstanceService } from "./services/productInstance.service";

// Types
export type {
  Delivery,
  Product,
  PaginationParams,
  PaginatedResponse,
} from "./types";

// Schemas
export {
  productInstanceSchema,
  type ProductInstanceFormValues,
} from "./schemas/SortieSchema";

// Utils
export { cn, formatDate, generateUniqueId } from "./utils/helpers";

// Application principale
export { default as ExemplaireApp } from "./pages/Dashboard";
