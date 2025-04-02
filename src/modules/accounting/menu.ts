import { MenuItem } from "@/types/Menu";
import { PiggyBank } from "lucide-react";

export const accountingMenu: MenuItem[] = [
  {
    title: "Finance-Compta...",
    url: "/COMPTABILITE",
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
