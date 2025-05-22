import { MenuItem } from "@/types/Menu";
import { UserCog } from "lucide-react";

export const administrationFinanceMenu: MenuItem[] = [
  
  {
    title: "Administration & Finance",
    url: "/administration",
    icon: UserCog,
    isActive: false,
    items: [
      
      {
        title: "Gestion des partenaires",
        url: "/administration/partenaires",
      },
      {
        title: "Gestion des employés",
        url: "/administration/employers",
      },
      {
        title: "Demandes",
        url: "/administration/demandes",
      },
      {
        title: "Contrats",
        url: "/administration/contrats",
      },
      {
        title: "Comptabilité",
        url: "/administration/comptabilite",
      },
      {
        title: "Finances",
        url: "/administration/finance",
      },
      {
        title: "Documents",
        url: "/administration/documents",
      }
    ],
  },
];