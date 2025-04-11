import { MenuItem } from "@/types/Menu";
import { ScanText } from "lucide-react";

export const interventionsMenu: MenuItem[] = [
  {
<<<<<<< HEAD
    title: "maintenance",
=======
    title: "Interventions",
>>>>>>> 9ef29a9 (jjk)
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
