import axios, { AxiosError } from "axios";
import {
  Projet,
  ApiResponse,
  Document,
  CreateDocumentTextPayload,
  Livrable,
  Tache,
  Partenaire,
} from "../../types/types"; // Assurez-vous que le chemin est correct et que Document et CreateDocumentTextPayload sont importés
import { deleteTacheSafely, getTachesByProjet } from "../../tasks/api/taches"; // Chemin relatif vers src/api/taches.ts
import {
  deleteLivrable,
  getLivrablesByProjetId,
} from "../../livrables/api/livrables"; // Chemin relatif vers src/api/livrables.ts
import { omit } from "@/lib/utils";

const API_URL = import.meta.env.VITE_APP_API_URL;

// Crée une instance Axios pour les requêtes API avec une base URL et des en-têtes communs.
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json", // Type de contenu par défaut pour les requêtes JSON
  },
});

// Intercepteur de réponse Axios pour gérer les erreurs de manière centralisée.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Erreur de réponse du serveur (par exemple, 4xx, 5xx)
      console.error(
        `Erreur API Projets - Statut: ${error.response.status}`,
        `Données: ${JSON.stringify(error.response.data)}`,
        `URL: ${error.config?.url}`,
        `Méthode: ${error.config?.method}`
      );
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue (erreur réseau)
      console.error(
        `Erreur réseau Projets - Pas de réponse du serveur pour: ${error.config?.url}`,
        `Méthode: ${error.config?.method}`,
        error.message
      );
    } else {
      // Erreur lors de la configuration de la requête
      console.error(
        `Erreur inattendue Projets lors de la requête: ${error.message}`,
        error.config
      );
    }
    return Promise.reject(error); // Propage l'erreur pour un traitement ultérieur
  }
);

// Fonction pour créer un nouveau projet
// MODIFICATION CLÉ: Retourne directement l'objet 'projet' extrait de la réponse API.
// Dans votre fichier api/projets.ts
export const createProjet = async (
  projetData: Omit<Projet, "id_projet" | "id_partenaire">
) => {
  try {
    console.log("Données envoyées à l'API:", projetData);

    const response = await apiClient.post(
      `${API_URL}/technique/projets`,
      projetData
    ); // Utilisez apiClient ici

    // Avec Axios, les données de l'API sont dans response.data
    const apiResponse = response.data;

    console.log("Réponse de l'API createProjet:", apiResponse);

    // Vérifier la structure de la réponse
    if (!apiResponse.success) {
      throw new Error(
        apiResponse.message || "Erreur lors de la création du projet"
      );
    }

    // Vérifier que les données du projet existent
    if (!apiResponse.data || !apiResponse.data.projet) {
      throw new Error("Données du projet manquantes dans la réponse API");
    }

    // Retourner la réponse de l'API (pas l'objet response d'Axios)
    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("=== ERREUR AXIOS DÉTAILLÉE ===");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Headers:", error.response?.headers);
      console.error("Données de réponse:", error.response?.data);
      console.error("Config de la requête:", error.config?.data);
      console.error("URL:", error.config?.url);
      console.error("Méthode:", error.config?.method);

      // Vérifier si c'est une erreur de validation ou autre
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Erreur serveur (${error.response?.status})`;

      throw new Error(errorMessage);
    } else {
      console.error("Erreur non-Axios lors de la création du projet:", error);
      throw error;
    }
  }
};

// Fonction pour ajouter un partenaire à un projet spécifique
export const addPartenaireToProjet = async (
  projectId: number,
  partnerId: number
): Promise<Partenaire> => {
  try {
    const response = await apiClient.post(
      `${API_URL}/technique/projets/${projectId}/partenaires`,
      {
        // Utilisez apiClient ici
        id_partenaire: partnerId,
      }
    );
    return response.data; // Le backend pourrait retourner la confirmation ou l'objet partenaire ajouté
  } catch (error) {
    console.error(
      `Erreur lors de l'ajout du partenaire ${partnerId} au projet ${projectId} :`,
      error
    );
    throw error; // Propager l'erreur
  }
};

