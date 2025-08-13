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
      error.response?.data?.details ||
      "Une erreur est survenue"
    );
  }
  return "Une erreur inattendue s'est produite";
}

export const useApi = () => {
  const { keycloak, initialized } = useKeycloak();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_APP_API_URL,
    });

    instance.interceptors.request.use(
      async (config) => {
        // Vérifier que Keycloak est initialisé
        if (!initialized) {
          console.warn("Keycloak not initialized yet");
          return config;
        }

        // Vérifier si l'utilisateur est authentifié
        if (!keycloak?.authenticated) {
          console.warn("User not authenticated");
          return config;
        }

        // Vérifier si le token existe et n'est pas expiré
        if (keycloak.token) {
          // Actualiser le token s'il expire bientôt (dans les 30 secondes)
          try {
            const refreshed = await keycloak.updateToken(30);
            if (refreshed) {
              console.log("Token refreshed");
            }
          } catch (error) {
            console.error("Failed to refresh token:", error);
            // Optionnel : rediriger vers la page de connexion
            // keycloak.login();
          }

          // Ajouter le token aux headers
          config.headers.Authorization = `Bearer ${keycloak.token}`;
          console.log("Token added to request headers");
        } else {
          console.warn("No token available");
        }

        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        toast.error(
          "Erreur lors de l'envoi de la requête: " + getAxiosErrorMessage(error)
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
      async (error) => {
        if (error.response) {
          const status = error.response.status;
          if (status === 404) {
            toast.warning(getAxiosErrorMessage(error));
            return Promise.reject(error);
          }
          if (status === 401) {
            toast.error("Session expirée. Reconnexion en cours...");
            // Essayer de rafraîchir le token
            try {
              if (keycloak?.authenticated) {
                await keycloak.updateToken(-1); // Force refresh
                // Retry the original request
                return instance.request(error.config);
              } else {
                keycloak?.login();
              }
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              keycloak?.login();
            }
          } else if (status === 403) {
            toast.error("Accès non autorisé.");
          } else if (status === 500) {
            console.error(
              "Erreur interne du serveur: " + getAxiosErrorMessage(error)
            );
          } else {
            toast.error(`Erreur ${status}: ${getAxiosErrorMessage(error)}`);
          }
        } else if (error.request) {
          toast.error("Le serveur ne répond pas. Vérifiez votre connexion. ", {
            description: getAxiosErrorMessage(error),
          });
        } else {
          toast.error("Erreur: " + error.message);
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [initialized, keycloak]);

  return api;
};
