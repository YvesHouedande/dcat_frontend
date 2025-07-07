import axios, { AxiosError } from "axios";

// Importation des interfaces depuis le fichier de types partagé
import {
  Document,
  Livrable,
  CreateLivrablePayload,
  UpdateLivrablePayload,
  CreateDocumentTextPayload,
  ApiResponse,
  Nature, // Import NatureDocument interface
} from "../../types/types";

// Configuration de l'API client (réutilisation de la configuration globale si possible)
const API_URL = import.meta.env.VITE_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json", // Par défaut pour la plupart des requêtes
  },
});

// Intercepteur de réponse pour la gestion centralisée des erreurs (comme dans taches.ts)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error(
        `Erreur API Livrables - Statut: ${error.response.status}`,
        `Données: ${JSON.stringify(error.response.data)}`,
        `URL: ${error.config?.url}`,
        `Méthode: ${error.config?.method}`
      );
    } else if (error.request) {
      console.error(
        `Erreur réseau Livrables - Pas de réponse du serveur pour: ${error.config?.url}`,
        `Méthode: ${error.config?.method}`,
        error.message
      );
    } else {
      console.error(
        `Erreur inattendue Livrables lors de la requête: ${error.message}`,
        error.config
      );
    }
    return Promise.reject(error);
  }
);

// Fonctions d'appel API pour les Livrables

/**
 * Récupère la liste de tous les livrables avec informations de pagination.
 * @param page Numéro de page (défaut: 1)
 * @param limit Nombre d'éléments par page (défaut: 10)
 * @returns Promesse résolue avec l'objet ApiResponse contenant un tableau de Livrable et la pagination.
 */
export const getAllLivrables = async (): Promise<Livrable[]> => {
  try {
    const response = await axios.get(`${API_URL}/technique/livrables`);

    // Vérifier si la réponse est une structure ApiResponse
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      // Si c'est une ApiResponse, retourner response.data.data
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      // Si c'est directement un tableau, le retourner
      return response.data;
    } else {
      // Structure inattendue
      console.warn(
        "[API Livrables] Structure de réponse inattendue pour getAllLivrables:",
        response.data
      );
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des livrables:", error);
    throw error;
  }
};

/**
 * Crée un nouveau livrable.
 * @param livrableData Les données du livrable à créer.
 * @returns Promesse résolue avec l'objet Livrable créé.
 */
export const createLivrable = async (
  livrableData: CreateLivrablePayload
): Promise<Livrable> => {
  try {
    console.log(
      "[API Livrables] Tentative de création d'un livrable:",
      livrableData
    );
    const response = await apiClient.post<ApiResponse<Livrable>>(
      `/technique/livrables`,
      livrableData
    );

    console.log(
      "[API Livrables] DIAGNOSTIC: Réponse HTTP complète après création:",
      response
    );
    console.log(
      "[API Livrables] DIAGNOSTIC: Contenu de response.data après création:",
      response.data
    );
    console.log(
      "[API Livrables] DIAGNOSTIC: Valeur de response.data.livrable:",
      response.data.livrable
    );

    // Vérifie d'abord si l'objet Livrable est sous la clé 'livrable', puis 'data', puis directement l'objet response.data
    if (response.data.livrable) {
      console.log(
        "[API Livrables] Livrable créé avec succès (via livrable):",
        response.data.livrable
      );
      return response.data.livrable;
    } else if (response.data.data) {
      // Si la réponse est un ApiResponse et que les données sont sous 'data'
      console.log(
        "[API Livrables] Livrable créé avec succès (via data):",
        response.data.data
      );
      return response.data.data;
    }
    console.error(
      "[API Livrables] L'API n'a pas retourné l'objet Livrable attendu après la création:",
      response.data
    );
    throw new Error(
      "Échec de la création du livrable : Format de réponse API inattendu."
    );
  } catch (error) {
    console.error(
      "[API Livrables] Erreur lors de la création du livrable:",
      error
    );
    throw error;
  }
};

