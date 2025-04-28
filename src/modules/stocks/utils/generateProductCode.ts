// adapte le chemin si besoin
import { ReferenceItem } from "../reference/pages/referenceRegistration";
export function generateProductCode(
  id_marque: number,
  id_modele: number,
  id_categorie: number,
  id_famille: number,
  marques: ReferenceItem[],
  modeles: ReferenceItem[],
  categories: ReferenceItem[],
  familles: ReferenceItem[]
): string | undefined {
  const marqueObj = marques.find((m) => m.id === id_marque);
  const modeleObj = modeles.find((m) => m.id === id_modele);
  const categorieObj = categories.find((c) => c.id === id_categorie);
  const familleObj = familles.find((f) => f.id === id_famille);

  if (
    marqueObj?.code &&
    modeleObj?.code &&
    categorieObj?.code &&
    familleObj?.code
  ) {
    return `${marqueObj.code}-${modeleObj.code}-${categorieObj.code}-${familleObj.code}`;
  }
  return undefined;
}