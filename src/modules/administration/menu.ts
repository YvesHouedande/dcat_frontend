import { MenuItem } from "@/types/Menu";
import { LayoutDashboard } from "lucide-react";
import { UserCog } from "lucide-react";

export const administrationMenu: MenuItem[] = [
  {
    title: "Administration",
    url: "/administration",
    icon: UserCog,
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
