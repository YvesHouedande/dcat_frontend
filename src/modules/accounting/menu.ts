import { MenuItem } from "@/types/Menu";
import { PiggyBank } from "lucide-react";

export const accountingMenu: MenuItem[] = [
  {
    title: "Finnance-Compta",
    url: "/accounting",
    icon: PiggyBank,
    isActive: false,
    items: [
      {
        title: "recette",
        url: "/accounting/recette",
      },
      {
        title: "another",
        url: "/dashboard/another",
      },
    ],
  },
];
