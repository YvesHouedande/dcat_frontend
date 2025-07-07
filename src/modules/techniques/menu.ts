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
        url: "/technique/projets",
      },
      {
        title: "Documents",
        url: "/technique/document",
      },
      {
        title: "Gestion des interventions",
        url: "/technique/interventions",
      },
    ],
  },
];
