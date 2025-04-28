// src/hooks/useDeliveries.ts
import { useState, useCallback, useEffect } from "react";
import { Delivery } from "../types";
import { deliveryService } from "../services/delivery.service";

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await deliveryService.getAll();
      setDeliveries(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erreur lors du chargement des livraisons"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return { deliveries, loading, error, fetchDeliveries };
};