/**
 * Récupère un livrable par son ID.
 * @param id L'ID du livrable.
 * @returns Promesse résolue avec l'objet Livrable ou undefined si non trouvé.
 */
export const getLivrableById = async (
  id: number
): Promise<Livrable | undefined> => {
  try {
    console.log(
      `[API Livrables] Tentative de récupération du livrable ${id}...`
    );
    const response = await apiClient.get<ApiResponse<Livrable>>(
      `/technique/livrables/${id}`
    );
    if (response.data.livrable) {
      console.log(
        `[API Livrables] Livrable ${id} récupéré:`,
        response.data.livrable
      );
      return response.data.livrable;
    } else if (response.data.data) {
      console.log(
        `[API Livrables] Livrable ${id} récupéré (via data):`,
        response.data.data
      );
      return response.data.data;
    }
    console.warn(
      `[API Livrables] Structure de réponse inattendue pour getLivrableById ${id}:`,
      response.data
    );
    return undefined;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn(`[API Livrables] Livrable ${id} introuvable (404).`);
      return undefined;
    }
    console.error(
      `[API Livrables] Erreur lors de la récupération du livrable ${id}:`,
      error
    );
    throw error;
  }
};

/**
 * Met à jour un livrable existant.
 * @param id L'ID du livrable à mettre à jour.
 * @param livrableData Les données complètes du livrable mises à jour.
 * @returns Promesse résolue avec l'objet Livrable mis à jour.
 */
export const updateLivrable = async (
  id: number,
  livrableData: UpdateLivrablePayload
): Promise<Livrable> => {
  try {
    console.log(
      `[API Livrables] Tentative de mise à jour du livrable ${id}:`,
      livrableData
    );
    const response = await apiClient.put<ApiResponse<Livrable>>(
      `/technique/livrables/${id}`,
      livrableData
    );
    if (response.data.livrable) {
      console.log(
        `[API Livrables] Livrable ${id} mis à jour avec succès:`,
        response.data.livrable
      );
      return response.data.livrable;
    } else if (response.data.data) {
      console.log(
        `[API Livrables] Livrable ${id} mis à jour avec succès (via data):`,
        response.data.data
      );
      return response.data.data;
    }
    console.error(
      `[API Livrables] L'API n'a pas retourné l'objet Livrable attendu après la mise à jour ${id}:`,
      response.data
    );
    throw new Error(
      `Échec de la mise à jour du livrable ${id}: Format de réponse API inattendu.`
    );
  } catch (error) {
    console.error(
      `[API Livrables] Erreur lors de la mise à jour du livrable ${id}:`,
      error
    );
    throw error;
  }
};

/**
 * Supprime un livrable.
 * @param id L'ID du livrable à supprimer.
 * @returns Promesse résolue une fois la suppression effectuée.
 */
