import { MenuItem } from "@/types/Menu";
import { Cog } from "lucide-react";

export const projetsMenu: MenuItem[] = [
  {
    title: "Gestion de projet",
    url: "/projets",
    icon: Cog,
    isActive: false,
    items: [
      {
        title: "projets",
        url: "/projects/Projets",
      },
      {
        title: "Missions",
        url: "/projects/mission",
      },
      {
        title: "Gestion des tâches",
        url: "/projects/tache",
      },
      {
        title: "Documents",
        url: "/projects/documents",
      },
      {
        title: "rapports et suivi",
        url: "/projects/rapport",
      },
      {
        title: "paramètre du module",
        url: "/projects/parametre",
      },
    ],
  },
];
