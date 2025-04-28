// services/livraison.service.ts

import { Livraison, Partenaire } from '../types/livraison.types';

// Données simulées pour les tests
let livraisons: Livraison[] = [
  {
    id_livraison: 'LIV001',
    frais_divers: '200',
    Periode_achat: '2025-04-01',
    prix_achat: '5000',
    Prix_de_revient: '5200',
    Prix_de_vente: '6000',
    Id_partenaire: 'P001'
  },
  {
    id_livraison: 'LIV002',
    frais_divers: '150',
    Periode_achat: '2025-04-05',
    prix_achat: '3500',
    Prix_de_revient: '3650',
    Prix_de_vente: '4500',
    Id_partenaire: 'P002'
  }
];

export const partenaires: Partenaire[] = [
  { id: 'P001', nom_partenaire: 'Express Logistics' },
  { id: 'P002', nom_partenaire: 'Rapid Delivery' },
  { id: 'P003', nom_partenaire: 'Global Transport' },
  { id: 'P004', nom_partenaire: 'City Courier' }
];

// Générer un nouvel ID de livraison
const generateLivraisonId = (): string => {
  const lastId = livraisons.length > 0 
    ? parseInt(livraisons[livraisons.length - 1].id_livraison.replace('LIV', ''))
    : 0;
  const newId = `LIV${String(lastId + 1).padStart(3, '0')}`;
  return newId;
};

// Service pour gérer les données de livraison
export const LivraisonService = {
  getAll: (): Promise<Livraison[]> => {
    return Promise.resolve([...livraisons]);
  },
  
  getById: (id: string): Promise<Livraison | undefined> => {
    const livraison = livraisons.find(l => l.id_livraison === id);
    return Promise.resolve(livraison);
  },
  
  create: (livraison: Omit<Livraison, 'id_livraison'>): Promise<Livraison> => {
    const newLivraison = {
      ...livraison,
      id_livraison: generateLivraisonId()
    };
    
    livraisons.push(newLivraison);
    return Promise.resolve(newLivraison);
  },
  
  update: (livraison: Livraison): Promise<Livraison | undefined> => {
    const index = livraisons.findIndex(l => l.id_livraison === livraison.id_livraison);
    
    if (index !== -1) {
      livraisons[index] = livraison;
      return Promise.resolve(livraison);
    }
    
    return Promise.resolve(undefined);
  },
  
  delete: (id: string): Promise<boolean> => {
    const initialLength = livraisons.length;
    livraisons = livraisons.filter(l => l.id_livraison !== id);
    
    return Promise.resolve(livraisons.length < initialLength);
  },
  
  getPartenaires: (): Promise<Partenaire[]> => {
    return Promise.resolve([...partenaires]);
  }
};