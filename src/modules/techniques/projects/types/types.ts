// Interface pour les projets
export interface Famille {
  id_famille: number;
  libelle_famille: string;
}

export interface Employe {

  id_employes: number;
  nom_employes: string;
  prenom_employes: string;
  email_employes:string;
}

export interface Projet {
  id_projet: number;
  nom_projet: string;
  type_projet: string;
  devis_estimatif: number;
  date_debut: string | Date | null;
  date_fin: string | Date | null; 
  duree_prevu_projet: string;
  description_projet: string;
  etat: "planifié" | "en_cours" | "terminé" | "annulé";
  lieu: string;
  responsable: string;
  site: string;
  id_famille: number; 
  id_partenaire: number[];
}
export interface Partenaire {
  id_partenaire: number;
  nom_partenaire: string;
}

// Interface pour les tâches
export interface Tache {
  id_tache: number;
  nom_tache: string;
  desc_tache: string;
  statut: "à faire" | "en cours" | "en revue" | "terminé" | "bloqué";
  date_debut: string;
  date_fin: string;
  priorite: string;
  id_projet: number;
  // id_assigne_a a été retiré de cette interface car il est géré séparément par l'API
}

// Type pour les données envoyées lors de la création d'une tâche
export type CreateTachePayload = Omit<Tache, 'id_tache'>; // id_tache est le seul champ omis désormais

// Type pour les données envoyées lors de la mise à jour d'une tâche
export type UpdateTachePayload = Partial<Omit<Tache, 'id_tache'>>;
export interface TacheWithAssignedEmployes extends Tache {
  id_assigne_a: Employe[];
}

export interface ApiResponse<T> {
  success?: boolean; // Rendu optionnel pour s'adapter aux réponses API (ex: API qui renvoie directement un tableau)
  message?: string; // Message de succès (pour DELETE) ou d'erreur
  data?: T; // Rendu optionnel car les données peuvent être sous d'autres clés ou absentes
  livrable?: Livrable; // Utilisé pour les réponses de création/mise à jour d'un seul livrable
  document?: Document; // Utilisé pour la réponse de création d'un seul document
  documents?: Document[]; // Utilisé pour la liste de documents d'un livrable (GET /livrables/{id}/documents)
  livrables?: Livrable[]; // Utilisé pour la liste de livrables par projet (GET /livrables/projet/{projetId})
  pagination?: Pagination; // Optionnel, pour les réponses paginées
}
// Les types pour les payloads de création et de mise à jour restent valides,
// car ils étaient déjà basés sur Omit de id_tache et id_assigne_a.
// Cependant, si Tache n'a plus id_assigne_a, alors Omit<Tache, 'id_assigne_a'> devient redondant.
// Nous pouvons les simplifier.




// Interface pour les livrables
export interface Livrable {
  id_livrable: number; // ID du livrable (ex: Id_Livrable en SQL)
  libelle_livrable: string; // Libellé du livrable (confirmé par l'API)
  date: string; // Date du livrable (ex: Date_ en SQL)
  realisations: string; // Réalisations du livrable
  reserves: string; // Réserves du livrable
  approbation: "en attente" | "approuvé" | "rejeté" | "révisions requises" | string; // Statut d'approbation
  recommandation: string; // Recommandation (ex: _Recommandation en SQL)
  id_projet: number; // ID du projet parent (clé étrangère)
  // created_at et updated_at ont été retirés selon la demande de l'utilisateur
  documents: Document[]; // Liste des documents inclus directement dans les réponses de Livrable
}

export interface Nature {
  id_nature_document: number; // ID de la nature du document
  libelle: string; // Libellé de la nature du document (selon votre table)
}

export interface Document {
  id_documents: number; // ID du document (ex: Id_documents en SQL)
  libelle_document: string; // Libellé du document (ex: libele_document en SQL)
  classification_document?: string | null; // Classification du document
  date_document?: string | null; // Date du document
  lien_document: string; // Lien vers le document
  etat_document?: string | null; // État du document
  id_livrable?: number; // ID du livrable parent (clé étrangère)
  id_projet?: number; // ID du projet parent (clé étrangère)
  id_employes?: number; // ID de l'employé associé (clé étrangère, présent dans l'API)
  id_nature_document: number; // ID de la nature du document (clé étrangère)
  // created_at et updated_at ont été retirés selon la demande de l'utilisateur
}

export type CreateLivrablePayload = Omit<Livrable, 'id_livrable' | 'documents'>;

// Payload pour la mise à jour d'un Livrable (méthode PUT)
// Le backend s'attend à l'objet complet même si seule une partie est modifiée,
// mais le type est défini comme Partial pour la flexibilité côté frontend, comme pour les tâches.
export type UpdateLivrablePayload = Partial<Omit<Livrable, 'id_livrable' | 'documents'>>;

// Payload pour les champs texte lors de l'ajout d'un Document (via multipart/form-data)
// N'inclut pas le fichier binaire ('document'), ni les IDs générés/attribués par le backend.
export interface CreateDocumentTextPayload {
  libelle_document: string;
  classification_document?: string; // Optionnel
  date_document?: string; // Optionnel
  id_nature_document: number; // Requis
}


// --------------- Interfaces pour les Réponses API Génériques ---------------

// Pour les métadonnées de pagination, si l'API en renvoie
export interface Pagination {
  total: number; // Nombre total d'éléments
  page: number; // Page actuelle
  limit: number; // Nombre d'éléments par page
  totalPages: number; // Nombre total de pages
}

// Interface générique pour les réponses de l'API
// Elle est flexible car les clés de retour varient selon l'endpoint (ex: 'data', 'livrable', 'document', 'documents', 'livrables', 'message')
