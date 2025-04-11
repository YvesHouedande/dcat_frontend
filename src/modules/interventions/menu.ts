import { MenuItem } from "@/types/Menu";
import { ScanText } from "lucide-react";

export const interventionsMenu: MenuItem[] = [
  {
    title: "Interventions",
    url: "/interventions",
    icon: ScanText,
    isActive: false,
    items: [
      {
        title: "Nouvelle intervention",
        url: "/interventions/nouvelle_intervention",
      },
      {
        title: "historique",
        url: "/interventions/historique",
      },
    ],
  },
];
