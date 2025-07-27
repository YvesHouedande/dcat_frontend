// src/modules/administration/hooks/useEmployesApi.ts
import { useCallback } from "react";
import { useApi } from "@/api/api";
import { Employe, EmployeResponse } from "../../types/types";

export const useEmployesApi = () => {
  const api = useApi();

  const getEmployes = useCallback(
    async ({
      limit,
      page,
    }: {
      limit: number;
      page: number;
    }): Promise<Employe[]> => {
      try {
        const response = await api.get<EmployeResponse>(
          "/administration/employes",
          {
            params: { limit, page },
          }
        );
        return response.data.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des employés :", error);
        throw error;
      }
    },
    [api]
  );

  return { getEmployes };
};
