// Types utilitaires pour la sécurité des types dans le module interventions

/**
 * Type pour les objets avec un ID d'intervention
 */
export type ApiResponseWithId = { id_intervention: number };

/**
 * Type pour les objets récursifs (utilisé pour la recherche d'ID)
 */
export type RecursiveObject = Record<string, unknown>;

/**
 * Type pour les réponses API génériques
 */
export type ApiResponseGeneric<T> = {
  data?: T;
  success?: boolean;
  message?: string;
  [key: string]: unknown;
};

/**
 * Type guard pour vérifier si un objet a un ID d'intervention
 */
export const hasInterventionId = (obj: unknown): obj is ApiResponseWithId => {
  return obj !== null && 
         typeof obj === 'object' && 
         'id_intervention' in obj && 
         typeof (obj as ApiResponseWithId).id_intervention === 'number';
};

/**
 * Type guard pour vérifier si un objet est un objet récursif
 */
export const isRecursiveObject = (obj: unknown): obj is RecursiveObject => {
  return obj !== null && typeof obj === 'object';
};

/**
 * Fonction utilitaire pour rechercher récursivement un ID d'intervention
 */
export const findInterventionIdRecursively = (obj: RecursiveObject): number | null => {
  if (!isRecursiveObject(obj)) return null;
  
  // Vérifier si cet objet a un id_intervention
  if (hasInterventionId(obj)) {
    return obj.id_intervention;
  }
  
  // Chercher dans toutes les propriétés
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (isRecursiveObject(value)) {
        const result = findInterventionIdRecursively(value);
        if (result !== null) return result;
      }
    }
  }
  
  return null;
}; 