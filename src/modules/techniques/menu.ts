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
        title: "Gestion des interventions",
        url: "/technique/intervention",
      },
      {
        title: "Gestion des tâches",
        url: "/technique/Taches",
      },
      {
        title: "Documents",
        url: "/technique/Documents",
      },
      {
        title: "rapports",
        url: "/technique/Rapports",
      },
    ],
  },
];
