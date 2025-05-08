// src/techniques/projects/types.ts

import { EmployeProfile } from "@/modules/administration-Finnance/administration/pages/employers/employe";
import { PartenaireProfile } from "@/modules/administration-Finnance/administration/pages/partenaires/partenaire";
import { ReactNode } from "react";
export type Project = {
  id_projet: string;
  nom_projet: string;
  type_projet: string;
  devis_estimatif: string;
  date_debut: string;
  date_fin: string;
  duree_prevu_projet: string 
  description_projet: string 
  etat: 'planifié' | 'en cours' | 'terminé' | 'annulé';
  lieu: string;
  profiles: EmployeProfile[];
  // id_profile: number[];
  responsable:string;
  site: string;
  id_famille: string;
  // famille: string;
  partenaires: PartenaireProfile[];
  // id_partenaire:number[]; ou id_produit
};

export type ProjectStats = {
  total: number;
  byStatus: Record<string, number>;
  byFamily: Record<string, number>;
  onTime: number;
  delayed: number;
};

//Gestions des tâches
export type Task = {
  id_tache: string;
  nom_tache: string;
  desc_tache: string;
  statut: TaskStatus;
  date_debut: string;
  date_fin: string;
  priorite: TaskPriority;
  id_projet: string;
  assigne_a?: string;
  date_creation?: string;
  derniere_modification?: string;
};

export type TaskStatus = 'à faire' | 'en cours' | 'en revue' | 'terminé' | 'bloqué';
export type TaskPriority = 'faible' | 'moyenne' | 'haute' | 'critique';

export type TaskStats = {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  completed: number;
  overdue: number;
  upcomingDeadlines: Task[];
};

//Gestions des livrables
export type Livrable = {
  Id_Livrable: number;
  Date_: string;
  Réalisations: string;
  Réserves: string;
  Approbation: LivrableStatus;
  _Recommandation: string;
  id_projet: string;
  titre?: string;
  version?: string;
  createur?: string;
  date_creation?: string;
};

export type LivrableStats = {
  total: number;
  byStatus: Record<LivrableStatus, number>;
  byProject: Record<string, number>;
  lastUpdated: Livrable[];
};

export type LivrableStatus = 'en attente' | 'approuvé' | 'rejeté' | 'révisions requises';

//Gestions des documents
export interface Document {
  description: string;
  version: string;
  libele_document: ReactNode;
  Id_documents?: number; // Optionnel si c'est généré côté serveur
  nom_document: string;
  lien_document: string;
  description_document: string;
  classification_document: string;
  etat_document: string;
  date_creation: string;
  date_modification?: string; // Optionnel
  id_projet?: string; // Optionnel
  createur?: string; // Optionnel
  chemin_fichier?: string; // Optionnel
  taille_fichier?: string; // Optionnel
  
}

export type DocumentStats = {
  total: number;
  byStatus: Record<DocumentStatus, number>;
  byType: Record<DocumentType, number>;
  byProject: Record<string, number>;
  recentDocuments: Document[];
};
export type DocumentStatus = 'brouillon' | 'validé' | 'archivé' | 'obsolète';
export type DocumentType = 'contrat' | 'facture' | 'rapport' | 'plan' | 'autre';


