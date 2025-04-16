import { MenuItem } from "@/types/Menu";
import { PiggyBank } from "lucide-react";

export const MoyensGenerauxMenu: MenuItem[] = [
  {
    title: "Moyens Géneraux",
    url: "/moyens-generaux",
    icon: PiggyBank,
    isActive: false,
    items: [
      {
        title: "Equipement et outils",
        url: "/COMPTABILITE/finance",
      },
      {
        title: "Maitenance et entretients",
        url: "/COMPTABILITE/comptabilite",
      },
    ],
  },
];
