// src/index.ts
// Point d'entrée principal qui exporte tous les composants et fonctionnalités

// Composants
export { ProductInstanceDashboard } from './components/ProductInstanceDashboard';
export { ProductInstanceTable } from './components/ProductInstanceTable';

// Hooks
export { useProductInstances } from './hooks/useProductInstances';

// Services
export { productInstanceService } from './services/productInstance.service';

// Types
export type { 
  ProductInstance,
  Delivery,
  Product,
  PaginationParams,
  PaginatedResponse
} from './types';

// Schemas
export { 
  productInstanceSchema, 
  type ProductInstanceFormValues 
} from './schemas/productInstanceSchema';

// Utils
export { cn, formatDate, generateUniqueId } from './utils/helpers';

// Application principale
export { default as ExemplaireApp } from './pages/Dashboard';