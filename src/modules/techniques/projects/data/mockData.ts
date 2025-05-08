export const mockTaskProgress = [
  { date: "01/04", created: 5, completed: 2 },
  { date: "02/04", created: 8, completed: 4 },
  { date: "03/04", created: 6, completed: 5 },
  { date: "04/04", created: 7, completed: 6 },
];

export const mockProjects = [
  { name: "Refonte du site web", owner: "Alice", progress: 80 },
  { name: "Déploiement ERP", owner: "Bob", progress: 60 },
  { name: "Développement Mobile", owner: "Charlie", progress: 45 },
];

export const mockPriorityTasks = [
  { name: "Finaliser le rapport", status: "En cours", dueDate: "2025-04-01" },
  { name: "Revue du code", status: "En attente", dueDate: "2025-04-05" },
  { name: "Livraison client", status: "Terminé", dueDate: "2025-03-28" },
];

export const mockTaskDistribution = [
  { name: 'En cours', value: 10, color: 'blue' },
  { name: 'Terminé', value: 8, color: 'green' },
  { name: 'En attente', value: 5, color: 'yellow' },
  { name: 'Annulé', value: 2, color: 'red' },
];

export const mockKPIs = [
   
  {
    title: "Total Revenue",
    value: "$1,250.00",
    trend: "up" as const, // <-- 'as const' pour le type littéral
    percentage: 12.5,    // <-- Number au lieu de string
    description: "Visitors for the last 6 months"
  },
  {
    title: "Total Revenue",
    value: "$1,250.00",
    trend: "up" as const, // <-- 'as const' pour le type littéral
    percentage: 12.5,    // <-- Number au lieu de string
    description: "Visitors for the last 6 months"
  },
  {
    title: "Total Revenue",
    value: "$1,250.00",
    trend: "up" as const, // <-- 'as const' pour le type littéral
    percentage: 12.5,    // <-- Number au lieu de string
    description: "Visitors for the last 6 months"
  },
  {
    title: "Total Revenue",
    value: "$1,250.00",
    trend: "up" as const, // <-- 'as const' pour le type littéral
    percentage: 12.5,    // <-- Number au lieu de string
    description: "Visitors for the last 6 months"
  },

];

export const initialTasks = [
  {
    id: 1,
    title: "Mise à jour documentation",
    description: "Mettre à jour la documentation de l'API avec les nouvelles fonctionnalités",
    projetId: "mission1",
    missionTitle: "Développement ERP",
    assignedTo: "Jean Dupont",
    priority: "medium",
    status: "todo",
    startDate: "2025-04-07T09:00:00",
    dueDate: "2025-04-12T18:00:00",
    estimatedHours: "8",
    tags: "documentation, api",
    notes: "Consulter l'équipe backend pour les détails techniques"
  },

  {
    id: 2,
    title: "Correction bug #1452",
    description: "Résoudre le problème d'affichage sur la page d'accueil",
    projetId: "mission1",
    missionTitle: "Développement ERP",
    assignedTo: "Marie Martin",
    priority: "high",
    status: "in-progress",
    startDate: "2025-04-05T10:00:00",
    dueDate: "2025-04-08T17:00:00",
    estimatedHours: "4",
    tags: "bug, urgent, frontend",
    notes: "Le bug se produit uniquement sur les appareils mobiles"
  },

  {
    id: 3,
    title: "Migration base de données clients",
    description: "Transférer les données clients de l'ancien système vers le nouveau",
    projetId: "mission2",
    missionTitle: "Migration de données",
    assignedTo: "Philippe Leroy",
    priority: "high",
    status: "review",
    startDate: "2025-04-01T08:00:00",
    dueDate: "2025-04-10T18:00:00",
    estimatedHours: "16",
    tags: "database, migration",
    notes: "Vérifier l'intégrité des données après migration"
  },
  {
    id: 4,
    title: "Préparation matériel formation",
    description: "Préparer les supports et exercices pour la formation utilisateurs",
    projetId: "mission3",
    missionTitle: "Formation utilisateurs",
    assignedTo: "Sophie Bernard",
    priority: "low",
    status: "completed",
    startDate: "2025-03-25T14:00:00",
    dueDate: "2025-04-05T17:00:00",
    estimatedHours: "12",
    tags: "formation, documentation",
    notes: "Inclure des études de cas pratiques"
  }
];