// Fonction pour récupérer un projet par son ID
export const getProjetById = async (
  id: number
): Promise<Omit<Projet, "id_partenaire"> | undefined> => {
  try {
    console.log(`[API] Tentative de récupération du projet ${id}...`);
    const response = await apiClient.get(`${API_URL}/technique/projets/${id}`); // Utilisez apiClient ici
    const apiResponse = response.data;

    console.log(`[API] Projet ${id} récupéré:`, apiResponse);

    if (!apiResponse.success && apiResponse.data === null) {
      console.warn(`Projet ${id} non trouvé via l'API.`);
      return undefined; // Retourne undefined si le projet n'est pas trouvé
    }
    if (!apiResponse.data) {
      throw new Error(
        "Données du projet manquantes dans la réponse API pour getProjetById"
      );
    }
    // Retourne l'objet projet sans le tableau id_partenaire, car il n'est pas dans cette réponse
    return apiResponse.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.warn(`Projet ${id} introuvable (404).`);
        return undefined; // Gérer spécifiquement le cas 404 comme un projet non trouvé
      }
      console.error("=== ERREUR AXIOS DÉTAILLÉE (récupération projet) ===");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Headers:", error.response?.headers);
      console.error("Données de réponse:", error.response?.data);
      console.error("Config de la requête:", error.config?.data);
      console.error("URL:", error.config?.url);
      console.error("Méthode:", error.config?.method);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Erreur serveur lors de la récupération (${error.response?.status})`;
      throw new Error(errorMessage);
    } else {
      console.error(
        "Erreur non-Axios lors de la récupération du projet:",
        error
      );
      throw error;
    }
  }
};

// Fonction pour récupérer les IDs des partenaires associés à un projet
export const getProjetAssociatedPartenaires = async (
  projectId: number
): Promise<number[]> => {
  try {
    console.log(
      `[API] Tentative de récupération des partenaires associés au projet ${projectId}...`
    );
    // Assumons que cet endpoint retourne un tableau d'objets partenaires { id_partenaire: number, nom_partenaire: string }
    const response = await apiClient.get(
      `${API_URL}/technique/projets/${projectId}/partenaires`
    ); // Utilisez apiClient ici
    const apiResponse = response.data;

    console.log(
      `[API] Partenaires associés au projet ${projectId} récupérés:`,
      apiResponse
    );

    if (!apiResponse.success || !Array.isArray(apiResponse.data)) {
      console.warn(
        `Aucun partenaire ou données invalides pour le projet ${projectId}.`
      );
      return []; // Retourne un tableau vide si pas de succès ou si les données ne sont pas un tableau
    }
    // Extraire seulement les IDs des partenaires
    return apiResponse.data.map((p: Partenaire) => p.id_partenaire);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "=== ERREUR AXIOS DÉTAILLÉE (récupération partenaires associés) ==="
      );
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Headers:", error.response?.headers);
      console.error("Données de réponse:", error.response?.data);
      console.error("Config de la requête:", error.config?.data);
      console.error("URL:", error.config?.url);
      console.error("Méthode:", error.config?.method);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Erreur serveur lors de la récupération des partenaires associés (${error.response?.status})`;
      throw new Error(errorMessage);
    } else {
      console.error(
        "Erreur non-Axios lors de la récupération des partenaires associés:",
        error
      );
      throw error;
    }
  }
};

