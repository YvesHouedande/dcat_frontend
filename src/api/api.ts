// useApi.ts
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
import { useMemo } from "react";
import { toast } from "sonner";

export const api = () => {
  const { keycloak } = useKeycloak();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_APP_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Intercepteur de requête : ajout du token
    instance.interceptors.request.use(
      config => {
        const token = keycloak?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        toast.error("Erreur lors de l'envoi de la requête.");
        return Promise.reject(error);
      }
    );

    // Intercepteur de réponse : gestion des erreurs
    instance.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          const status = error.response.status;

          if (status === 401 || status === 403) {
            toast.error("Accès non autorisé. Veuillez vous reconnecter.");
            // Optionnel : redirection vers la page de login
            // window.location.href = '/login';
          } else if (status === 500) {
            toast.error("Erreur interne du serveur. Veuillez réessayer plus tard.");
          } else {
            toast.error(
              `Erreur ${status} : ${error.response.data?.message || "Une erreur est survenue."}`
            );
          }
        } else if (error.request) {
          toast.error("Le serveur ne répond pas. Vérifiez votre connexion.");
        } else {
          toast.error("Erreur : " + error.message);
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [keycloak?.token]);

  return api;
};

