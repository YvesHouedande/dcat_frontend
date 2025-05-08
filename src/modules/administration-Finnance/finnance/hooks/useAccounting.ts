import { Fichier } from "../data/mockFichier";
import { fetchFichiers } from "../data/mockFichier";
import { useCallback } from "react";

export function useAccounting() {
  const getFichiers = useCallback(async (type?: Fichier["type"]): Promise<{
    data: Fichier[];
    error?: string;
  }> => {
    try {
      const data = await fetchFichiers(type);
      return { data };
    } catch (error) {
      return { data: [], error: error instanceof Error ? error.message : String(error) };
    }
  }, []);

  return { getFichiers };
}
