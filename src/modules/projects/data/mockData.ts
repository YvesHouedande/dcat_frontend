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
  // ... autres données
<<<<<<< HEAD
=======
];

// app/data/mockMissions.ts
export interface Mission {
  id: number;
  title: string;
  project: string;
  responsible: string;
  priority: "low" | "medium" | "high";
  status: "à faire" | "en cours" | "terminée";
  startTime: string;
  endTime: string;
}

export const initialMissions: Mission[] = [
  {
    id: 1,
    title: "Nettoyage de la salle 101",
    project: "Entretien des locaux",
    responsible: "Jean Dupont",
    priority: "medium",
    status: "à faire",
    startTime: "2025-04-07T08:00:00",
    endTime: "2025-04-07T10:00:00",
  },
  {
    id: 2,
    title: "Réparation du plafond",
    project: "Maintenance du bâtiment",
    responsible: "Marie Martin",
    priority: "high",
    status: "en cours",
    startTime: "2025-04-07T09:00:00",
    endTime: "2025-04-07T11:00:00",
  },
  {
    id: 3,
    title: "Inspection des systèmes électriques",
    project: "Sécurité des installations",
    responsible: "Pierre Durand",
    priority: "low",
    status: "terminée",
    startTime: "2025-04-06T14:00:00",
    endTime: "2025-04-06T16:00:00",
  },
  {
    id: 4,
    title: "Entretien des ordinateurs",
    project: "Maintenance informatique",
    responsible: "Sophie Lambert",
    priority: "medium",
    status: "à faire",
    startTime: "2025-04-07T10:30:00",
    endTime: "2025-04-07T12:30:00",
  },
  {
    id: 5,
    title: "Désinfection des toilettes",
    project: "Hygiène des espaces communs",
    responsible: "Lucie Petit",
    priority: "high",
    status: "en cours",
    startTime: "2025-04-07T11:30:00",
    endTime: "2025-04-07T13:00:00",
  },
  {
    id: 6,
    title: "Contrôle de la température dans les laboratoires",
    project: "Maintenance des équipements",
    responsible: "Thomas Moreau",
    priority: "medium",
    status: "à faire",
    startTime: "2025-04-07T13:00:00",
    endTime: "2025-04-07T15:00:00",
  },
  {
    id: 7,
    title: "Réparation du système de son",
    project: "Audiovisuel",
    responsible: "Nicolas Leroy",
    priority: "high",
    status: "terminée",
    startTime: "2025-04-06T15:00:00",
    endTime: "2025-04-06T17:00:00",
  },
  {
    id: 8,
    title: "Vérification de la sécurité des issues de secours",
    project: "Sécurité incendie",
    responsible: "Émilie Rousseau",
    priority: "low",
    status: "à faire",
    startTime: "2025-04-07T16:00:00",
    endTime: "2025-04-07T18:00:00",
  },
];

export const initialTasks = [
  {
    id: 1,
    title: "Mise à jour documentation",
    description: "Mettre à jour la documentation de l'API avec les nouvelles fonctionnalités",
    missionId: "mission1",
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
    missionId: "mission1",
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
    missionId: "mission2",
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
    missionId: "mission3",
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
    id: 1,
    nom: "Refonte site e-commerce",
    type: "informatique",
    devis: 25000,
    dateDebut: "2025-03-15",
    dateFin: "2025-06-30",
    duree: "3 mois et 15 jours",
    description: "Refonte complète du site e-commerce avec intégration d'un nouveau système de paiement et amélioration de l'expérience utilisateur.",
    etat: "en_cours",
    famille: "developpement",
    partenaire: "p1"
  },
  {
    id: 2,
    nom: "Développement application mobile",
    type: "informatique",
    devis: 18000,
    dateDebut: "2025-04-01",
    dateFin: "2025-07-15",
    duree: "3 mois et 14 jours",
    description: "Création d'une application mobile pour iOS et Android permettant aux clients de suivre leurs commandes en temps réel.",
    etat: "en_cours",
    famille: "developpement",
    partenaire: "p2"
  },
  {
    id: 3,
    nom: "Migration infrastructure cloud",
    type: "infrastructure",
    devis: 45000,
    dateDebut: "2025-02-10",
    dateFin: "2025-05-20",
    duree: "3 mois et 10 jours",
    description: "Migration de l'infrastructure existante vers une solution cloud pour améliorer la scalabilité et réduire les coûts de maintenance.",
    etat: "en_attente",
    famille: "recherche",
    partenaire: "p1"
  },
  {
    id: 4,
    nom: "Campagne marketing produit X",
    type: "marketing",
    devis: 12000,
    dateDebut: "2025-01-15",
    dateFin: "2025-03-15",
    duree: "2 mois",
    description: "Campagne de promotion pour le lancement du nouveau produit X, incluant publicités en ligne, événements et relations presse.",
    etat: "termine",
    famille: "developpement",
    partenaire: "p2"
  },
  {
    id: 5,
    nom: "Développement API partenaires",
    type: "informatique",
    devis: 15000,
    dateDebut: "2025-05-01",
    dateFin: "2025-07-31",
    duree: "3 mois",
    description: "Création d'une API sécurisée permettant aux partenaires d'accéder à certaines données et fonctionnalités de notre plateforme.",
    etat: "en_attente",
    famille: "developpement",
    partenaire: "p1"
  }
];

