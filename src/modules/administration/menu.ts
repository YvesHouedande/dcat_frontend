import { MenuItem } from "@/types/Menu";
import { LayoutDashboard } from "lucide-react";
export const administrationMenu: MenuItem[] = [
  {
    title: "Administration",
    url: "/administrations",
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
