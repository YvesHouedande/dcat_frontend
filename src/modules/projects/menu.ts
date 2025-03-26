import { MenuItem } from "@/types/Menu";
import { LayoutDashboard } from "lucide-react";

export const projetsMenu: MenuItem[] = [
  {
    title: "Projets",
    url: "#",
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
