// src/index.ts
// Point d'entrée principal qui exporte tous les composants et fonctionnalités

// Composants
export { ProductInstanceDashboard } from './components/dashboard/ProductInstanceDashboard';
export { ProductInstanceForm } from './components/forms/ProductInstanceForm';
export { ProductInstanceTable } from './components/tables/ProductInstanceTable';
export { DeliveryCombobox } from '@/components/combobox/DeliveryCombobox';
export { ProductCombobox } from '@/components/combobox/ProductCombobox';

// Hooks
export { useProductInstances } from './hooks/useProductInstances';
export { useProducts } from '../reference/hooks/useProducts';

// Services
export { useProductInstanceService} from './services/productInstance.service';

// Types
export type { 
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