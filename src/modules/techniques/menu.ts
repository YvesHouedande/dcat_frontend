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
        url: "/technique/Projets",
      },
      {
        title: "Gestion des tâches",
        url: "/technique/taches",
      },
      {
        title: "Livrables",
        url: "/technique/livrable",
      },
      {
        title: "Gestion des interventions",
        url: "/technique/intervention",
      },
    ],
  },
];