// Fonction pour mettre à jour un projet existant
export const updateProjet = async (projetData: Projet): Promise<Projet> => {
  try {
    console.log(
      `[API] Données envoyées à l'API (mise à jour du projet ${projetData.id_projet}):`,
      projetData
    );

    // Omettre id_partenaire pour la requête PUT/PATCH car il est géré séparément
    //const { id_partenaire, ...projetDataWithoutPartners } = projetData;
    const projetDataWithoutPartners = omit(projetData, ["id_partenaire"]);

    const response = await apiClient.put(
      `${API_URL}/technique/projets/${projetData.id_projet}`,
      projetDataWithoutPartners
    ); // Utilisez apiClient ici
    const apiResponse = response.data;

    console.log(
      `[API] Réponse complète de l'API updateProjet (${projetData.id_projet}):`,
      apiResponse
    );

    // Vérifier d'abord si la réponse indique un succès
    if (apiResponse.success === false) {
      throw new Error(
        apiResponse.message || "Erreur lors de la mise à jour du projet"
      );
    }

    // Gestion flexible de la structure de réponse
    let projetMisAJour: Projet;

    if (apiResponse.data && apiResponse.data.projet) {
      // Structure: { success: true, data: { projet: {...} } }
      projetMisAJour = apiResponse.data.projet;
    } else if (apiResponse.data && !apiResponse.data.projet) {
      // Structure: { success: true, data: {...} } - les données du projet sont directement dans data
      projetMisAJour = apiResponse.data;
    } else if (apiResponse.projet) {
      // Structure: { success: true, projet: {...} }
      projetMisAJour = apiResponse.projet;
    } else {
      // Dernière option: les données sont directement dans apiResponse
      projetMisAJour = apiResponse;
    }

    console.log(`[API] Projet mis à jour extrait:`, projetMisAJour);

    // Vérifier que nous avons bien récupéré un objet projet valide
    if (!projetMisAJour || !projetMisAJour.id_projet) {
      console.error("[API] Structure de réponse inattendue:", apiResponse);
      throw new Error("Structure de réponse API inattendue après mise à jour");
    }

    // S'assurer que id_partenaire est présent dans la réponse (même vide)
    if (
      !Object.prototype.hasOwnProperty.call(projetMisAJour, "id_partenaire")
    ) {
      projetMisAJour.id_partenaire = projetData.id_partenaire || [];
    }

    return projetMisAJour;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("=== ERREUR AXIOS DÉTAILLÉE (mise à jour projet) ===");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Headers:", error.response?.headers);
      console.error("Données de réponse:", error.response?.data);
      console.error("Config de la requête:", error.config?.data);
      console.error("URL:", error.config?.url);
      console.error("Méthode:", error.config?.method);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Erreur serveur lors de la mise à jour (${error.response?.status})`;
      throw new Error(errorMessage);
    } else {
      console.error(
        "Erreur non-Axios lors de la mise à jour du projet:",
        error
      );
      throw error;
    }
  }
};

// Fonction pour désassocier un partenaire d'un projet spécifique
export const removePartenaireFromProjet = async (
  projectId: number,
  partnerId: number
): Promise<Partenaire> => {
  try {
    console.log(
      `[API] Tentative de désassociation du partenaire ${partnerId} du projet ${projectId}...`
    );
    const response = await apiClient.delete(
      `${API_URL}/technique/projets/${projectId}/partenaires/${partnerId}`
    ); // Utilisez apiClient ici
    console.log(
      "Réponse API pour la désassociation du partenaire:",
      response.data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "=== ERREUR AXIOS DÉTAILLÉE (désassociation partenaire) ==="
      );
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Headers:", error.response?.headers);
      console.error("Données de réponse:", error.response?.data);
      console.error("Config de la requête:", error.config?.data);
      console.error("URL:", error.config?.url);
      console.error("Méthode:", error.config?.method);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Échec de la désassociation du partenaire: ${error.response?.statusText}`;
      throw new Error(errorMessage);
    } else {
      console.error(
        "Erreur non-Axios lors de la désassociation du partenaire:",
        error
      );
      throw error;
    }
  }
};

