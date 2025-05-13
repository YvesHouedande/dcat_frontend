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
        title: "outils",
        url: "/moyens-generaux/outils",
      },
      {
        title: "soties/retour outils",
        url: "/moyens-generaux/outils/sorties",
      },
      {
        title: "Equipements et moyens de travail",
        url: "/moyens-generaux/Equipements-moyens-travail",
      },
      {
        title: "Maitenance et entretients",
        url: "/moyens-generaux/maitenance-entretients",
      },
    ],
  },
];