export const initialProjects = [
  {
    id_projet: "1",
    nom_projet: "Refonte site e-commerce",
    type_projet: "informatique",
    devis_estimatif: "25000",
    date_debut: "2025-03-15",
    date_fin: "2025-06-30",
    duree_prevu_projet: "3 mois et 15 jours",
    description_projet: "Refonte complète du site e-commerce avec intégration d'un nouveau système de paiement et amélioration de l'expérience utilisateur.",
    etat: "en_cours",
    lieu: "Paris",
    Responsable: "Jean Dupont",
    site: "Siège social",
    id_famille: "developpement",
    partenaire: "p1"
  },
  {
    id_projet: "2",
    nom_projet: "Développement application mobile",
    type_projet: "informatique",
    devis_estimatif: "18000",
    date_debut: "2025-04-01",
    date_fin: "2025-07-15",
    duree_prevu_projet: "3 mois et 14 jours",
    description_projet: "Création d'une application mobile pour iOS et Android permettant aux clients de suivre leurs commandes en temps réel.",
    etat: "en_cours",
    lieu: "Lyon",
    Responsable: "Marie Martin",
    site: "Bureau régional",
    id_famille: "developpement",
    partenaire: "p2"
  },
  {
    id_projet: "3",
    nom_projet: "Migration infrastructure cloud",
    type_projet: "infrastructure",
    devis_estimatif: "45000",
    date_debut: "2025-02-10",
    date_fin: "2025-05-20",
    duree_prevu_projet: "3 mois et 10 jours",
    description_projet: "Migration de l'infrastructure existante vers une solution cloud pour améliorer la scalabilité et réduire les coûts de maintenance.",
    etat: "en_attente",
    lieu: "Nantes",
    Responsable: "Pierre Lambert",
    site: "Data center",
    id_famille: "recherche",
    partenaire: "p3"
  },
  {
    id_projet: "4",
    nom_projet: "Campagne marketing produit X",
    type_projet: "marketing",
    devis_estimatif: "12000",
    date_debut: "2025-01-15",
    date_fin: "2025-03-15",
    duree_prevu_projet: "2 mois",
    description_projet: "Campagne de promotion pour le lancement du nouveau produit X, incluant publicités en ligne, événements et relations presse.",
    etat: "termine",
    lieu: "National",
    Responsable: "Sophie Bernard",
    site: "Tous sites",
    id_famille: "marketing",
    partenaire: "p4"
  },
  {
    id_projet: "5",
    nom_projet: "Développement API partenaires",
    type_projet: "informatique",
    devis_estimatif: "15000",
    date_debut: "2025-05-01",
    date_fin: "2025-07-31",
    duree_prevu_projet: "3 mois",
    description_projet: "Création d'une API sécurisée permettant aux partenaires d'accéder à certaines données et fonctionnalités de notre plateforme.",
    etat: "en_attente",
    lieu: "Toulouse",
    Responsable: "Thomas Leroy",
    site: "Centre R&D",
    id_famille: "developpement",
    partenaire: "p5"
  },
  {
    id_projet: "6",
    nom_projet: "Refonte Interface Utilisateur",
    type_projet: "design",
    devis_estimatif: "12000",
    date_debut: "2025-06-15",
    date_fin: "2025-08-30",
    duree_prevu_projet: "2 mois et 15 jours",
    description_projet: "Modernisation complète de l'interface utilisateur pour améliorer l'expérience client.",
    etat: "a_planifie",
    lieu: "Paris",
    Responsable: "Laura Petit",
    site: "Siège social",
    id_famille: "design",
    partenaire: "p6"
  },
  {
    id_projet: "7",
    nom_projet: "Migration Base de Données",
    type_projet: "informatique",
    devis_estimatif: "18000",
    date_debut: "2025-07-01",
    date_fin: "2025-09-15",
    duree_prevu_projet: "2 mois et 15 jours",
    description_projet: "Migration des données vers un nouveau système de gestion de base de données plus performant.",
    etat: "en_attente",
    lieu: "Lyon",
    Responsable: "Nicolas Roche",
    site: "Bureau régional",
    id_famille: "infrastructure",
    partenaire: "p7"
  },
  {
    id_projet: "8",
    nom_projet: "Formation Équipe DevOps",
    type_projet: "formation",
    devis_estimatif: "8000",
    date_debut: "2025-05-10",
    date_fin: "2025-05-24",
    duree_prevu_projet: "2 semaines",
    description_projet: "Formation intensive sur les pratiques DevOps pour l'équipe technique.",
    etat: "en_cours",
    lieu: "Paris",
    Responsable: "Alexandre Dubois",
    site: "Siège social",
    id_famille: "ressources_humaines",
    partenaire: "p8"
  },
  {
    id_projet: "9",
    nom_projet: "Développement Application Mobile",
    type_projet: "informatique",
    devis_estimatif: "25000",
    date_debut: "2025-08-01",
    date_fin: "2025-11-30",
    duree_prevu_projet: "4 mois",
    description_projet: "Création d'une application mobile cross-platform pour les clients finaux.",
    etat: "a_planifie",
    lieu: "Marseille",
    Responsable: "Élodie Martin",
    site: "Bureau régional",
    id_famille: "developpement",
    partenaire: "p9"
  },
  {
    id_projet: "10",
    nom_projet: "Audit de Sécurité",
    type_projet: "securite",
    devis_estimatif: "15000",
    date_debut: "2025-06-01",
    date_fin: "2025-07-15",
    duree_prevu_projet: "1 mois et 15 jours",
    description_projet: "Évaluation complète des vulnérabilités et recommandations pour améliorer la sécurité.",
    etat: "en_attente",
    lieu: "National",
    Responsable: "David Morel",
    site: "Tous sites",
    id_famille: "securite",
    partenaire: "p10"
  }
];

