import { Fichier } from "../data/mockFichier";
import { fetchFichiers } from "../data/mockFichier";

export function useAccounting() {
  const getFichiers = async (type?: Fichier["type"]): Promise<{
    data: Fichier[];
    error?: string;
  }> => {
    try {
      const data = await fetchFichiers(type);
      return { data };
    } catch (error) {
      return { data: [], error: "Erreur de chargement" };
    }
  };

  return { getFichiers };
}