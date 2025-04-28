// src/services/deliveryService.ts
// import { api } from "@/api/api";
import { Delivery } from "../types";

export const deliveryService = {
  getAll: async (): Promise<Delivery[]> => {
    // const response = await api.get("/deliveries");
    const deliveries: Delivery[] = [
        {
          id_livraison: "L001",
          reference: "LIV-20250401",
        },
        {
          id_livraison: "L002",
          reference: "LIV-20250402",
        }
      ];
    // return response.data;
    return deliveries;
  }
};