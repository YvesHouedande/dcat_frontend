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
];

// export const missions = [
//   {
//     id: "1",
//     title: "Refonte de l'application web client",
//     reference: "MISSION-2025-042",
//     client: "Entreprise XYZ",
//     startDate: "2025-04-15",
//     endDate: "2025-07-30",
//     responsable: "Sophie Martin",
//     status: "in-progress",
//     budget: "45000",
//     priority: "medium",
//     teamMembers: [
//       "Thomas Dubois",
//       "Julie Leroy",
//       "Alexandre Bernard"
//     ],
//     description: "Cette mission consiste à moderniser l'application web client existante en la refondant entièrement avec les technologies actuelles pour améliorer l'expérience utilisateur et la performance.",
//     objectives: "1. Améliorer la vitesse de chargement de 50%\n2. Augmenter le taux de conversion de 20%\n3. Réduire les abandons de panier de 15%\n4. Mettre en place un système de paiement sécurisé",
//     createdAt: "2025-03-20",
//     updatedAt: "2025-04-05",
//   },
//   {
//     id: "2",
//     title: "Audit sécurité infrastructure",
//     reference: "MISSION-2025-043",
//     client: "Société ABC",
//     startDate: "2025-04-10",
//     endDate: null,
//     responsable: "Alexandre Bernard",
//     status: "not-started",
//     budget: "25000",
//     priority: "high",
//     teamMembers: [
//       "Marie Petit",
//       "Nicolas Richard"
//     ],
//     description: "Réalisation d'un audit complet de l'infrastructure de sécurité du client avec identification des vulnérabilités et recommandations d'amélioration.",
//     objectives: "1. Identifier toutes les vulnérabilités critiques\n2. Proposer un plan de remédiation\n3. Former l'équipe technique du client",
//     createdAt: "2025-03-25",
//     updatedAt: "2025-03-25",
//   },
//   {
//     id: "3",
//     title: "Formation React avancé",
//     reference: "MISSION-2025-044",
//     client: "StartupTech",
//     startDate: "2025-05-05",
//     endDate: "2025-05-10",
//     responsable: "Julie Leroy",
//     status: "on-hold",
//     budget: "8500",
//     priority: "low",
//     teamMembers: [
//       "Thomas Dubois"
//     ],
//     description: "Organisation et animation d'une formation de 5 jours sur React avancé pour l'équipe de développement de StartupTech.",
//     objectives: "1. Maîtrise des hooks\n2. Architecture d'applications complexes\n3. Performance et optimisation\n4. Tests unitaires et d'intégration",
//     createdAt: "2025-04-01",
//     updatedAt: "2025-04-03",
//   }
// ];

// export const missionData = {
//   id: "1",
//   title: "Refonte de l'application web client",
//   reference: "MISSION-2025-042",
//   client: "Entreprise XYZ",
//   startDate: new Date(2025, 3, 15),
//   endDate: new Date(2025, 6, 30),
//   responsable: "Sophie Martin",
//   status: "in-progress",
//   budget: "45000",
//   priority: "medium",
//   teamMembers: [
//     "Thomas Dubois",
//     "Julie Leroy",
//     "Alexandre Bernard"
//   ],
//   description: "Cette mission consiste à moderniser l'application web client existante en la refondant entièrement avec les technologies actuelles pour améliorer l'expérience utilisateur et la performance.",
//   objectives: "1. Améliorer la vitesse de chargement de 50%\n2. Augmenter le taux de conversion de 20%\n3. Réduire les abandons de panier de 15%\n4. Mettre en place un système de paiement sécurisé",
//   createdAt: new Date(2025, 2, 20),
//   updatedAt: new Date(2025, 3, 5),
// };

// export const statusDisplay = {
//   "not-started": { label: "Non démarré", color: "bg-slate-200 text-slate-800" },
//   "in-progress": { label: "En cours", color: "bg-blue-200 text-blue-800" },
//   "on-hold": { label: "En attente", color: "bg-yellow-200 text-yellow-800" },
//   "completed": { label: "Terminé", color: "bg-green-200 text-green-800" },
//   "cancelled": { label: "Annulé", color: "bg-red-200 text-red-800" },
// };

// export const priorityDisplay = {
//   "low": { label: "Basse", color: "bg-green-100 text-green-800 border-green-300" },
//   "medium": { label: "Moyenne", color: "bg-orange-100 text-orange-800 border-orange-300" },
//   "high": { label: "Haute", color: "bg-red-100 text-red-800 border-red-300" },
// };




