import { MenuItem } from "@/types/Menu";
import { LayoutDashboard } from "lucide-react";

export const dashboardMenu: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "recette",
        url: "/dashboard/recette",
      },
      {
        title: "another",
        url: "/dashboard/another",
      },
    ],
  },
];
