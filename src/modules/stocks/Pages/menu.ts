import { MenuItem } from '@/types/Menu';
import { SquareTerminal } from 'lucide-react';


export const stocksMenu: MenuItem[] = [
  {
    title: "Stockage",
    url: "/stock",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "recette",
        url: "/stock/recette",
      },
      {
        title: "another",
        url: "/stock/anothe",
      },
    ],
  },
];