export const deleteProjet = async (
  projectId: number
): Promise<{ success: boolean; message: string; deletedId: number }> => {
  try {
    console.log(`[API] Début de la suppression du projet ${projectId}...`); // Étape 1: Récupérer et supprimer/désassocier les tâches du projet
    console.log(
      `[API] Récupération des tâches associées au projet ${projectId}...`
    );
    let associatedTaches: Tache[] = [];
    try {
      const tachesResponse = await getTachesByProjet(projectId); // Vérifier si la réponse a une propriété 'data' qui est un tableau, ou si la réponse est directement un tableau
      if (tachesResponse.data && Array.isArray(tachesResponse.data)) {
        associatedTaches = tachesResponse.data;
        console.log(
          `[API] Tâches associées trouvées:`,
          associatedTaches.length
        );
      } else if (Array.isArray(tachesResponse)) {
        // Fallback si la réponse API est un tableau direct
        associatedTaches = tachesResponse as Tache[];
        console.log(
          `[API] Tâches associées trouvées (directement en tableau):`,
          associatedTaches.length
        );
      } else {
        console.warn(
          `[API] Structure de réponse inattendue pour les tâches du projet ${projectId}:`,
          tachesResponse
        );
      }
    } catch (error) {
      console.warn(
        `[API] Impossible de récupérer les tâches associées pour le projet ${projectId}:`,
        error
      ); // On continue même en cas d'erreur de récupération des tâches
    }

    if (associatedTaches.length > 0) {
      console.log(
        `[API] Suppression de ${associatedTaches.length} tâche(s)...`
      );
      const tacheDeletionPromises = associatedTaches.map(async (tache) => {
        try {
          console.log(
            `[API] Suppression de la tâche ${tache.id_tache} (libellé: ${tache.nom_tache})...`
          );
          await deleteTacheSafely(tache.id_tache); // Utilise la fonction de suppression sécurisée des tâches
          console.log(`[API] ✓ Tâche ${tache.id_tache} supprimée avec succès`);
          return { success: true, id: tache.id_tache };
        } catch (error) {
          console.error(
            `[API] ✗ Échec de suppression de la tâche ${tache.id_tache}:`,
            error
          );
          return { success: false, id: tache.id_tache, error };
        }
      });
      const tacheDeletionResults = await Promise.allSettled(
        tacheDeletionPromises
      );
      const failedTacheDeletions = tacheDeletionResults.filter(
        (result) => result.status === "rejected"
      );
      if (failedTacheDeletions.length > 0) {
        console.error(
          `[API] ${failedTacheDeletions.length} suppression(s) de tâche(s) ont échoué.`
        ); // Décision: Continuer avec la suppression du projet même si des tâches n'ont pas pu être supprimées. // Le log d'erreur détaillé ci-dessus fournit suffisamment d'informations.
      } else {
        console.log(
          `[API] ✓ Toutes les tâches associées ont été supprimées avec succès`
        );
      }
    } else {
      console.log(`[API] Aucun tâche associée au projet ${projectId}`);
    } // Étape 2: Récupérer et supprimer les livrables du projet

    console.log(
      `[API] Récupération des livrables associés au projet ${projectId}...`
    );
    let associatedLivrables: Livrable[] = [];
    try {
      const livrablesResponse = await getLivrablesByProjetId(projectId); // Vérifier si la réponse a une propriété 'data' qui est un tableau, ou si la réponse est directement un tableau
      if (livrablesResponse.data && Array.isArray(livrablesResponse.data)) {
        associatedLivrables = livrablesResponse.data;
        console.log(
          `[API] Livrables associés trouvés:`,
          associatedLivrables.length
        );
      } else if (Array.isArray(livrablesResponse)) {
        // Fallback si la réponse API est un tableau direct
        associatedLivrables = livrablesResponse as Livrable[];
        console.log(
          `[API] Livrables associés trouvés (directement en tableau):`,
          associatedLivrables.length
        );
      } else {
        console.warn(
          `[API] Structure de réponse inattendue pour les livrables du projet ${projectId}:`,
          livrablesResponse
        );
      }
    } catch (error) {
      console.warn(
        `[API] Impossible de récupérer les livrables associés pour le projet ${projectId}:`,
        error
      ); // On continue même en cas d'erreur de récupération des livrables
    }
    if (associatedLivrables.length > 0) {
      console.log(
        `[API] Suppression de ${associatedLivrables.length} livrable(s)...`
      );
      const livrableDeletionPromises = associatedLivrables.map(
        async (livrable) => {
          try {
            console.log(
              `[API] Suppression du livrable ${livrable.id_livrable} (libellé: ${livrable.libelle_livrable})...`
            );
            await deleteLivrable(livrable.id_livrable); // Utilise la fonction de suppression sécurisée des livrables (qui gère ses propres documents)
            console.log(
              `[API] ✓ Livrable ${livrable.id_livrable} supprimé avec succès`
            );
            return { success: true, id: livrable.id_livrable };
          } catch (error) {
            console.error(
              `[API] ✗ Échec de suppression du livrable ${livrable.id_livrable}:`,
              error
            );
            return { success: false, id: livrable.id_livrable, error };
          }
        }
      );
      const livrableDeletionResults = await Promise.allSettled(
        livrableDeletionPromises
      );
      const failedLivrableDeletions = livrableDeletionResults.filter(
        (result) => result.status === "rejected"
      );
      if (failedLivrableDeletions.length > 0) {
        console.error(
          `[API] ${failedLivrableDeletions.length} suppression(s) de livrable(s) ont échoué.`
        ); // Décision: Continuer avec la suppression du projet même si des livrables n'ont pas pu être supprimés.
      } else {
        console.log(
          `[API] ✓ Tous les livrables associés ont été supprimés avec succès`
        );
      }
    } else {
      console.log(`[API] Aucun livrable associé au projet ${projectId}`);
    } // Étape 3: Récupérer et supprimer les documents directement liés au projet // Cette étape est cruciale car ces documents ne sont pas supprimés via les livrables.

    console.log(
      `[API] Récupération des documents directement liés au projet ${projectId}...`
    );
    let associatedDocuments: Document[] = [];
    try {
      const docsResponse = await getDocumentsByProjetId(projectId);
      if (docsResponse.documents && Array.isArray(docsResponse.documents)) {
        associatedDocuments = docsResponse.documents;
        console.log(
          `[API] Documents du projet trouvés:`,
          associatedDocuments.length
        );
      } else if (docsResponse.data && Array.isArray(docsResponse.data)) {
        associatedDocuments = docsResponse.data;
        console.log(
          `[API] Documents du projet trouvés (via data):`,
          associatedDocuments.length
        );
      } else if (Array.isArray(docsResponse)) {
        // Fallback si la réponse API est un tableau direct
        associatedDocuments = docsResponse as Document[];
        console.log(
          `[API] Documents du projet trouvés (directement en tableau):`,
          associatedDocuments.length
        );
      }
    } catch (error) {
      console.warn(
        `[API] Impossible de récupérer les documents directement liés pour le projet ${projectId}:`,
        error
      ); // On continue même en cas d'erreur de récupération des documents
    }

    if (associatedDocuments.length > 0) {
      console.log(
        `[API] Suppression de ${associatedDocuments.length} document(s) directement lié(s) au projet...`
      );
      const documentDeletionPromises = associatedDocuments.map(async (doc) => {
        try {
          console.log(
            `[API] Suppression du document ${doc.id_documents} (libellé: ${doc.libelle_document}) directement lié au projet ${projectId}...`
          );
          await deleteDocumentFromProjet(projectId, doc.id_documents); // Utilise la fonction de suppression de document du projet
          console.log(
            `[API] ✓ Document ${doc.id_documents} supprimé du projet ${projectId} avec succès`
          );
          return { success: true, id: doc.id_documents };
        } catch (error) {
          console.error(
            `[API] ✗ Échec de suppression du document ${doc.id_documents} du projet ${projectId}:`,
            error
          );
          return { success: false, id: doc.id_documents, error };
        }
      });
      const documentDeletionResults = await Promise.allSettled(
        documentDeletionPromises
      );
      const failedDocumentDeletions = documentDeletionResults.filter(
        (result) => result.status === "rejected"
      );
      if (failedDocumentDeletions.length > 0) {
        console.error(
          `[API] ${failedDocumentDeletions.length} suppression(s) de document(s) direct(s) ont échoué.`
        );
      } else {
        console.log(
          `[API] ✓ Tous les documents directement liés au projet ont été supprimés avec succès`
        );
      }
    } else {
      console.log(
        `[API] Aucun document directement lié au projet ${projectId}`
      );
    } // Étape 4: Récupérer et désassocier les partenaires du projet

    console.log(
      `[API] Récupération des partenaires associés au projet ${projectId}...`
    );
    let associatedPartenaires: number[] = [];
    try {
      associatedPartenaires = await getProjetAssociatedPartenaires(projectId);
      console.log(
        `[API] Partenaires associés trouvés:`,
        associatedPartenaires.length
      );
    } catch (error) {
      console.warn(
        `[API] Impossible de récupérer les partenaires associés pour le projet ${projectId} (peut-être déjà supprimés/dissociés):`,
        error
      );
    }
    if (associatedPartenaires.length > 0) {
      console.log(
        `[API] Dissociation de ${associatedPartenaires.length} partenaire(s)...`
      );
      const dissociationPromises = associatedPartenaires.map(
        async (partnerId) => {
          try {
            console.log(
              `[API] Dissociation du partenaire ${partnerId} du projet ${projectId}...`
            );
            await removePartenaireFromProjet(projectId, partnerId);
            console.log(`[API] ✓ Partenaire ${partnerId} dissocié avec succès`);
            return { success: true, partnerId };
          } catch (error) {
            console.error(
              `[API] ✗ Échec de dissociation du partenaire ${partnerId}:`,
              error
            );
            return { success: false, partnerId, error };
          }
        }
      );
      const dissociationResults = await Promise.allSettled(
        dissociationPromises
      );
      const failedDissociations = dissociationResults
        .filter((result) => result.status === "rejected")
        .map((result) => (result as PromiseRejectedResult).reason);
      if (failedDissociations.length > 0) {
        console.error(
          `[API] ${failedDissociations.length} dissociation(s) ont échoué:`,
          failedDissociations
        ); // Décision: Continuer avec la suppression du projet même si des dissociations ont échoué.
      } else {
        console.log(
          `[API] ✓ Tous les partenaires ont été dissociés avec succès`
        );
      }
    } else {
      console.log(`[API] Aucun partenaire associé au projet ${projectId}`);
    } // Étape 5: Supprimer le projet lui-même

    console.log(`[API] Suppression finale du projet ${projectId}...`);
    const response = await apiClient.delete(
      `${API_URL}/technique/projets/${projectId}`
    ); // Utilisez apiClient ici
    const apiResponse = response.data;
    console.log(
      `[API] Réponse de suppression du projet ${projectId}:`,
      apiResponse
    ); // Vérifier le succès de la suppression
    if (!apiResponse.success) {
      throw new Error(
        apiResponse.message || "Erreur lors de la suppression du projet"
      );
    } // Vérifier que l'ID du projet supprimé est retourné
    if (!apiResponse.data || !apiResponse.data.id) {
      console.warn(`[API] ID du projet supprimé non retourné dans la réponse`);
    }
    const result = {
      success: true,
      message: apiResponse.message || "Projet supprimé avec succès",
      deletedId: apiResponse.data?.id || projectId,
    };
    console.log(`[API] ✓ Projet ${projectId} supprimé avec succès:`, result);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("=== ERREUR AXIOS DÉTAILLÉE (suppression projet) ===");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Headers:", error.response?.headers);
      console.error("Données de réponse:", error.response?.data);
      console.error("URL:", error.config?.url);
      console.error("Méthode:", error.config?.method); // Gestion spécifique des erreurs communes
      if (error.response?.status === 404) {
        throw new Error(
          `Le projet ${projectId} n'existe pas ou a déjà été supprimé`
        );
      } else if (error.response?.status === 409) {
        throw new Error(
          `Impossible de supprimer le projet ${projectId} : il est encore lié à des ressources`
        );
      } else if (error.response?.status === 403) {
        throw new Error(
          `Vous n'avez pas les permissions pour supprimer le projet ${projectId}`
        );
      }
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Erreur serveur lors de la suppression (${error.response?.status})`;
      throw new Error(errorMessage);
    } else {
      console.error(
        "Erreur non-Axios lors de la suppression du projet:",
        error
      );
      throw error;
    }
  }
}; // Fonction utilitaire pour supprimer un projet avec confirmation
export const deleteProjetWithConfirmation = async (
  projectId: number,
  projectName: string
): Promise<{ success: boolean; message: string; deletedId: number }> => {
  try {
    // Optionnel: ajouter une confirmation côté client
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer le projet "${projectName}" ? Cette action est irréversible.`;
    if (typeof window !== "undefined" && !window.confirm(confirmMessage)) {
      throw new Error("Suppression annulée par l'utilisateur");
    }
    return await deleteProjet(projectId);
  } catch (error) {
    console.error(
      `Erreur lors de la suppression du projet ${projectName} (ID: ${projectId}):`,
      error
    );
    throw error;
  }
};