// mockData.ts

export const initialMissions = [
    {
    id: 1,
    title: "Nettoyage de la salle 101",
    description: "Nettoyer la salle après le cours de physique",
    priority: "medium",
    status: "à faire",
    startTime: "2025-04-07T08:00:00",
    endTime: "2025-04-07T10:00:00",
  },
  {
    id: 2,
    title: "Réparation du plafond",
    description: "Réparer une fissure dans le plafond du hall",
    priority: "high",
    status: "en cours",
    startTime: "2025-04-07T09:00:00",
    endTime: "2025-04-07T11:00:00",
  },
  {
    id: 3,
    title: "Inspection des systèmes électriques",
    description: "Vérification du câblage et des circuits électriques",
    priority: "low",
    status: "terminée",
    startTime: "2025-04-06T14:00:00",
    endTime: "2025-04-06T16:00:00",
  },
  {
    id: 4,
    title: "Entretien des ordinateurs",
    description: "Mettre à jour les logiciels et nettoyer les PC",
    priority: "medium",
    status: "à faire",
    startTime: "2025-04-07T10:30:00",
    endTime: "2025-04-07T12:30:00",
  },
  {
    id: 5,
    title: "Désinfection des toilettes",
    description: "Nettoyer et désinfecter toutes les toilettes du bâtiment",
    priority: "high",
    status: "en cours",
    startTime: "2025-04-07T11:30:00",
    endTime: "2025-04-07T13:00:00",
  },
  {
    id: 6,
    title: "Contrôle de la température dans les laboratoires",
    description: "Vérification des systèmes de climatisation et chauffage",
    priority: "medium",
    status: "à faire",
    startTime: "2025-04-07T13:00:00",
    endTime: "2025-04-07T15:00:00",
  },
  {
    id: 7,
    title: "Réparation du système de son",
    description: "Réparer le système audio dans la salle de conférence",
    priority: "high",
    status: "terminée",
    startTime: "2025-04-06T15:00:00",
    endTime: "2025-04-06T17:00:00",
  },
  {
    id: 8,
    title: "Vérification de la sécurité des issues de secours",
    description: "Assurer que toutes les issues de secours sont accessibles",
    priority: "low",
    status: "à faire",
    startTime: "2025-04-07T16:00:00",
    endTime: "2025-04-07T18:00:00",
  },
  {
    id: 9,
    title: "Installation de nouveaux équipements",
    description: "Installer des équipements dans la salle informatique",
    priority: "medium",
    status: "en cours",
    startTime: "2025-04-07T18:00:00",
    endTime: "2025-04-07T20:00:00",
  },
  {
    id: 10,
    title: "Révision des détecteurs de fumée",
    description: "Vérifier le bon fonctionnement des détecteurs de fumée",
    priority: "high",
    status: "terminée",
    startTime: "2025-04-06T17:30:00",
    endTime: "2025-04-06T19:00:00",
  },
  {
    id: 11,
    title: "Nettoyage de la piscine",
    description: "Vider et nettoyer la piscine extérieure",
    priority: "medium",
    status: "à faire",
    startTime: "2025-04-08T08:00:00",
    endTime: "2025-04-08T10:00:00",
  },
  {
    id: 12,
    title: "Rénovation des toilettes",
    description: "Rénover les toilettes du rez-de-chaussée",
    priority: "low",
    status: "en cours",
    startTime: "2025-04-08T10:00:00",
    endTime: "2025-04-08T12:00:00",
  },
  {
    id: 13,
    title: "Réparation du chauffage central",
    description: "Réparer le chauffage dans les bureaux",
    priority: "high",
    status: "terminée",
    startTime: "2025-04-07T14:00:00",
    endTime: "2025-04-07T16:00:00",
  },
  {
    id: 14,
    title: "Vérification des extincteurs",
    description: "Assurer que tous les extincteurs sont en bon état",
    priority: "medium",
    status: "à faire",
    startTime: "2025-04-08T12:30:00",
    endTime: "2025-04-08T14:30:00",
  },
  {
    id: 15,
    title: "Contrôle des ascenseurs",
    description: "Vérifier le bon fonctionnement des ascenseurs",
    priority: "low",
    status: "en cours",
    startTime: "2025-04-08T14:00:00",
    endTime: "2025-04-08T16:00:00",
  },
  {
    id: 16,
    title: "Réparation du toit",
    description: "Réparer une fuite sur le toit du bâtiment C",
    priority: "high",
    status: "terminée",
    startTime: "2025-04-07T16:00:00",
    endTime: "2025-04-07T18:00:00",
  },
  {
    id: 17,
    title: "Mise à jour des ordinateurs",
    description: "Mettre à jour le système d'exploitation des PC du labo",
    priority: "medium",
    status: "à faire",
    startTime: "2025-04-08T15:00:00",
    endTime: "2025-04-08T17:00:00",
  },
  {
    id: 18,
    title: "Installation d'un nouveau réseau Wi-Fi",
    description: "Installer des bornes Wi-Fi dans la bibliothèque",
    priority: "high",
    status: "en cours",
    startTime: "2025-04-08T17:30:00",
    endTime: "2025-04-08T19:30:00",
  },
  {
    id: 19,
    title: "Vérification du système de vidéosurveillance",
    description: "Tester les caméras et enregistreurs de vidéosurveillance",
    priority: "low",
    status: "terminée",
    startTime: "2025-04-07T18:30:00",
    endTime: "2025-04-07T20:00:00",
  },
  {
    id: 20,
    title: "Réparation des fenêtres",
    description: "Réparer les fenêtres cassées dans le bâtiment B",
    priority: "medium",
    status: "à faire",
    startTime: "2025-04-08T20:00:00",
    endTime: "2025-04-08T22:00:00",
  },
  {
    id: 21,
    title: "Mise en place d'un système de gestion des déchets",
    description: "Installer des poubelles de recyclage et de compostage",
    priority: "low",
    status: "en cours",
    startTime: "2025-04-09T08:00:00",
    endTime: "2025-04-09T10:00:00",
  },
  {
    id: 22,
    title: "Entretien des ascenseurs",
    description: "Entretien des ascenseurs dans tous les bâtiments",
    priority: "high",
    status: "terminée",
    startTime: "2025-04-08T08:30:00",
    endTime: "2025-04-08T10:00:00",
  },
  {
    id: 23,
    title: "Amélioration de l'éclairage",
    description: "Installer des lumières supplémentaires dans les parkings",
    priority: "medium",
    status: "à faire",
    startTime: "2025-04-09T10:30:00",
    endTime: "2025-04-09T12:30:00",
  },
  {
    id: 24,
    title: "Entretien des espaces verts",
    description: "Tondre la pelouse et tailler les haies autour du campus",
    priority: "low",
    status: "en cours",
    startTime: "2025-04-09T12:00:00",
    endTime: "2025-04-09T14:00:00",
  },
  {
    id: 25,
    title: "Réparation du système de chauffage",
    description: "Réparer les radiateurs dans le bâtiment A",
    priority: "high",
    status: "terminée",
    startTime: "2025-04-08T14:30:00",
    endTime: "2025-04-08T16:30:00",
  },
  {
    id: 26,
    title: "Installation de nouveaux éclairages",
    description: "Ajouter des éclairages LED dans les couloirs",
    priority: "medium",
    status: "à faire",
    startTime: "2025-04-09T16:30:00",
    endTime: "2025-04-09T18:30:00",
  },
  {
    id: 27,
    title: "Réparation des portes automatiques",
    description: "Réparer les portes automatiques de l'entrée principale",
    priority: "high",
    status: "en cours",
    startTime: "2025-04-09T18:00:00",
    endTime: "2025-04-09T20:00:00",
  },
  {
    id: 28,
    title: "Installation de bornes de recharge pour véhicules électriques",
    description: "Installer des bornes de recharge dans le parking",
    priority: "medium",
    status: "terminée",
    startTime: "2025-04-08T20:30:00",
    endTime: "2025-04-08T22:30:00",
  },
  {
    id: 29,
    title: "Entretien des chaudières",
    description: "Vérifier le bon fonctionnement des chaudières dans le bâtiment C",
    priority: "low",
    status: "à faire",
    startTime: "2025-04-09T22:00:00",
    endTime: "2025-04-10T00:00:00",
  },
  {
    id: 30,
    title: "Réparation de la climatisation",
    description: "Réparer les systèmes de climatisation dans les salles de réunion",
    priority: "high",
    status: "en cours",
    startTime: "2025-04-10T08:00:00",
    endTime: "2025-04-10T10:00:00",
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