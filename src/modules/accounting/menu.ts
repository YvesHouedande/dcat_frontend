import { MenuItem } from "@/types/Menu";
import { PiggyBank } from "lucide-react";

export const accountingMenu: MenuItem[] = [
  {
    title: "Finance-Compta...",
    url: "/accounting",
    icon: PiggyBank,
    isActive: false,
    items: [
      {
        title: "Finance",
        url: "/accounting/recette",
      },
      {
        title: "Comptabilité",
        url: "/accouting/comptabilite",
      },
    ],
  },
];
