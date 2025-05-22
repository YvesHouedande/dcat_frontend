// src/hooks/useApiCall.ts
import { useState, useCallback, useRef, useEffect } from 'react'; // Importez useEffect

// Type générique pour la fonction d'API
type ApiFunction<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

export const useApiCall = <T, Args extends unknown[] = unknown[]>(
  apiFunction: ApiFunction<T, Args>
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Référence pour suivre si le composant est toujours monté
  const isMounted = useRef(true);

  // Utiliser useEffect pour gérer le cycle de vie de isMounted
  useEffect(() => {
    // Ce code s'exécute au montage du composant
    isMounted.current = true;
    return () => {
      // Ce code s'exécute au démontage du composant (cleanup function)
      isMounted.current = false;
    };
  }, []); // Le tableau de dépendances vide signifie que cet effet ne s'exécute qu'une fois

  const call = useCallback(async (...args: Args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);

      // Vérifier si le composant est toujours monté avant de mettre à jour l'état
      if (isMounted.current) {
        setData(result);
      }

      return result;
    } catch (err) {
      // Vérifier si le composant est toujours monté avant de mettre à jour l'état
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : "Erreur API");
        console.error("Erreur API:", err); // Ajout d'un console.error plus détaillé ici
      }
      throw err; // Re-lancez l'erreur pour que le composant utilisateur puisse la gérer si nécessaire
    } finally {
      // Vérifier si le composant est toujours monté avant de mettre à jour l'état
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [apiFunction]); // apiFunction est une dépendance car 'call' en dépend

  return { data, loading, error, call };
};