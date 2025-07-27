import {
  PartenaireResponse,
  Partenaires,
} from "@/modules/administration-Finnance/administration/types/interfaces";
// src/modules/administration-Finance/administration/hooks/usePartenairesApi.ts
import { useCallback } from "react";
import { useApi } from "@/api/api";
import { AxiosError } from "axios";

export const usePartenairesApi = () => {
  const api = useApi();

  const getPartenaires = useCallback(
    async ({
      limit,
      page,
    }: {
      limit: number;
      page: number;
    }): Promise<Partenaires[]> => {
      try {
        const response = await api.get<PartenaireResponse>(
          "/administration/partenaires",
          {
            params: { limit, page },
          }
        );

        const partenairesList = response.data.data;

        if (Array.isArray(partenairesList)) {
          console.log("[API] Partenaires récupérés :", partenairesList);
          return partenairesList;
        } else {
          console.warn(
            "La réponse de l'API pour les partenaires n'est pas un tableau valide.",
            response.data
          );
          return [];
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des partenaires :",
          error
        );
        if (error instanceof Error && "response" in error) {
          const response = (error as AxiosError<{ message: string }>).response;
          const message =
            response?.data?.message || `Erreur serveur (${response?.status})`;
          throw new Error(message);
        }
        throw error;
      }
    },
    [api]
  );

  return { getPartenaires };
};
