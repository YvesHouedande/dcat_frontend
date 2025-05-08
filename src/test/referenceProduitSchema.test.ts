import { referenceProduitSchema } from "../modules/stocks/types/reference";
import { z } from "zod";

describe("referenceProduitSchema", () => {
  it("devrait valider un objet correct", () => {
    const validData = {
      id_produit: 1,
      code_produit: "P001",
      desi_produit: "Produit test",
      desc_produit: "Description test",
      image_produit: "image.png",
      emplacement: "A1",
      caracteristiques: "Caractéristiques test",
      id_categorie: 2,
      id_type_produit: 3,
      id_modele: 4,
      id_famille: 5,
      id_marque: 6,
      qte_produit: 10,
    };

    const parsed = referenceProduitSchema.parse(validData);
    expect(parsed).toEqual(validData);
  });

  it("devrait échouer si un champ obligatoire est manquant", () => {
    const invalidData = {
      // desi_produit est requis
      emplacement: "B2",
      id_categorie: 1,
      id_type_produit: 1,
      id_modele: 1,
      id_famille: 1,
      id_marque: 1,
      qte_produit: 5,
    };

    expect(() => referenceProduitSchema.parse(invalidData)).toThrowError(z.ZodError);
  });

  it("devrait échouer si qte_produit n'est pas un nombre", () => {
    const invalidData = {
      desi_produit: "Produit",
      emplacement: "C3",
      id_categorie: 1,
      id_type_produit: 1,
      id_modele: 1,
      id_famille: 1,
      id_marque: 1,
      qte_produit: "non-nombre",
    };

    expect(() => referenceProduitSchema.parse(invalidData)).toThrowError(z.ZodError);
  });
});
