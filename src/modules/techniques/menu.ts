import { MenuItem } from "@/types/Menu";
import { Cog } from "lucide-react";


export const TechniqueMenu: MenuItem[] = [
  {
    title: "Technique",
    url: "/technique",
    icon: Cog,
    isActive: false,
    items: [
      {
        title: "Gestion des projets",
        url: "/projects/Projets",
      },
      {
        title: "Gestion des interventions",
        url: "/projects/Missions",
      },
      {
        title: "Gestion des tâches",
        url: "/projects/Taches",
      },
      {
        title: "Documents",
        url: "/projects/Documents",
      },
      {
        title: "rapports et suivi",
        url: "/projects/Rapports",
      },
    ],
  },
];
