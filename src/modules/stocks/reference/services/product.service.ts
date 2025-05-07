// / src/services/productService.ts
import { api } from "@/api/api";
import { ReferenceProduit } from "../../types/reference";

export const productService = {
  getAll: async (): Promise<ReferenceProduit[]> => {
    // const response = await api.get("/products");
  // Données exemple pour l'annuaire de produits
  const productsData: ReferenceProduit[] = [
    {
      id_produit: 1,
      code_produit: "PROD-001",
      desi_produit: "Ordinateur Portable Pro",
      desc_produit:
        "Ordinateur portable avec écran 15 pouces, 16GB RAM, 512GB SSD.",
      image_produit: "https://example.com/images/prod001.jpg",
      qte_produit: 25,
      emplacement: "A1-B2",
      caracteristiques: "Intel i7, Full HD, Wi-Fi 6",
      id_categorie: 1,
      id_type_produit: 1,
      id_modele: 1,
      id_famille: 1,
      id_marque: 1,
    },
    {
      id_produit: 2,
      code_produit: "PROD-002",
      desi_produit: "Écran LED 24 pouces",
      desc_produit: "Écran LED Full HD avec connectique HDMI et VGA.",
      image_produit: "https://example.com/images/prod002.jpg",
      qte_produit: 40,
      emplacement: "B3-C1",
      caracteristiques: "1080p, HDMI, 75Hz",
      id_categorie: 1,
      id_type_produit:1,
      id_modele: 1,
      id_famille: 1,
      id_marque: 1,
    },
    {
      id_produit: 3,
      code_produit: "PROD-003",
      desi_produit: "Clavier mécanique RGB",
      desc_produit:
        "Clavier gaming avec rétroéclairage RGB et switches rouges.",
      image_produit: "https://example.com/images/prod003.jpg",
      qte_produit: 60,
      emplacement: "C2-D3",
      caracteristiques: "AZERTY, Switchs Red, USB",
      id_categorie: 1,
      id_type_produit:1,
      id_modele: 1,
      id_famille: 1,
      id_marque: 1,
    },
    {
      id_produit: 4,
      code_produit: "PROD-004",
      desi_produit: "Imprimante laser multifonction",
      desc_produit: "Imprimante laser avec scanner et copieur intégré.",
      image_produit: "https://example.com/images/prod004.jpg",
      qte_produit: 15,
      emplacement: "E4-F1",
      caracteristiques: "Wi-Fi, Duplex, A4",
      id_categorie: 1,
      id_type_produit:1,
      id_modele: 1,
      id_famille: 1,
      id_marque: 1,
    },
    {
      id_produit: 5,
      code_produit: "PROD-005",
      desi_produit: "Disque dur externe 1TB",
      desc_produit: "Stockage portable USB 3.0 de 1 To.",
      image_produit: "https://example.com/images/prod005.jpg",
      qte_produit: 80,
      emplacement: "G2-H3",
      id_categorie: 1,
      id_type_produit:1,
      id_modele: 1,
      id_famille: 1,
      id_marque: 1,
    },
    {
      id_produit: 6,
      code_produit: "PROD-006",
      desi_produit: "Routeur Wi-Fi 6",
      desc_produit: "Routeur performant pour maisons connectées.",
      image_produit: "https://example.com/images/prod006.jpg",
      qte_produit: 30,
      emplacement: "H1-I2",
      caracteristiques: "Wi-Fi 6, 5GHz, MU-MIMO",
      id_categorie: 1,
      id_type_produit: 1,
      id_modele: 1,
      id_famille: 1,
      id_marque: 1,
    },
    {
      id_produit: 7,
      code_produit: "PROD-007",
      desi_produit: "Casque sans fil Bluetooth",
      desc_produit: "Casque avec réduction de bruit active.",
      image_produit: "https://example.com/images/prod007.jpg",
      qte_produit: 50,
      emplacement: "I4-J1",
      caracteristiques: "ANC, Bluetooth 5.0, Autonomie 20h",
      id_categorie: 1,
      id_type_produit:1,
      id_modele: 1,
      id_famille: 1,
      id_marque: 1,
    },
    {
      id_produit: 8,
      code_produit: "PROD-008",
      desi_produit: "Souris ergonomique",
      desc_produit: "Souris sans fil conçue pour réduire la fatigue.",
      image_produit: "https://example.com/images/prod008.jpg",
      qte_produit: 70,
      emplacement: "J3-K2",
      caracteristiques: "2.4GHz, Ergonomique, USB",
      id_categorie: 1,
      id_type_produit:1,
      id_modele: 1,
      id_famille: 1,
      id_marque: 1,
    },
    {
      id_produit: 9,
      code_produit: "PROD-009",
      desi_produit: "Station d'accueil USB-C",
      desc_produit: "Dock USB-C avec ports HDMI, USB 3.0, Ethernet.",
      image_produit: "https://example.com/images/prod009.jpg",
      qte_produit: 35,
      emplacement: "K1-L1",
      caracteristiques: "USB-C, Power Delivery, 4K HDMI",
      id_categorie: 1,
      id_type_produit: 1,
      id_modele: 1,
      id_famille: 1,
      id_marque: 1,
    },
    {
      id_produit: 10,
      code_produit: "PROD-010",
      desi_produit: "Tablette graphique",
      desc_produit: "Tablette pour dessinateurs et graphistes, stylet inclus.",
      image_produit: "https://example.com/images/prod010.jpg",
      qte_produit: 20,
      emplacement: "L3-M1",
      caracteristiques: "8192 niveaux de pression, USB",
      id_categorie: 1,
      id_type_produit: 1,
      id_modele: 1,
      id_famille: 1,
      id_marque: 1,
    },
  ];
      return productsData ;
      // return response.data;
  },

    // Récupérer un produit par son ID
  getById: async (id: string | number): Promise<ReferenceProduit> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  // Créer un nouveau produit
  create: async (produit: ReferenceProduit): Promise<ReferenceProduit> => {
    const response = await api.post("/products", produit);
    return response.data;
  },
  
  // Mettre à jour un produit
  update: async (produit: ReferenceProduit): Promise<ReferenceProduit> => {
    const response = await api.put(`/products/${produit.id_produit}`, produit);
    return response.data;
  },
  
  // Supprimer un produit
  delete: async (id: string | number): Promise<void> => {
    await api.delete(`/products/${id}`);
  }
};