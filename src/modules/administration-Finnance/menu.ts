import { MenuItem } from "@/types/Menu";
import { UserCog } from "lucide-react";

export const administrationFinanceMenu: MenuItem[] = [
  {
    title: "Administration & Finnance",
    url: "/administration",
    icon: UserCog,
    isActive: false,
    items: [
      {
        title: "Ressources Humaines",
        url: "/administration/employers",
      },
      {
        title: "Gestion administrative",
        url: "/administration/partenaires",
      },
      
      {
        title: "Comptabilité",
        url: "/administration/documents",
      },
      
      {
        title: "Finances",
        url: "/administration/demandes",
      },
      {
        title: "demandes",
        url: "/administration/demandes",
      },
      {
        title: "contrats",
        url: "/administration/contrats",
      },
      
      {
        title: "documents",
        url: "/administration/documents",
      },
    ],
  },
];
