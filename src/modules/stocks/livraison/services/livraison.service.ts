
import { Livraison, Partenaire } from "../types/types";

// Liste simulée de partenaires
export const partenairesMock: Partenaire[] = [
  { id_partenaire: 1, nom_partenaire: "Société Alpha" },
  { id_partenaire: 2, nom_partenaire: "Transports Beta"},
  { id_partenaire: 3, nom_partenaire: "Logistique Gamma" },
];
// Simuler les fonctions d'API - remplacer par vos appels réels
export const fetchLivraisons = async (): Promise<Livraison[]> => {
  // Appel API réel à implémenter
  return [];
};

export const fetchPartenaires = async (): Promise<Partenaire[]> => {
  // Appel API réel à implémenter
  return partenairesMock;
};

export const createLivraison = async (livraison: Livraison): Promise<Livraison> => {
  // Appel API réel à implémenter
  return livraison;
};

export const updateLivraison = async (livraison: Livraison): Promise<Livraison> => {
  // Appel API réel à implémenter
  return livraison;
};

export const deleteLivraison = async (id: number): Promise<void> => {
  // Appel API réel à implémenter
};