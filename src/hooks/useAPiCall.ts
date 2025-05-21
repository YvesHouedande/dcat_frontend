// src/hooks/useApiCall.ts
import { useState } from 'react';

// Type générique pour la fonction d'API
type ApiFunction<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

export const useApiCall = <T, Args extends unknown[] = unknown[]>(
  apiFunction: ApiFunction<T, Args>
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = async (...args: Args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur API");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, call };
};