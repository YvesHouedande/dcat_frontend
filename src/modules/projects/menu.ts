import { MenuItem } from "@/types/Menu";
import { Cog } from "lucide-react";


export const projetsMenu: MenuItem[] = [
  {
    title: "Gestion de projet",
    url: "/projects",
    icon: Cog,
    isActive: false,
    items: [
      {
        title: "projets",
        url: "/projects/Projets",
      },
      {
        title: "Missions",
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
