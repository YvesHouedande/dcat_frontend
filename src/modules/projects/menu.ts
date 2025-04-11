import { MenuItem } from "@/types/Menu";
import { Cog } from "lucide-react";

<<<<<<< HEAD
export const projetsMenu: MenuItem[] = [
  {
    title: "Gestion de projet",
    url: "/projets",
=======

export const projetsMenu: MenuItem[] = [
  {
    title: "Gestion de projet",
    url: "/projects",
>>>>>>> 9ef29a9 (jjk)
    icon: Cog,
    isActive: false,
    items: [
      {
        title: "projets",
        url: "/projects/Projets",
      },
      {
        title: "Missions",
<<<<<<< HEAD
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
=======
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
>>>>>>> 9ef29a9 (jjk)
      },
    ],
  },
];
