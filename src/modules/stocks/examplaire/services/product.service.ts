// / src/services/productService.ts
// import { api } from "@/api/api";
import { Product } from "../types";

export const productService = {
  getAll: async (): Promise<Product[]> => {
    // const response = await api.get("/products");
    const data: Product[] = [
        {
          id_produit: "P001",
          code_produit: "PRD-001",
          desi_produit: "Clé USB 16 Go",
        },
        {
          id_produit: "P002",
          code_produit: "PRD-002",
          desi_produit: "Souris sans fil",
        },
        {
          id_produit: "P003",
          code_produit: "PRD-003",
          desi_produit: "Clavier mécanique",
        }
      ];
      return data ;
      // return response.data;
  }
};