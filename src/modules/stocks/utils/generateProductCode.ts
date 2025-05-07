// adapte le chemin si besoin
import { marqueTypes,modeleTypes, categorieTypes, familleTypes } from "../types/reference";

function getFirstThreeUpper(str: string): string {
  return str.slice(0, 3).toUpperCase();
}
export function generateProductCode(
  id_marque: number | number,
  id_modele: number | number,
  id_categorie: number | number,
  id_famille: number | number,
  marques: marqueTypes[],
  modeles: modeleTypes[],
  categories: categorieTypes[],
  familles: familleTypes[]
): string | undefined {
  const marqueObj = marques.find((m) => m.id === id_marque);
  const modeleObj = modeles.find((m) => m.id === id_modele);
  const categorieObj = categories.find((c) => c.id === id_categorie);
  const familleObj = familles.find((f) => f.id === id_famille);

  if (
    marqueObj?.id &&
    modeleObj?.id &&
    categorieObj?.id &&
    familleObj?.id
  ) {
    return `${getFirstThreeUpper(marqueObj.libelle_marque)}-${getFirstThreeUpper(modeleObj.libelle_modele)}-${getFirstThreeUpper(categorieObj.libelle_categorie)}-${getFirstThreeUpper(familleObj.libelle_famille)}`;
  }
  return undefined;
}