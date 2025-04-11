import { MenuItem } from "@/types/Menu";
import { LayoutDashboard } from "lucide-react";

export const dashboardMenu: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    isActive: false,
    items: [],
  },
];
