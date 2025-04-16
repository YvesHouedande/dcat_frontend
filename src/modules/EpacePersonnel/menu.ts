import { MenuItem } from "@/types/Menu";
import { PiggyBank } from "lucide-react";

export const EspacePersonnelMenu: MenuItem[] = [
  {
    title: "Espace Personnel",
    url: "/Espace-Personnel",
    icon: PiggyBank,
    isActive: false,
    items: [
      {
        title: "Finance",
        url: "/COMPTABILITE/finance",
      },
      {
        title: "Comptabilité",
        url: "/COMPTABILITE/comptabilite",
      },
    ],
  },
];
