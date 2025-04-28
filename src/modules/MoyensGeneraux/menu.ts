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
        url: "/moyens-generaux/equipement-outils",
      },
      {
        title: "Gestion exemplaires",
        url: "/moyens-generaux/equipement-outils/examplaires",
      },
      {
        title: "Maitenance et entretients",
        url: "/moyens-generaux/maitenance-entretients",
      },
      
      {
        title: "Historique",
        url: "/moyens-generaux/historique",
      },
    ],
  },
];