// Mappings pour les traductions et informations supplémentaires
export const typeProjetOptions = [
  { value: "informatique", label: "Informatique" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "marketing", label: "Marketing" }
];

export const etatProjetOptions = [
  { value: "en_cours", label: "En cours", color: "bg-blue-100 text-blue-800" },
  { value: "termine", label: "Terminé", color: "bg-green-100 text-green-800" },
  { value: "en_attente", label: "En attente", color: "bg-yellow-100 text-yellow-800" }
];

export const familleProjetOptions = [
  { value: "developpement", label: "Développement" },
  { value: "recherche", label: "Recherche" }
];

export const partenaireOptions = [
  { value: "p1", label: "Partenaire 1" },
  { value: "p2", label: "Partenaire 2" }
];



// Données mock pour les membres de l'équipe
// export const teamMembersData = [
//   { id: "1", name: "Marie Lambert", role: "Développeuse principale", initials: "ML", bgColor: "bg-blue-500" },
//   { id: "2", name: "Pierre Martin", role: "Développeur backend", initials: "PM", bgColor: "bg-blue-500" },
//   { id: "3", name: "Sophie Chen", role: "QA Engineer", initials: "SC", bgColor: "bg-blue-500" },
//   { id: "4", name: "Jean Dupont", role: "Chef de projet", initials: "JD", bgColor: "bg-blue-500" }
// ];

// Données mock pour les fichiers du projet
export const filesData = [
  { id: "1", name: "Spécifications.pdf", type: "pdf", size: "2.4 MB", date: "15/06/2023" },
  { id: "2", name: "schéma_db.sql", type: "sql", size: "1.1 MB", date: "18/06/2023" },
  { id: "3", name: "Tests.xlsx", type: "xlsx", size: "3.7 MB", date: "20/06/2023" }
];

// // Données mock pour les tâches
// export const tasksData = [
//   { 
//     id: "1", 
//     title: "Conception de la base de données", 
//     assigneeId: "1", // Référence à Marie Lambert
//     status: "completed", 
//     dateRange: "15/06 - 20/06" 
//   },
//   { 
//     id: "2", 
//     title: "Développement de l'interface admin", 
//     assigneeId: "2", // Référence à Pierre Martin
//     status: "in-progress", 
//     dateRange: "20/06 - 30/06" 
//   }
// ];

// Données mock pour les dates clés
export const keyDatesData = [
  { id: "1", name: "Démarrage", date: "15/06/2023" },
  { id: "2", name: "Revue de conception", date: "05/07/2023" },
  { id: "3", name: "Tests d'intégration", date: "15/08/2023" },
  { id: "4", name: "Échéance finale", date: "30/09/2023" }
];


// app/data/mockData.js

// Données mock pour un projet spécifique
// app/data/mockData.js

// Données mock pour une mission spécifique
export const missionData = {
  id: "1",
  title: "Refonte site e-commerce",
  description: "Refonte complète du site e-commerce avec intégration d'un nouveau système de paiement et amélioration de l'expérience utilisateur. Optimisation pour mobile et tablette.",
  objectives: [
    "Améliorer la navigation et l'expérience utilisateur",
    "Intégrer un nouveau système de paiement sécurisé",
    "Optimiser les performances du site",
    "Refonte visuelle complète"
  ],
  type: "Informatique",
  projectId: "101",
  projectName: "Transformation Digitale Entreprise X",
  partnerId: "1", // Référence au partenaire "Partenaire 1"
  status: "En cours",
  startDate: "15/03/2025",
  endDate: "30/06/2025",
  startDateRaw: "2025-03-15",
  endDateRaw: "2025-06-30",
  duration: "3 mois et 15 jours",
  budget: 25000,
  actualCost: 15000, // Coût actuel engagé
  budgetVariance: "-10%", // Écart budgétaire
  lastUpdate: "05/04/2025",
  resources: [
    { name: "Cahier des charges", url: "/documents/cdc-ecommerce.pdf" },
    { name: "Maquettes UI/UX", url: "/documents/maquettes-ecommerce.pdf" },
    { name: "Planning détaillé", url: "/documents/planning-ecommerce.pdf" }
  ]
};

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
    missionId: "1",
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
    missionId: "1",
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
    missionId: "1",
    assigneeId: "3", // Référence à Sophie Chen
    status: "à faire", 
    priority: "medium",
    startTime: "2023-07-01T08:00:00",
    endTime: "2023-07-15T17:00:00",
    dateRange: "01/07 - 15/07" 
  }
>>>>>>> 9ef29a9 (jjk)
];