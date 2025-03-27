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
