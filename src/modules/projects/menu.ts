import { MenuItem } from "@/types/Menu";
import { Cog,} from "lucide-react";


export const projetsMenu: MenuItem[] = [
  {
    title: "Gestion de projet",
    url: "/projets",
    icon: Cog,
    isActive:false,
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
