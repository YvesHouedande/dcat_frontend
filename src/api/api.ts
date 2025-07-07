// useApi.ts
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
import { useMemo } from "react";
import { toast } from "sonner";

export function getAxiosErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Une erreur est survenue"
    );
  }
  return "Une erreur inattendue s’est produite";
}
export const useApi = () => {
  const { keycloak } = useKeycloak();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_APP_API_URL,
    });

    instance.interceptors.request.use(
      (config) => {
        const token = keycloak?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        toast.error(
          "Erreur lors de l'envoi de la requête." + getAxiosErrorMessage(error)
        );
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => {
        if (response.data && response.data.message) {
          toast.message(response.data.message);
        }
        return response;
      },
      (error) => {
        if (error.response) {
          const status = error.response.status;

          if (status === 401 || status === 403) {
            toast.error("Accès non autorisé. Veuillez vous reconnecter.");
          } else if (status === 500) {
            toast.error(
              "Erreur interne du serveur." + getAxiosErrorMessage(error)
            );
          } else {
            toast.error(`Erreur ${status} : ${getAxiosErrorMessage(error)}`);
          }
        } else if (error.request) {
          toast.error(
            "Le serveur ne répond pas. Vérifiez votre connexion." +
              getAxiosErrorMessage(error)
          );
        } else {
          toast.error(
            "Erreur : " + error.message + " " + getAxiosErrorMessage(error)
          );
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [keycloak?.token]);

  return api;
};
