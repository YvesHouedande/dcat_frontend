import { MenuItem } from "@/types/Menu";
import { LayoutDashboard } from "lucide-react";

export const interventionsMenu: MenuItem[] = [
  {
    title: "Interventions",
    url: "/interventions",
    icon: LayoutDashboard,
    isActive: true,
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
