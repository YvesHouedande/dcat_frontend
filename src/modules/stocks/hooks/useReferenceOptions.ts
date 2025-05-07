import { marqueTypes, modeleTypes, categorieTypes, familleTypes } from "../types/reference";

export function useReferenceOptions() {
  const categories: categorieTypes[] = [
    { id: 1, libelle_categorie: "Électronique" },
    { id: 2, libelle_categorie: "Informatique" },
    { id: 3, libelle_categorie: "Mobilier" },
  ];

  const modeles: modeleTypes[] = [
    { id: 3, libelle_modele: "Modèle A" },
    { id: 4, libelle_modele: "Modèle B" },
    { id: 5, libelle_modele: "Modèle C" },
  ];

  const familles: familleTypes[] = [
    { id: 6, libelle_famille: "Famille X" },
    { id: 7, libelle_famille: "Famille Y" },
    { id: 8, libelle_famille: "Famille Z" },
  ];

  const marques: marqueTypes [] = [
    { id: 9, libelle_marque: "Samsung" },
    { id: 10, libelle_marque: "Apple" },
    { id: 11, libelle_marque: "Dell" },
  ];



  return { categories, modeles, familles, marques };
}