export const deleteLivrable = async (id: number): Promise<void> => {
  try {
    console.log(
      `[API Livrables] Tentative de suppression du livrable ${id}...`
    );

    // 1. Récupérer les documents associés au livrable
    const documentsResponse = await getDocumentsByLivrableId(id);
    let associatedDocuments: Document[] = [];

    if (
      documentsResponse.documents &&
      Array.isArray(documentsResponse.documents)
    ) {
      associatedDocuments = documentsResponse.documents;
    } else if (
      documentsResponse.data &&
      Array.isArray(documentsResponse.data)
    ) {
      associatedDocuments = documentsResponse.data;
    }

    if (associatedDocuments.length > 0) {
      console.log(
        `[API Livrables] Livrable ${id} a ${associatedDocuments.length} document(s) associé(s). Tentative de suppression des documents...`
      );
      // 2. Supprimer/dissocier chaque document associé
      for (const doc of associatedDocuments) {
        try {
          await deleteDocumentFromLivrable(id, doc.id_documents); // Appelle la fonction pour supprimer le document
          console.log(
            `[API Livrables] Document ${doc.id_documents} supprimé du livrable ${id}.`
          );
        } catch (docDeleteError) {
          console.error(
            `[API Livrables] Erreur lors de la suppression du document ${doc.id_documents} du livrable ${id}:`,
            docDeleteError
          );
          // Si la suppression d'un document échoue, nous pouvons choisir de continuer ou de rejeter l'opération principale
          // Pour l'instant, nous loguons l'erreur mais continuons. Si la suppression de document est critique,
          // il faudrait rejeter ici.
          throw new Error(
            `Échec de la suppression du document ${doc.id_documents} pour le livrable ${id}.`
          );
        }
      }
      console.log(
        `[API Livrables] Tous les documents associés au livrable ${id} ont été traités.`
      );
    } else {
      console.log(`[API Livrables] Livrable ${id} n'a aucun document associé.`);
    }

    // 3. Procéder à la suppression du livrable lui-même
    const response = await apiClient.delete<ApiResponse<Livrable>>(
      `/technique/livrables/${id}`
    );
    if (response.data.success) {
      console.log(
        `[API Livrables] Livrable ${id} supprimé avec succès. Message: ${response.data.message}`
      );
    } else {
      // La suppression peut être considérée comme réussie même si success est false, si l'API le dit explicitement via message
      console.warn(
        `[API Livrables] Suppression du livrable ${id} signalée comme non réussie:`,
        response.data.message
      );
      // Si l'API retourne un message d'échec sans success:false, ou success:true avec un message
      // On pourrait choisir de rejeter si !response.data.success et !response.data.message
      if (response.data.message) {
        console.warn(
          `[API Livrables] Message de l'API suite à la suppression: ${response.data.message}`
        );
      } else {
        throw new Error(
          `La suppression du livrable ${id} n'a pas réussi et aucun message d'erreur n'a été fourni.`
        );
      }
    }
  } catch (error) {
    console.error(
      `[API Livrables] Erreur lors de la suppression du livrable ${id}:`,
      error
    );
    throw error;
  }
};

// Fonctions d'appel API pour les Documents liés aux Livrables

/**
 * Ajoute un document à un livrable spécifique.
 * @param livrableId L'ID du livrable parent.
 * @param documentFile Le fichier du document (File object).
 * @param textPayload Les métadonnées du document.
 * @returns Promesse résolue avec l'objet Document créé.
 */
export const addDocumentToLivrable = async (
  livrableId: number,
  documentFile: File,
  textPayload: CreateDocumentTextPayload
): Promise<Document> => {
  try {
    console.log(
      `[API Livrables] Tentative d'ajout de document au livrable ${livrableId}:`,
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
      `/technique/livrables/${livrableId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Vérifie d'abord si l'objet Document est sous la clé 'document', puis 'data', puis directement l'objet response.data
    if (response.data.document) {
      console.log(
        `[API Livrables] Document ajouté avec succès au livrable ${livrableId} (via document):`,
        response.data.document
      );
      return response.data.document;
    } else if (response.data.data) {
      console.log(
        `[API Livrables] Document ajouté avec succès au livrable ${livrableId} (via data):`,
        response.data.data
      );
      return response.data.data;
    }

    console.error(
      `[API Livrables] L'API n'a pas retourné l'objet Document attendu après l'ajout au livrable ${livrableId}:`,
      response.data
    );
    throw new Error(
      `Échec de l'ajout du document au livrable ${livrableId}: Format de réponse API inattendu.`
    );
  } catch (error) {
    console.error(
      `[API Livrables] Erreur lors de l'ajout du document au livrable ${livrableId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupère tous les documents associés à un livrable avec informations de pagination.
 * @param livrableId L'ID du livrable.
 * @returns Promesse résolue avec l'objet ApiResponse contenant un tableau de Document et la pagination.
 */
export const getDocumentsByLivrableId = async (
  livrableId: number
): Promise<ApiResponse<Document[]>> => {
  try {
    console.log(
      `[API Livrables] Tentative de récupération des documents pour le livrable ${livrableId}...`
    );
    const response = await apiClient.get<ApiResponse<Document[]>>(
      `/technique/livrables/${livrableId}/documents`
    );
    // Logs la pagination si elle existe pour s'assurer que sa valeur est "lue"
    if (response.data.pagination) {
      console.log(
        `[API Livrables] Pagination pour les documents du livrable ${livrableId}:`,
        response.data.pagination
      );
    }
    // Retourne l'objet de réponse complet pour que le composant appelant puisse accéder à la pagination et aux données.
    console.log(
      `[API Livrables] Réponse complète des documents pour le livrable ${livrableId}:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `[API Livrables] Erreur lors de la récupération des documents pour le livrable ${livrableId}:`,
      error
    );
    throw error;
  }
};

