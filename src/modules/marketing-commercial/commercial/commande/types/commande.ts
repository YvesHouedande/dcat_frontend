// types/commande.ts
import { ReferenceProduit } from "@/modules/stocks/types/reference";
import { ImageProduit, typeTypes } from "@/modules/stocks/types/reference";
import {
  familleTypes,
  modeleTypes,
  marqueTypes,
} from "@/modules/stocks/types/reference";
import { ExemplaireProduit } from "@/modules/stocks/exemplaire/schemas/ExemplaireProduitSchema";
import { formCommandeSchema } from "../schemas/CommandeSchema";
import { z } from "zod";

export interface Clients {
  id: number | string;
  nom: string;
  contact: string;
  email: string;
  role: string;
}
export interface ProduitDetail {
  produit: ReferenceProduit;
  prix_unitaire: number;
  quantite: number;
  images: ImageProduit[];
  caracteristiques: string;
  famille: familleTypes;
  marque: marqueTypes;
  modele: modeleTypes;
  type: typeTypes;
}

export interface partenaire {
  id_partenaire: number | string;
  nom_partenaire: string;
  telephone_partenaire: string;
  email_partenaire: string;
  specialite: string;
  localisation: string;
  type_partenaire: string;
  statut: string;
  id_entite: number | string;
}

export interface Commande {
  id_commande: number;
  date_de_commande: string;
  etat_commande: "en_attente" | "retournee" | "livree" | "annulee" | "en_cours";
  date_livraison: string | null;
  lieu_de_livraison: string;
  mode_de_paiement: "Espèce" | "Carte bancaire" | "Mobile Money" | "Virement";
  commande_produits_reserves: boolean;
  client: Clients;
  partenaire: partenaire;
  created_at: string;
  updated_at: string;
  produits?: ProduitDetail[];
  montant_total: number;
}

export interface CommandeData {
  commande: Commande;
  montant_total: number;
  nb_articles: number;
}

export interface UpdateCommande
  extends Omit<Commande, "mode_de_paiement" | "client" | "partenaire"> {
  id_client: number | string;
  id_partenaire: number | string;
  mode_de_paiement: string;
}
export interface CommandeDetail extends Commande {
  produits?: ProduitDetail[];
  montant_total: number;
  exemplaires: ExemplaireProduit[];
}

export type CommandeFormValues = z.infer<typeof formCommandeSchema>;

export type CommandeFormValuesWithProduits = {
  lieu_de_livraison: string;
  mode_de_paiement: string;
  id_client: number;
  produits: {
    id_produit: number | string;
    quantite: number;
  }[];
};

export interface CommandeServiceResponse {
  data: CommandeData[]; // Le tableau des produits aplati
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface CommandeApiResponse {
  data: CommandeData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CommandeFilter {
  search?: string;
  date_de_commande?: string;
  etat_commande?: string;
  date_livraison?: string;
  lieu_de_livraison?: string;
  mode_de_paiement?: string;
}

export enum etat_commande {
  "en_attente" = "en_attente",
  "retournee" = "retournee",
  "livree" = "livree",
  "annulee" = "annulee",
  "en_cours" = "en_cours",
}

export enum mode_de_paiement {
  "Espèce" = "Espèce",
  "Carte bancaire" = "Carte bancaire",
  "Mobile Money" = "Mobile Money",
  "Virement" = "Virement",
}
