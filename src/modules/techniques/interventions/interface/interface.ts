// src/api/intervention/interface.ts

// Toutes les interfaces nécessaires pour le module Intervention sont définies ici pour une ultra-indépendance.
export interface Nature {
    id_nature_document: number; // ID de la nature du document
    libelle: string; // Libellé de la nature du document (selon votre table)
  }


export interface InterventionDocument {
    id_documents: number;
    libelle_document: string;
    classification_document: string;
    lien_document: string; // Chemin ou URL du document
    etat_document?: string; // Optionnel
    date_document: string; // ISO date string
    id_intervention?: number | null; // Lien vers Intervention 
    id_nature_document: number; // Clé étrangère vers NatureDocument (maintenue car les documents ont une nature)
}
  
export interface Employe {
    id_employes: number; 
    nom_employes: string;
    prenom_employes: string;
    email_employes: string;
    // Removed other employe fields to keep it minimal for this module's direct needs.
}
  
export interface Partenaire {
    id_partenaire: number;
    nom_partenaire: string;
    
}
  
export interface Contrat {
    id_contrat: number;
    nom_contrat: string;
    duree_contrat: string;
}

// Interface de pagination, définie ici pour l'indépendance du module d'intervention
export interface Pagination {
    total: number; // Nombre total d'éléments
    page: number; // Page actuelle
    limit: number; // Nombre d'éléments par page
    totalPages: number; // Nombre total de pages
}
  
// --- Interfaces spécifiques à INTERVENTION ---
  
export interface Intervention {
    id_intervention: number;
    date_intervention: string; // Date de l'intervention (correspond à 'date_' en BDD)
    cause_defaillance: string;
    rapport_intervention: string;
    type_intervention: string; // Correspond à type_intervention_Installation_maintenance_préventive_et_curative_ en BDD
    type_defaillance: string;
    duree: string; // Durée de l'intervention
    lieu: string;
    statut_intervention: string; // Correspond à statut_à_faire_en_cours_en_attente_terminé_ en BDD
    recommandation: string; // Correspond à Recommandation_ en BDD
    probleme_signale: string;
    mode_intervention: string;
    detail_cause: string;
    type: string; // Ce champ 'type' est un doublon avec type_intervention dans la BDD, mais présent dans l'API
    id_partenaire: number; // Clé étrangère vers Partenaire
    id_contrat: number | null; // Clé étrangère vers Contrat, peut être null
    documents?: InterventionDocument[]; // Optionnel: documents directement associés à l'intervention
    employes?: Employe[]; // Optionnel: employés assignés à l'intervention
}
  
// Payload pour la création d'une intervention
export type CreateInterventionPayload = Omit<Intervention, 'id_intervention' | 'documents' | 'employes'>;
  
// Payload pour la mise à jour d'une intervention (tous les champs peuvent être optionnels pour un PATCH,
// mais pour un PUT, on enverrait l'objet complet sans id_intervention)
export type UpdateInterventionPayload = Partial<Omit<Intervention, 'id_intervention' | 'documents' | 'employes'>>;

// Payload pour l'ajout/création d'un document textuel spécifique aux interventions (métadonnées)
export interface CreateInterventionDocumentTextPayload {
  libelle_document: string;
  classification_document?: string; 
  date_document?: string; 
  id_nature_document: number; 
  etat_document?: string;
}

// --- Interface de réponse API générique pour le module Intervention ---
export interface ApiResponse<T> {
  natures: Nature[];
  success?: boolean; // Indique le succès de la requête
  message?: string; // Message de l'API (succès ou erreur)
  data?: T; // Champ générique pour les données principales (listes d'Interventions, Employes, etc.)
  intervention?: Intervention; // Champ spécifique pour les réponses d'une seule Intervention (GET by ID, POST, PUT)
  documents?: InterventionDocument[]; // Champs spécifiques pour les listes d'éléments associés (documents, employés)
  employes?: Employe[]; 
  pagination?: Pagination; // Informations de pagination pour les listes
}