/**
 * Supprime un document spécifique d'un livrable.
 * @param livrableId L'ID du livrable parent.
 * @param documentId L'ID du document à supprimer.
 * @returns Promesse résolue une fois la suppression effectuée.
 */
export const deleteDocumentFromLivrable = async (
  livrableId: number,
  documentId: number
): Promise<void> => {
  try {
    console.log(
      `[API Livrables] Tentative de suppression du document ${documentId} du livrable ${livrableId}...`
    );
    const response = await apiClient.delete<ApiResponse<Document>>(
      `/technique/livrables/${livrableId}/documents/${documentId}`
    );
    if (response.data.success) {
      console.log(
        `[API Livrables] Document ${documentId} supprimé du livrable ${livrableId} avec succès. Message: ${response.data.message}`
      );
    } else {
      console.warn(
        `[API Livrables] Suppression du document ${documentId} signalée comme non réussie:`,
        response.data.message
      );
    }
  } catch (error) {
    console.error(
      `[API Livrables] Erreur lors de la suppression du document ${documentId} du livrable ${livrableId}:`,
      error
    );
    throw error;
  }
};

// Fonctions d'appel API pour les Livrables par Projet

/**
 * Récupère les livrables associés à un projet spécifique avec informations de pagination.
 * @param projetId L'ID du projet.
 * @returns Promesse résolue avec l'objet ApiResponse contenant un tableau de Livrable et la pagination.
 */
export const getLivrablesByProjetId = async (
  projetId: number
): Promise<ApiResponse<Livrable[]>> => {
  try {
    console.log(
      `[API Livrables] Tentative de récupération des livrables pour le projet ${projetId}...`
    );
    const response = await apiClient.get<ApiResponse<Livrable[]>>(
      `/technique/livrables/projet/${projetId}`
    );
    // Logs la pagination si elle existe pour s'assurer que sa valeur est "lue"
    if (response.data.pagination) {
      console.log(
        `[API Livrables] Pagination pour les livrables du projet ${projetId}:`,
        response.data.pagination
      );
    }
    // Retourne l'objet de réponse complet pour que le composant appelant puisse accéder à la pagination et aux données.
    console.log(
      `[API Livrables] Réponse complète des livrables pour le projet ${projetId}:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `[API Livrables] Erreur lors de la récupération des livrables pour le projet ${projetId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupère toutes les natures de documents.
 * @returns Promesse résolue avec l'objet ApiResponse contenant un tableau de NatureDocument.
 */
export const getAllNatureDocuments = async (): Promise<
  ApiResponse<Nature[]>
> => {
  try {
    console.log(
      "[API Livrables] Tentative de récupération de toutes les natures de documents..."
    );
    const response = await apiClient.get<ApiResponse<Nature[]>>(
      `/administration/natures`
    ); // Assumons cet endpoint
    console.log(
      "[API Livrables] Réponse complète des natures de documents:",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      "[API Livrables] Erreur lors de la récupération des natures de documents:",
      error
    );
    throw error;
  }
};
