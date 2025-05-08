// This file contains the TypeScript interface for the ReferenceProduit object.
// It defines the structure of the object, including its properties and their types.
import { z } from "zod";
import { referenceSchema } from "../reference/schemas/referenceSchema";

export const referenceProduitSchema = referenceSchema.extend({
  qte_produit: z.number(),
});

export type ReferenceProduit = z.infer<typeof referenceProduitSchema>;

// export interface  ReferenceProduit {
  //   id_produit: string | number;
  //   code_produit: string;
  //   desi_produit: string;
  //   desc_produit: string;
  //   image_produit: string;
  //   qte_produit: number;
  //   emplacement: string;
  //   caracteristiques: string;
  //   categorie: string | number;
  //   type_produit: string | number;
  //   modele: string | number;
  //   famille: string |number;
  //   marque: string |number;
  // }


  export interface produitTypes{ id: number; libelle_produit: string; };
  export interface categorieTypes{ id: number; libelle_categorie: string; };
  export interface marqueTypes{ id: number; libelle_marque: string; };
  export interface modeleTypes{ id: number; libelle_modele: string; };
  export interface familleTypes{ id: number; libelle_famille: string; };

  