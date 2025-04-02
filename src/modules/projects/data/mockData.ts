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