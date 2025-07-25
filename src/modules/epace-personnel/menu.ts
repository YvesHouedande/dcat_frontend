import { MenuItem } from "@/types/Menu";
import { User } from "lucide-react";

export const EspacePersonnelMenu: MenuItem[] = [
  {
    title: "Espace Personnel",
    url: "/espace-personnel",
    icon: User,
    isActive: false,
    items: [
      {
        title: "Congés et asbsences",
        url: "/espace-personnel/demandes",
      },
      {
        title: "infromation entrepise",
        url: "/COMPTABILITE/comptabilite",
      },
    ],
  },
];
