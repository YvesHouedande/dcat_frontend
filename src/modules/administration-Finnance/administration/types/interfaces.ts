export interface Employe {// Table employes - version harmonisée avec le SQL
  id_employes: number;
  nom_employes: string;
  prenom_employes: string;
  email_employes?: string;
  contact_employes?: string;
  adresse_employes?: string;
  status_employes: string;
  date_embauche_employes?: string;
  date_de_naissance?: string;
  contrat: string;
  id_fonction: number; // Clé étrangère vers la table fonction
}

export interface Fonction {// Table Fonction
  id_fonction: number;  
  nom_fonction: string;
}

export interface Interlocuteur {
  id_interlocuteur: number;
  nom_interlocuteur: string;
  prenom_interlocuteur: string;
  fonction_interlocuteur: string;
  contact_interlocuteur: string;
  email_interlocuteur: string;
  id_partenaire: number;
}

export interface Partenaires {
  id_partenaire: number;
  nom_partenaire: string;
  telephone_partenaire: string;
  email_partenaire: string;
  specialite: string;
  localisation: string;
  type_partenaire: string;
  statut: string;
  id_entite: number; // Clé étrangère vers la table Entite
  interlocuteurs?: Interlocuteur[]; // Ajout de la propriété interlocuteurs
}

export interface DemandeDocument {
  id_documents: number;
  libelle_document: string;
  classification_document: string;
  lien_document: string; // Chemin ou URL du document
  etat_document?: string; // Optionnel
  date_document: string; // ISO date string
  id_nature_document: number; // Clé étrangère vers NatureDocument (maintenue car les documents ont une nature)
}

export interface Entite {// Table Entité
  id_entite: number;              // Renommé de Id_Entité pour cohérence
  denomination: string;
}

export interface NatureDocument {//Table nature_document  
  id_nature_document: number;
  libelle: string; // Utilisé pour compatibilité avec l'API et le frontend
}

//les demandes 
export interface Demande {
  id_demandes: number;
  type_demande: string;
  status: string;
  motif: string;
  duree: string | null;
  id_employes: number;
  documents: DemandeDocument[];
  date_absence: string | null;
  date_retour: string | null;
  heure_debut: string | null;
  heure_fin: string | null;
  commentaire_approbation?: string; // Commentaire lors de l'approbation
  motif_refus?: string; // Motif lors du refus
  // Champs de métadonnées optionnels
  created_at?: string;
  updated_at?: string;
}

//les contrats
export interface Contrat {
  id_contrat: number; // Changed to number
  nom_contrat: string;
  type_de_contrat: string;
  date_debut: string;
  date_fin: string;
  reference: string; // Harmonisé avec l'API (minuscule)
  statut: string; // Harmonisé avec l'API
  id_partenaire?: number;
  duree_contrat: string; // Ajout de la durée du contrat
  documents?: ContratDocument | ContratDocument[]; // Documents associés au contrat (peut être un objet unique ou un tableau)
}

export interface EmployeDocument {
  id_documents: number;
  libelle_document: string;
  classification_document: string;
  lien_document: string; // Chemin ou URL du document
  etat_document?: string; // Optionnel
  date_document: string; // ISO date string
  id_nature_document: number;
  id_contrat?:number;
}

// Interface pour les documents de contrat
export interface ContratDocument {
  id_documents: number;
  libelle_document: string;
  classification_document: string;
  date_document: string; // ISO date string
  lien_document: string; // Chemin ou URL du document
  etat_document?: string; // Optionnel
  id_nature_document: number;
  id_contrat: number;
}

// Types pour la gestion des erreurs
export interface ApiError {
  message: string;
  status?: number;
  response?: {
    status: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
}

export interface MutationError {
  message: string;
  status?: number;
  response?: {
    status: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ContratResponse extends Contrat {
  id_contrat: number;
}

// Types pour les mutations
export interface CreateContratData extends Omit<Contrat, 'id_contrat' | 'duree_contrat'> {
  duree_contrat?: string;
}

export interface UpdateContratData extends Partial<Omit<Contrat, 'id_contrat'>> {
  duree_contrat?: string;
}

export interface CreateDocumentData extends Omit<ContratDocument, 'id_documents' | 'id_contrat'> {
  file: File;
}