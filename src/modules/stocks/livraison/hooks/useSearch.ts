import { useMemo, useState } from "react";
import { Livraison, Partenaire } from "../types/types";

export const useSearch = (livraisons: Livraison[], partenaireDict: Record<number, Partenaire>) => {
    const [searchQuery, setSearchQuery] = useState("");
  
    // Filtrer les livraisons en fonction de la recherche
    const filteredLivraisons = useMemo(() => {
      if (!searchQuery.trim()) {
        return livraisons;
      }
  
      const query = searchQuery.toLowerCase();
      return livraisons.filter((livraison) => {
        // Vérifier si la référence contient la recherche
        const matchReference = livraison.reference?.toLowerCase().includes(query);
        
        // Vérifier si le nom du partenaire contient la recherche
        const partenaire = partenaireDict[livraison.id_partenaire];
        const matchPartenaire = partenaire?.nom_partenaire?.toLowerCase().includes(query);
        
        // Retourner true si l'un des deux correspond
        return matchReference || matchPartenaire;
      });
    }, [searchQuery, livraisons, partenaireDict]);
  
    // Réinitialiser la recherche
    const resetSearch = () => {
      setSearchQuery("");
    };
  
    return {
      searchQuery,
      setSearchQuery,
      filteredLivraisons,
      resetSearch
    };
  };