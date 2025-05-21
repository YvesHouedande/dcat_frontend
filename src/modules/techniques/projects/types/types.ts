// Interface pour les projets
export interface Projet {
  id_projet: number;
  nom_projet: string;
  type_projet: string;
  devis_estimatif: number;
  date_debut: string;
  date_fin: string;
  duree_prevu_projet: string;
  description_projet: string;
  etat: "planifié" | "en cours" | "terminé" | "annulé";
  lieu: string;
  id_employe: number;
  site: string;
  id_famille: number;
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
}

// Interface pour les livrables
export interface Livrable {
  id_livrable: number;
  libelle_livrable: string;
  date: string;
  realisations: string;
  reserves: string;
  approbation: "en attente" | "approuvé" | "rejeté" | "révisions requises";
  recommandation: string;
  id_projet: number;
  documents: Document[];
}