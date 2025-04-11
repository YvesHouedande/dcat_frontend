import { MenuItem } from "@/types/Menu";
<<<<<<< HEAD
=======
import { LayoutDashboard } from "lucide-react";
>>>>>>> 9ef29a9 (jjk)
import { UserCog } from "lucide-react";

export const administrationMenu: MenuItem[] = [
  {
    title: "Administration",
    url: "/administration",
    icon: UserCog,
    isActive: false,
    items: [
      {
<<<<<<< HEAD
        title: "employers",
        url: "/administration/employers",
      },
      {
        title: "partenaires",
        url: "/administration/partenaires",
      },
      {
        title: "demandes",
        url: "/administration/demandes",
      },
      {
        title: "documents",
        url: "/administration/documents",
      },
      
      {
        title: "contrats",
        url: "/administration/contrats",
=======
        title: "recette",
        url: "/accounting/recette",
      },
      {
        title: "another",
        url: "/dashboard/another",
>>>>>>> 9ef29a9 (jjk)
      },
    ],
  },
];
