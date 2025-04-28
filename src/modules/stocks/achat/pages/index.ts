// index.ts

// Exporter les types
export type { Livraison, Partenaire } from '../types/livraison.types';

// Exporter les services
export { LivraisonService } from '../services/livraison.service';

// Exporter les composants
export { default as LivraisonPage } from '../pages/LivraisonPage';
export { default as LivraisonForm } from '../components/LivraisonForm';
export { default as LivraisonTable } from '../components/LivraisonTable';
export { default as LivraisonDetails } from '../components/LivraisonDetails';