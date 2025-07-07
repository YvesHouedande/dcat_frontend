
import { AchatFormValues } from "../pages";
import { Partenaire } from "../types/types";
import { useApi } from "@/api/api";

// Liste simulée de partenaires
export const partenairesMock: Partenaire[] = [
  { id_partenaire: 1, nom_partenaire: "Société Alpha" },
  { id_partenaire: 2, nom_partenaire: "Transports Beta"},
  { id_partenaire: 3, nom_partenaire: "Logistique Gamma" },
];

export const LivraisonService = () => {
  const api = useApi();
  return {
    fetchLivraisons: async (): Promise<AchatFormValues[]> => {
      const response = await api.get(`stocks/livraisons/`);
      console.log("Livraisons fetched:", response.data);
      return response.data;
    },

    fetchPartenaires: async (): Promise<Partenaire[]> => {
      // Appel API réel à implémenter
      return partenairesMock;
    },

    createLivraison: async (livraison: Partial<AchatFormValues>): Promise<AchatFormValues> => {
      const response = await api.post(`stocks/livraisons/`, livraison);
      return response.data;
    },

    updateLivraison: async (livraison: Partial<AchatFormValues>): Promise<AchatFormValues> => {
      const response = await api.put(`stocks/livraisons/${livraison.id_livraison}`, livraison);
      return response.data;
    },

    deleteLivraison: async (id: number | string): Promise<void> => {
      await api.delete(`stocks/livraisons/${id}`);
    },

    LivraisonById: async (id: string | number): Promise<AchatFormValues> => {
      const response = await api.get(`stocks/livraisons/${id}`);
      return response.data;
    },
  }
}