//pour la récupération des projets et autres
export const fetchAllProjets = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  etat?: string,
  partenaireId?: number
): Promise<ApiResponse<Projet[]>> => {
  try {
    console.log(
      `[API] Tentative de récupération des projets (page: ${page}, limit: ${limit}, search: ${search}, etat: ${etat}, partenaireId: ${partenaireId})...`
    );

    const params: {
      page: number;
      limit: number;
      search?: string;
      etat?: string;
      partenaire_id?: number;
    } = {
      page: page,
      limit: limit,
    };

    if (search) params.search = search;
    if (etat && etat !== "tous") params.etat = etat;
    if (partenaireId && partenaireId !== 0) params.partenaire_id = partenaireId;

    const response = await apiClient.get(`${API_URL}/technique/projets`, {
      params: params,
    });
    const apiResponse = response.data;

    console.log(`[API] Projets récupérés:`, apiResponse);

    if (!apiResponse.success && !Array.isArray(apiResponse.data)) {
      console.warn("Aucun projet trouvé ou données invalides.");
      return {
        success: true,
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };
    }

    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("=== ERREUR AXIOS DÉTAILLÉE (récupération projets) ===");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Headers:", error.response?.headers);
      console.error("Données de réponse:", error.response?.data);
      console.error("Config de la requête:", error.config?.data);
      console.error("URL:", error.config?.url);
      console.error("Méthode:", error.config?.method);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Erreur serveur lors de la récupération des projets (${error.response?.status})`;
      throw new Error(errorMessage);
    } else {
      console.error(
        "Erreur non-Axios lors de la récupération des projets:",
        error
      );
      throw error;
    }
  }
};

// NOUVELLES FONCTIONS D'APPEL API POUR LES DOCUMENTS LIÉS AUX PROJETS

/**
 * Récupère tous les documents associés à un projet avec informations de pagination.
 * @param projectId L'ID du projet.
 * @returns Promesse résolue avec l'objet ApiResponse contenant un tableau de Document et la pagination.
 */
export const getDocumentsByProjetId = async (
  projectId: number
): Promise<ApiResponse<Document[]>> => {
  try {
    console.log(
      `[API Projets] Tentative de récupération des documents pour le projet ${projectId}...`
    );
    // Assurez-vous que cet endpoint est correct pour votre backend
    const response = await apiClient.get<ApiResponse<Document[]>>(
      `/technique/projets/${projectId}/documents`
    );

    let docsToReturn: Document[] = [];
    if (response.data.documents && Array.isArray(response.data.documents)) {
      docsToReturn = response.data.documents;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      docsToReturn = response.data.data;
    } else if (Array.isArray(response.data)) {
      // Fallback if API returns direct array of documents
      docsToReturn = response.data;
    }

    if (response.data.pagination) {
      console.log(
        `[API Projets] Pagination pour les documents du projet ${projectId}:`,
        response.data.pagination
      );
    }
    console.log(
      `[API Projets] Réponse complète des documents pour le projet ${projectId}:`,
      response.data
    );

    // Retourne l'objet de réponse complet pour que le composant appelant puisse accéder aux données.
    return {
      ...response.data, // Conserve les autres propriétés de la réponse (comme success, message, pagination)
      documents: docsToReturn, // Assure que la clé 'documents' est toujours un tableau
    };
  } catch (error) {
    console.error(
      `[API Projets] Erreur lors de la récupération des documents pour le projet ${projectId}:`,
      error
    );
    throw error;
  }
};

/**
 * Ajoute un document à un projet spécifique.
 * @param projectId L'ID du projet parent.
 * @param documentFile Le fichier du document (File object).
 * @param textPayload Les métadonnées du document.
 * @returns Promesse résolue avec l'objet Document créé.
 */
export const addDocumentToProjet = async (
  projectId: number,
  documentFile: File,
  textPayload: CreateDocumentTextPayload
): Promise<Document> => {
  try {
    console.log(
      `[API Projets] Tentative d'ajout de document au projet ${projectId}:`,
      textPayload
    );

    const formData = new FormData();
    formData.append("document", documentFile); // Le champ 'document' pour le fichier binaire

    // Ajouter les autres champs de texte au FormData
    Object.keys(textPayload).forEach((key) => {
      const value = textPayload[key as keyof CreateDocumentTextPayload];
      if (value !== undefined && value !== null) {
        formData.append(key, String(value)); // Convertir tout en string pour FormData
      }
    });

    // Envoyer la requête avec 'multipart/form-data'
    // Axios gère automatiquement le Content-Type pour FormData
    const response = await apiClient.post<ApiResponse<Document>>(
      `/technique/projets/${projectId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Vérifie si l'objet Document est sous la clé 'document', puis 'data', ou directement l'objet response.data
    if (response.data.document) {
      console.log(
        `[API Projets] Document ajouté avec succès au projet ${projectId} (via document):`,
        response.data.document
      );
      return response.data.document;
    } else if (response.data.data) {
      console.log(
        `[API Projets] Document ajouté avec succès au projet ${projectId} (via data):`,
        response.data.data
      );
      return response.data.data;
    } else if (response.data.documents) {
      // Vérification spécifique si l'objet Document est directement response.data
      console.log(
        `[API Projets] Document ajouté avec succès au projet ${projectId} (directement via response.data):`,
        response.data
      );
      return response.data as Document;
    }

    console.error(
      `[API Projets] L'API n'a pas retourné l'objet Document attendu après l'ajout au projet ${projectId}:`,
      response.data
    );
    throw new Error(
      `Échec de l'ajout du document au projet ${projectId}: Format de réponse API inattendu.`
    );
  } catch (error) {
    console.error(
      `[API Projets] Erreur lors de l'ajout du document au projet ${projectId}:`,
      error
    );
    throw error;
  }
};

