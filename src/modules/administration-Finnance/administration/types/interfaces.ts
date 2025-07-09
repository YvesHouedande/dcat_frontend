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
  duree_Contrat: string;
  date_debut: string;
  date_fin: string;
  Reference?: string;
  type_de_contrat: string;
  status: string;
  id_partenaire?: number;
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