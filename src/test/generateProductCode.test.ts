import { describe, it, expect } from "vitest";
import { generateProductCode } from "../lib/codeGenerator"; // adapte ce chemin selon ton projet

describe("generateProductCode", () => {
  const marques = [{ id_marque: 1, libelle_marque: "Bosch" }];
  const modeles = [{ id_modele: 2, libelle_modele: "X1000" }];
  const categories = [{ id_categorie: 3, libelle: "Perceuse" }];
  const familles = [{ id_famille: 4, libelle_famille: "Électroportatif" }];

  it("devrait générer un code produit correct", () => {
    const code = generateProductCode(1, 2, 3, 4, marques, modeles, categories, familles);
    expect(code).toBe("BOS-X10-PER-ÉLE");
  });

  it("devrait retourner undefined si une donnée est manquante", () => {
    const code = generateProductCode(99, 2, 3, 4, marques, modeles, categories, familles);
    expect(code).toBeUndefined();
  });
});