// Mappings pour les traductions et informations supplémentaires
export const typeProjetOptions = [
  { value: "informatique", label: "Informatique" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "marketing", label: "Marketing" }
];

export const etatProjetOptions = [
  { value: "a_planifie", label: "À planifier", color: "bg-gray-600 text-gray-100" },
  { value: "en_cours", label: "En cours", color: "bg-blue-100 text-blue-800" },
  { value: "termine", label: "Terminé", color: "bg-green-100 text-green-800" },
  { value: "en_attente", label: "En attente", color: "bg-yellow-100 text-yellow-800" }
];

export const familleProjetOptions = [
  { value: "developpement", label: "Développement" },
  { value: "recherche", label: "Recherche" }
];

export const partenaireOptions = [
  { value: "p1", label: "HIT RADIO" },
  { value: "p2", label: "ISTC" },
  { value: "p3", label: "COCODY FM" },
  { value: "p4", label: "FREQUENCE VIE" },
  { value: "p5", label: "FREQUENCE JEUNE" },
  { value: "p6", label: "MEDIA PLUS" },
  { value: "p7", label: "RADIOLY" },
  { value: "p8", label: "URBAN FM" },
  { value: "p9", label: "GENERATION FM" },
  { value: "p10", label: "TRACE FM" },
  { value: "p11", label: "7INFO" },
  { value: "p12", label: "STAR CHANNEL" },
  { value: "p13", label: "INFO EXPRESS" },
  { value: "p14", label: "SUD COM" },
  { value: "p15", label: "PANAFRICAN MEDIA" }
];

// Données mock pour les fichiers du projet
export const filesData = [
  { id: "1", name: "Spécifications.pdf", type: "pdf", size: "2.4 MB", date: "15/06/2023" },
  { id: "2", name: "schéma_db.sql", type: "sql", size: "1.1 MB", date: "18/06/2023" },
  { id: "3", name: "Tests.xlsx", type: "xlsx", size: "3.7 MB", date: "20/06/2023" }
];


// Données mock pour les dates clés
export const keyDatesData = [
  { id: "1", name: "Démarrage", date: "15/06/2023" },
  { id: "2", name: "Revue de conception", date: "05/07/2023" },
  { id: "3", name: "Tests d'intégration", date: "15/08/2023" },
  { id: "4", name: "Échéance finale", date: "30/09/2023" }
];

// Données mock pour les partenaires
export const partnersData = [
  { 
    id: "1", 
    name: "Partenaire 1", 
    contactName: "Jean Martin",
    email: "jean.martin@partenaire1.com",
    phone: "01 23 45 67 89",
    location: "Paris, France"
  },
  { 
    id: "2", 
    name: "Partenaire 2", 
    contactName: "Marie Dubois",
    email: "marie.dubois@partenaire2.com",
    phone: "01 98 76 54 32",
    location: "Lyon, France"
  }
];

// Données mock pour les projets
export const projectsData = [
  {
    id: "101",
    name: "Transformation Digitale Entreprise X",
    description: "Projet global de transformation digitale incluant plusieurs missions",
    status: "En cours",
    startDate: "01/01/2025",
    endDate: "31/12/2025"
  },
  {
    id: "102",
    name: "Refonte des Systèmes Internes",
    description: "Modernisation des systèmes d'information internes",
    status: "En attente",
    startDate: "01/07/2025",
    endDate: "31/12/2025"
  }
];

// Données mock pour les membres de l'équipe
export const teamMembersData = [
  { id: "1", name: "Marie Lambert", role: "Développeuse principale", initials: "ML", bgColor: "bg-blue-500" },
  { id: "2", name: "Pierre Martin", role: "Développeur backend", initials: "PM", bgColor: "bg-blue-500" },
  { id: "3", name: "Sophie Chen", role: "QA Engineer", initials: "SC", bgColor: "bg-blue-500" },
  { id: "4", name: "Jean Dupont", role: "Chef de projet", initials: "JD", bgColor: "bg-blue-500" }
];

// Données mock pour les tâches
export const tasksData = [
  { 
    id: "1", 
    title: "Conception de la base de données", 
    projetId: "1",
    assigneeId: "1", // Référence à Marie Lambert
    status: "terminée", 
    priority: "high",
    startTime: "2023-06-15T08:00:00",
    endTime: "2023-06-20T17:00:00",
    dateRange: "15/06 - 20/06" 
  },
  { 
    id: "2", 
    title: "Développement de l'interface admin", 
    projetId: "1",
    assigneeId: "2", // Référence à Pierre Martin
    status: "en cours", 
    priority: "medium",
    startTime: "2023-06-20T08:00:00",
    endTime: "2023-06-30T17:00:00",
    dateRange: "20/06 - 30/06" 
  },
  { 
    id: "3", 
    title: "Tests d'intégration", 
    projetId: "1",
    assigneeId: "3", // Référence à Sophie Chen
    status: "à faire", 
    priority: "medium",
    startTime: "2023-07-01T08:00:00",
    endTime: "2023-07-15T17:00:00",
    dateRange: "01/07 - 15/07" 
  }
];