/**
 * Supprime un document spécifique d'un projet.
 * @param projectId L'ID du projet parent.
 * @param documentId L'ID du document à supprimer.
 * @returns Promesse résolue une fois la suppression effectuée.
 */
export const deleteDocumentFromProjet = async (
  projectId: number,
  documentId: number
): Promise<void> => {
  try {
    console.log(
      `[API Projets] Tentative de suppression du document ${documentId} du projet ${projectId}...`
    );
    const response = await apiClient.delete<ApiResponse<Document>>(
      `/technique/projets/${projectId}/documents/${documentId}`
    );
    if (response.data.success) {
      console.log(
        `[API Projets] Document ${documentId} supprimé du projet ${projectId} avec succès. Message: ${response.data.message}`
      );
    } else {
      console.warn(
        `[API Projets] Suppression du document ${documentId} signalée comme non réussie:`,
        response.data.message
      );
    }
  } catch (error) {
    console.error(
      `[API Projets] Erreur lors de la suppression du document ${documentId} du projet ${projectId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupère les livrables avec leurs documents associés pour un projet donné.
 * @param projectId L'ID du projet.
 * @returns Promesse résolue avec l'objet ApiResponse contenant un tableau de Livrable (chacun avec ses documents).
 */
export const getLivrablesWithDocumentsByProjetId = async (
  projectId: number
): Promise<ApiResponse<Livrable[]>> => {
  try {
    console.log(
      `[API Projets] Tentative de récupération des livrables et de leurs documents pour le projet ${projectId}...`
    );
    // L'endpoint est /technique/projets/{id}/livrables-with-documents
    const response = await apiClient.get<ApiResponse<Livrable[]>>(
      `/technique/projets/${projectId}/livrables-with-documents`
    );

    let livrablesToReturn: Livrable[] = [];
    if (response.data.livrables && Array.isArray(response.data.livrables)) {
      livrablesToReturn = response.data.livrables;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      livrablesToReturn = response.data.data;
    } else if (Array.isArray(response.data)) {
      // Fallback if API returns direct array of livrables
      livrablesToReturn = response.data;
    }

    console.log(
      `[API Projets] Livrables avec documents pour le projet ${projectId} récupérés:`,
      livrablesToReturn
    );
    return {
      ...response.data, // Conserve les autres propriétés de la réponse (comme success, message, pagination)
      livrables: livrablesToReturn, // Assure que la clé 'livrables' est toujours un tableau
    };
  } catch (error) {
    console.error(
      `[API Projets] Erreur lors de la récupération des livrables et documents pour le projet ${projectId}:`,
      error
    );
    throw error;
  }
};
