import { MenuItem } from "@/types/Menu";
import { LayoutDashboard } from "lucide-react";

export const accountingMenu: MenuItem[] = [
  {
    title: "Comptabilité",
    url: "/dashboard",
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
