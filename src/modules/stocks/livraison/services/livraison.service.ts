
import { Livraison, Partenaire } from "../types/types";
import { api } from "@/api/api";

// Liste simulée de partenaires
export const partenairesMock: Partenaire[] = [
  { id_partenaire: 1, nom_partenaire: "Société Alpha" },
  { id_partenaire: 2, nom_partenaire: "Transports Beta"},
  { id_partenaire: 3, nom_partenaire: "Logistique Gamma" },
];
// Simuler les fonctions d'API - remplacer par vos appels réels
export const fetchLivraisons = async (): Promise<Livraison[]> => {
  // Appel API réel à implémenter
  
  const livraisons: Livraison[] = [
    {
      id_livraison: 1,
      frais_divers: "200",
      Periode_achat: "2025-04",
      prix_achat: "1500",
      prix_de_revient: "1700",
      prix_de_vente: "2000",
      reference: "REF-001",
      id_partenaire: 10,
    },
    {
      id_livraison: 2,
      frais_divers: "300",
      Periode_achat: "2025-03",
      prix_achat: "1800",
      prix_de_revient: "2000",
      prix_de_vente: "2400",
      reference: "REF-002",
      id_partenaire: 11,
    },
    {
      id_livraison: 3,
      frais_divers: "150",
      Periode_achat: "2025-02",
      prix_achat: "1200",
      prix_de_revient: "1350",
      prix_de_vente: "1600",
      reference: "REF-003",
      id_partenaire: 12,
    },
  ];
  
  return livraisons;
};

export const fetchPartenaires = async (): Promise<Partenaire[]> => {
  // Appel API réel à implémenter
  return partenairesMock;
};

export const createLivraison = async (livraison: Livraison): Promise<Livraison> => {
  // Appel API réel à implémenter
  const response = await api.get(`/livraison/${livraison}`);
  return response.data;
};

export const updateLivraison = async (livraison: Livraison): Promise<Livraison> => {
  // Appel API réel à implémenter
  const response = await api.get(`/livraison/${livraison}`);
  return response.data;
};

export const deleteLivraison = async (id: number): Promise<void> => {
  // Appel API réel à implémenter
  const response = await api.get(`/livraison/${id}`);
  return response.data;
};

    // Récupérer un produit par son ID
 export const  LivraisonById = async (id: string | number): Promise<Livraison> => {
    const response = await api.get(`/livraison/${id}`);
    return response.data;
  };
  