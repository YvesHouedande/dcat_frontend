import { MenuItem } from "@/types/Menu";
import { UserCog } from "lucide-react";

export const administrationMenu: MenuItem[] = [
  {
    title: "Administration",
    url: "/administration",
    icon: UserCog,
    isActive: false,
    items: [
      {
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
      },
    ],
  },
];
