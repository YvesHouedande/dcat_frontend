
import { Livrable, Project, Task } from "../types/types";

// Constantes pour générer des dates proches
const TODAY = new Date();
const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_MONTH = 30 * ONE_DAY;

// Fonction utilitaire pour formater les dates en format 'YYYY-MM-DD'
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Fonction pour générer une date aléatoire dans une plage
const randomDate = (start: Date, end: Date): string => {
  return formatDate(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())));
};

// Données simulées pour les projets
export const mockProjects: Project[] = [
  {
    id_projet: 'PRJ-001',
    nom_projet: 'Refonte du système informatique',
    type_projet: 'Informatique',
    devis_estimatif: '150000',
    date_debut: randomDate(new Date(TODAY.getTime() - 2 * ONE_MONTH), new Date(TODAY.getTime() - ONE_MONTH)),
    date_fin: randomDate(new Date(TODAY.getTime() + 3 * ONE_MONTH), new Date(TODAY.getTime() + 4 * ONE_MONTH)),
    duree_prevu_projet: '6 mois',
    description_projet: 'Modernisation complète de l\'infrastructure IT avec migration vers le cloud',
    etat: 'en cours',
    lieu: 'Siège social - Paris',
    profiles:[], 
    site: 'Paris',
    id_famille: 'FAM-IT-001',
    partenaires: [],
    responsable: 'Nicolas Laurent'
  },

  {
    id_projet: 'PRJ-002',
    nom_projet: 'Certification ISO 9001',
    type_projet: 'Qualité',
    devis_estimatif: '75000',
    date_debut: formatDate(new Date(TODAY.getTime() - ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + 5 * ONE_MONTH)),
    duree_prevu_projet: '6 mois',
    description_projet: 'Obtention de la certification ISO 9001 pour les processus qualité',
    etat: 'en cours',
    lieu: 'Multiple sites',
    profiles:[], 
    site: 'Lyon',
    id_famille: 'FAM-QA-001',
    partenaires: [],
    responsable: 'Nicolas Laurent'
  },
  {
    id_projet: 'PRJ-003',
    nom_projet: 'Lancement produit Alpha',
    type_projet: 'Marketing',
    devis_estimatif: '200000',
    date_debut: formatDate(new Date(TODAY.getTime() - 3 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + ONE_MONTH)),
    duree_prevu_projet: '4 mois',
    description_projet: 'Lancement de la nouvelle gamme de produits sur le marché international',
    etat: 'en cours',
    lieu: 'International',
    profiles:[],
    site: 'Paris',
    id_famille: 'FAM-MKT-001',
    partenaires: [],
    responsable: 'Nicolas Laurent'
  },
  {
    id_projet: 'PRJ-004',
    nom_projet: 'Optimisation chaîne logistique',
    type_projet: 'Logistique',
    devis_estimatif: '120000',
    date_debut: formatDate(new Date(TODAY.getTime() - 5 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - ONE_WEEK)),
    duree_prevu_projet: '4 mois',
    description_projet: 'Refonte complète de la chaîne d\'approvisionnement et optimisation des stocks',
    etat: 'terminé',
    lieu: 'Entrepôt central - Marseille',
    profiles:[], 
    site: 'Marseille',
    id_famille: 'FAM-LOG-001',
    partenaires: [],
    responsable: 'Nicolas Laurent'
  },
  {
    id_projet: 'PRJ-005',
    nom_projet: 'Expansion marché allemand',
    type_projet: 'Business',
    devis_estimatif: '350000',
    date_debut: formatDate(new Date(TODAY.getTime() + ONE_WEEK)),
    date_fin: formatDate(new Date(TODAY.getTime() + 8 * ONE_MONTH)),
    duree_prevu_projet: '8 mois',
    description_projet: 'Ouverture de bureaux à Berlin et Munich pour développer le marché allemand',
    etat: 'planifié',
    lieu: 'Allemagne',
    profiles:[],
    site: 'Berlin',
    id_famille: 'FAM-BUS-001',
    partenaires: [],
    responsable: 'Nicolas Laurent'
  },
  {
    id_projet: 'PRJ-006',
    nom_projet: 'Application mobile clients',
    type_projet: 'Informatique',
    devis_estimatif: '80000',
    date_debut: formatDate(new Date(TODAY.getTime() - 4 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + 2 * ONE_MONTH)),
    duree_prevu_projet: '6 mois',
    description_projet: 'Développement d\'une application mobile pour les clients existants',
    etat: 'en cours',
    lieu: 'Paris',
    profiles:[],
    site: 'Paris',
    id_famille: 'FAM-IT-001',
    partenaires: [],
    responsable: 'Nicolas Laurent'
  },
  {
    id_projet: 'PRJ-007',
    nom_projet: 'Formation continue employés',
    type_projet: 'RH',
    devis_estimatif: '50000',
    date_debut: formatDate(new Date(TODAY.getTime() - ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + 11 * ONE_MONTH)),
    duree_prevu_projet: '12 mois',
    description_projet: 'Programme de formation continue pour tous les employés',
    etat: 'en cours',
    lieu: 'Tous les sites',
    profiles:[], 
    site: 'Paris',
    id_famille: 'FAM-HR-001',
    partenaires: [],
    responsable: 'Nicolas Laurent'
  },
  {
    id_projet: 'PRJ-008',
    nom_projet: 'Réduction empreinte carbone',
    type_projet: 'Environnement',
    devis_estimatif: '90000',
    date_debut: formatDate(new Date(TODAY.getTime() - 6 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - ONE_MONTH)),
    duree_prevu_projet: '5 mois',
    description_projet: 'Initiative de développement durable pour réduire l\'empreinte carbone',
    etat: 'terminé',
    lieu: 'Tous les sites',
    profiles:[],
    site: 'Lyon',
    id_famille: 'FAM-ENV-001',
    partenaires: [],
    responsable: 'Nicolas Laurent'
  },
  {
    id_projet: 'PRJ-009',
    nom_projet: 'Mise en conformité RGPD',
    type_projet: 'Juridique',
    devis_estimatif: '65000',
    date_debut: formatDate(new Date(TODAY.getTime() - 3 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + 2 * ONE_MONTH)),
    duree_prevu_projet: '5 mois',
    description_projet: 'Évaluation et mise en conformité des processus avec la réglementation RGPD',
    etat: 'en cours',
    lieu: 'Siège social - Paris',
    profiles:[],
    site: 'Paris',
    id_famille: 'FAM-JUR-001',
    partenaires: [],
    responsable: 'Nicolas Laurent'
  },
  {
    id_projet: 'PRJ-010',
    nom_projet: 'Refonte site web corporate',
    type_projet: 'Marketing',
    devis_estimatif: '45000',
    date_debut: formatDate(new Date(TODAY.getTime() - 2 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + ONE_MONTH)),
    duree_prevu_projet: '3 mois',
    description_projet: 'Modernisation du site web corporate avec une approche mobile-first',
    etat: 'en cours',
    lieu: 'Paris',
    profiles:[],
    site: 'Paris',
    id_famille: 'FAM-MKT-001',
    partenaires: [],
    responsable: 'Nicolas Laurent'
  },
  {
    id_projet: 'PRJ-011',
    nom_projet: 'Migration ERP',
    type_projet: 'Informatique',
    devis_estimatif: '300000',
    date_debut: formatDate(new Date(TODAY.getTime() - 9 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - 2 * ONE_MONTH)),
    duree_prevu_projet: '7 mois',
    description_projet: 'Migration vers un nouveau système ERP intégré pour toute l\'entreprise',
    etat: 'terminé',
    lieu: 'Tous les sites',
    profiles:[], 
    site: 'Lyon',
    id_famille: 'FAM-IT-001',
    partenaires: [],
    responsable: 'Nicolas Laurent'
  },
  {
    id_projet: 'PRJ-012',
    nom_projet: 'Optimisation processus achats',
    type_projet: 'Finance',
    devis_estimatif: '70000',
    date_debut: formatDate(new Date(TODAY.getTime() + 2 * ONE_WEEK)),
    date_fin: formatDate(new Date(TODAY.getTime() + 5 * ONE_MONTH)),
    duree_prevu_projet: '5 mois',
    description_projet: 'Révision des processus d\'achats pour optimiser les coûts',
    etat: 'planifié',
    lieu: 'Siège social - Paris',
    profiles:[], 
    site: 'Paris',
    id_famille: 'FAM-FIN-001',
    partenaires: [],
    responsable: 'Nicolas Laurent'
  }
];

