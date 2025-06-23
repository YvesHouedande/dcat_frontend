// This file contains the TypeScript interface for the ReferenceProduit object.
// It defines the structure of the object, including its properties and their types.
import { z } from "zod";
import { imageProduitSchema, referenceSchema } from "../reference/schemas/referenceSchema";


export type ReferenceProduit = z.infer<typeof referenceSchema>;
export type ImageProduit = z.infer<typeof imageProduitSchema>;
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




  export interface categorieTypes{ id_categorie: number; libelle: string; };
  export interface marqueTypes{ id_marque: number; libelle_marque: string; };
  export interface modeleTypes{ id_modele: number; libelle_modele: string; };
  export interface familleTypes{ id_famille: number; libelle_famille: string; };
  export interface typeTypes{ id_type_produit: number; libelle: string; };

  