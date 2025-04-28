// src/index.ts
// Point d'entrée principal qui exporte tous les composants et fonctionnalités

// Composants
export { ProductInstanceDashboard } from './components/dashboard/ProductInstanceDashboard';
export { ProductInstanceForm } from './components/forms/ProductInstanceForm';
export { ProductInstanceTable } from './components/tables/ProductInstanceTable';
export { DeliveryCombobox } from './components/combobox/DeliveryCombobox';
export { ProductCombobox } from './components/combobox/ProductCombobox';

// Hooks
export { useProductInstances } from './hooks/useProductInstances';
export { useDeliveries } from './hooks/useDeliveries';
export { useProducts } from './hooks/useProducts';

// Services
export { productInstanceService } from './services/productInstance.service';
export { deliveryService } from './services/delivery.service';
export { productService } from './services/product.service';

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