// Données simulées pour les tâches
export const mockTasks: Task[] = [
  // Tâches pour PRJ-001
  {
    id_tache: 'TSK-001',
    nom_tache: 'Audit des systèmes actuels',
    desc_tache: 'Évaluation complète de l\'infrastructure informatique existante',
    statut: 'terminé',
    date_debut: formatDate(new Date(TODAY.getTime() - 2 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - 1.5 * ONE_MONTH)),
    priorite: 'haute',
    id_projet: 'PRJ-001',
    assigne_a: 'Nicolas Laurent',
    date_creation: formatDate(new Date(TODAY.getTime() - 2.5 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 1.5 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-002',
    nom_tache: 'Sélection des fournisseurs cloud',
    desc_tache: 'Évaluation et sélection des fournisseurs de services cloud',
    statut: 'terminé',
    date_debut: formatDate(new Date(TODAY.getTime() - 1.5 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - 0.5 * ONE_MONTH)),
    priorite: 'haute',
    id_projet: 'PRJ-001',
    assigne_a: 'Sophie Dupont',
    date_creation: formatDate(new Date(TODAY.getTime() - 2 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 0.5 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-003',
    nom_tache: 'Migration des données',
    desc_tache: 'Migration des données vers la nouvelle infrastructure',
    statut: 'en cours',
    date_debut: formatDate(new Date(TODAY.getTime() - 0.5 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + ONE_MONTH)),
    priorite: 'critique',
    id_projet: 'PRJ-001',
    assigne_a: 'Paul Morin',
    date_creation: formatDate(new Date(TODAY.getTime() - ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 0.25 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-004',
    nom_tache: 'Formation des utilisateurs',
    desc_tache: 'Sessions de formation pour tous les employés',
    statut: 'à faire',
    date_debut: formatDate(new Date(TODAY.getTime() + ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + 2 * ONE_MONTH)),
    priorite: 'moyenne',
    id_projet: 'PRJ-001',
    assigne_a: 'Claire Dubois',
    date_creation: formatDate(new Date(TODAY.getTime() - ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - ONE_MONTH))
  },
  
  // Tâches pour PRJ-002
  {
    id_tache: 'TSK-005',
    nom_tache: 'Audit initial ISO',
    desc_tache: 'Évaluation des écarts par rapport à la norme ISO 9001',
    statut: 'terminé',
    date_debut: formatDate(new Date(TODAY.getTime() - ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - 0.75 * ONE_MONTH)),
    priorite: 'haute',
    id_projet: 'PRJ-002',
    assigne_a: 'Jean Martin',
    date_creation: formatDate(new Date(TODAY.getTime() - 1.5 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 0.75 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-006',
    nom_tache: 'Mise à jour des procédures',
    desc_tache: 'Révision et mise à jour de toutes les procédures qualité',
    statut: 'en cours',
    date_debut: formatDate(new Date(TODAY.getTime() - 0.5 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + 0.5 * ONE_MONTH)),
    priorite: 'moyenne',
    id_projet: 'PRJ-002',
    assigne_a: 'Lucie Petit',
    date_creation: formatDate(new Date(TODAY.getTime() - ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 0.25 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-007',
    nom_tache: 'Documentation système qualité',
    desc_tache: 'Rédaction de la documentation complète du système de gestion qualité',
    statut: 'à faire',
    date_debut: formatDate(new Date(TODAY.getTime() + 0.5 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + 1.5 * ONE_MONTH)),
    priorite: 'haute',
    id_projet: 'PRJ-002',
    assigne_a: 'Laure Simone',
    date_creation: formatDate(new Date(TODAY.getTime() - 0.75 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 0.75 * ONE_MONTH))
  },
  
  // Tâches pour PRJ-003
  {
    id_tache: 'TSK-008',
    nom_tache: 'Étude de marché',
    desc_tache: 'Analyse complète du marché cible pour le produit Alpha',
    statut: 'terminé',
    date_debut: formatDate(new Date(TODAY.getTime() - 3 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - 2 * ONE_MONTH)),
    priorite: 'haute',
    id_projet: 'PRJ-003',
    assigne_a: 'Marie Leclerc',
    date_creation: formatDate(new Date(TODAY.getTime() - 3.5 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 2 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-009',
    nom_tache: 'Création des supports marketing',
    desc_tache: 'Conception des brochures, site web et publicités',
    statut: 'en cours',
    date_debut: formatDate(new Date(TODAY.getTime() - ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + 0.25 * ONE_MONTH)),
    priorite: 'moyenne',
    id_projet: 'PRJ-003',
    assigne_a: 'Vincent Robert',
    date_creation: formatDate(new Date(TODAY.getTime() - 1.5 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 0.5 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-010',
    nom_tache: 'Organisation événement de lancement',
    desc_tache: 'Planification de l\'événement de lancement à Paris',
    statut: 'en cours',
    date_debut: formatDate(new Date(TODAY.getTime() - 0.5 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + 0.5 * ONE_MONTH)),
    priorite: 'haute',
    id_projet: 'PRJ-003',
    assigne_a: 'Camille Bernard',
    date_creation: formatDate(new Date(TODAY.getTime() - ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 0.25 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-011',
    nom_tache: 'Tests utilisateurs produit Alpha',
    desc_tache: 'Organisation de tests avec les utilisateurs finaux',
    statut: 'à faire',
    date_debut: formatDate(new Date(TODAY.getTime() + 0.25 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + 0.75 * ONE_MONTH)),
    priorite: 'moyenne',
    id_projet: 'PRJ-003',
    assigne_a: 'Julien Moreau',
    date_creation: formatDate(new Date(TODAY.getTime() - 0.75 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 0.75 * ONE_MONTH))
  },
  
  // Tâches pour PRJ-004 (projet terminé)
  {
    id_tache: 'TSK-012',
    nom_tache: 'Analyse des flux logistiques',
    desc_tache: 'Cartographie complète des flux logistiques actuels',
    statut: 'terminé',
    date_debut: formatDate(new Date(TODAY.getTime() - 5 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - 4 * ONE_MONTH)),
    priorite: 'haute',
    id_projet: 'PRJ-004',
    assigne_a: 'Pierre Dubois',
    date_creation: formatDate(new Date(TODAY.getTime() - 5.5 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 4 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-013',
    nom_tache: 'Implémentation nouveau WMS',
    desc_tache: 'Mise en place du nouveau système de gestion d\'entrepôt',
    statut: 'terminé',
    date_debut: formatDate(new Date(TODAY.getTime() - 3 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - 1.5 * ONE_MONTH)),
    priorite: 'critique',
    id_projet: 'PRJ-004',
    assigne_a: 'David Leroux',
    date_creation: formatDate(new Date(TODAY.getTime() - 3.5 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 1.5 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-014',
    nom_tache: 'Formation équipes logistiques',
    desc_tache: 'Formation des équipes sur le nouveau système WMS',
    statut: 'terminé',
    date_debut: formatDate(new Date(TODAY.getTime() - 1.5 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - 0.5 * ONE_MONTH)),
    priorite: 'haute',
    id_projet: 'PRJ-004',
    assigne_a: 'Emma Rousseau',
    date_creation: formatDate(new Date(TODAY.getTime() - 2 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 0.5 * ONE_MONTH))
  },
  
  // Tâches pour PRJ-006 (application mobile)
  {
    id_tache: 'TSK-015',
    nom_tache: 'Design de l\'interface utilisateur',
    desc_tache: 'Conception des maquettes UI/UX pour l\'application mobile',
    statut: 'terminé',
    date_debut: formatDate(new Date(TODAY.getTime() - 4 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - 3 * ONE_MONTH)),
    priorite: 'haute',
    id_projet: 'PRJ-006',
    assigne_a: 'Christophe Blanc',
    date_creation: formatDate(new Date(TODAY.getTime() - 4.5 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 3 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-016',
    nom_tache: 'Développement frontend',
    desc_tache: 'Implémentation des interfaces utilisateur',
    statut: 'en cours',
    date_debut: formatDate(new Date(TODAY.getTime() - 3 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + 0.5 * ONE_MONTH)),
    priorite: 'haute',
    id_projet: 'PRJ-006',
    assigne_a: 'Thierry Dupuis',
    date_creation: formatDate(new Date(TODAY.getTime() - 3.5 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 0.25 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-017',
    nom_tache: 'Développement backend',
    desc_tache: 'Implémentation des API et services backend',
    statut: 'en cours',
    date_debut: formatDate(new Date(TODAY.getTime() - 2 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + ONE_MONTH)),
    priorite: 'critique',
    id_projet: 'PRJ-006',
    assigne_a: 'Sarah Mercier',
    date_creation: formatDate(new Date(TODAY.getTime() - 2.5 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 0.25 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-018',
    nom_tache: 'Tests d\'intégration',
    desc_tache: 'Tests d\'intégration entre le frontend et le backend',
    statut: 'à faire',
    date_debut: formatDate(new Date(TODAY.getTime() + ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + 1.5 * ONE_MONTH)),
    priorite: 'haute',
    id_projet: 'PRJ-006',
    assigne_a: 'Hugo Martin',
    date_creation: formatDate(new Date(TODAY.getTime() - ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - ONE_MONTH))
  },
  {
    id_tache: 'TSK-019',
    nom_tache: 'Déploiement sur les stores',
    desc_tache: 'Publication de l\'application sur App Store et Google Play',
    statut: 'à faire',
    date_debut: formatDate(new Date(TODAY.getTime() + 1.5 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() + 2 * ONE_MONTH)),
    priorite: 'moyenne',
    id_projet: 'PRJ-006',
    assigne_a: 'Julie Lefevre',
    date_creation: formatDate(new Date(TODAY.getTime() - ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - ONE_MONTH))
  },
  
  // Quelques tâches pour d'autres projets
  {
    id_tache: 'TSK-020',
    nom_tache: 'Analyse RGPD des processus',
    desc_tache: 'Analyse des processus existants vis-à-vis du RGPD',
    statut: 'terminé',
    date_debut: formatDate(new Date(TODAY.getTime() - 3 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - 2 * ONE_MONTH)),
    priorite: 'haute',
    id_projet: 'PRJ-009',
    assigne_a: 'Laura Blanc',
    date_creation: formatDate(new Date(TODAY.getTime() - 3.5 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 2 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-021',
    nom_tache: 'Conception maquettes site web',
    desc_tache: 'Design des maquettes pour le nouveau site corporate',
    statut: 'terminé',
    date_debut: formatDate(new Date(TODAY.getTime() - 2 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - 1.5 * ONE_MONTH)),
    priorite: 'haute',
    id_projet: 'PRJ-010',
    assigne_a: 'Antoine Leroy',
    date_creation: formatDate(new Date(TODAY.getTime() - 2.5 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 1.5 * ONE_MONTH))
  },
  {
    id_tache: 'TSK-022',
    nom_tache: 'Installation bornes vélos électriques',
    desc_tache: 'Installation de bornes pour vélos électriques sur tous les sites',
    statut: 'terminé',
    date_debut: formatDate(new Date(TODAY.getTime() - 3 * ONE_MONTH)),
    date_fin: formatDate(new Date(TODAY.getTime() - 2 * ONE_MONTH)),
    priorite: 'moyenne',
    id_projet: 'PRJ-008',
    assigne_a: 'Lucas Vert',
    date_creation: formatDate(new Date(TODAY.getTime() - 3.5 * ONE_MONTH)),
    derniere_modification: formatDate(new Date(TODAY.getTime() - 2 * ONE_MONTH))
  }
];

// Données simulées pour les livrables
export const mockLivrables: Livrable[] = [
  // Livrables pour PRJ-001
  {
    Id_Livrable: 1,
    Date_: formatDate(new Date(TODAY.getTime() - 1.5 * ONE_MONTH)),
    Réalisations: 'Rapport d\'audit complet de l\'infrastructure IT existante',
    Réserves: 'Certains systèmes legacy nécessitent une attention particulière',
    Approbation: 'approuvé',
    _Recommandation: 'Procéder à la migration par phases pour minimiser les risques',
    id_projet: 'PRJ-001',
    titre: 'Audit Infrastructure IT',
    version: '1.0',
    createur: 'Nicolas Laurent',
    date_creation: formatDate(new Date(TODAY.getTime() - 1.6 * ONE_MONTH))
  },
  {
      Id_Livrable: 2,
      Date_: formatDate(new Date(TODAY.getTime() - 0.5 * ONE_MONTH)),
      Réalisations: "",
      Réserves: "",
      Approbation: "approuvé",
      _Recommandation: "",
      id_projet: ""
  }
];
