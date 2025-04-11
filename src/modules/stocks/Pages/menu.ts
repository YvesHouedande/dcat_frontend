import { MenuItem } from '@/types/Menu';
import { Package} from 'lucide-react';


export const stocksMenu: MenuItem[] = [
  {
    title: "Stockage",
    url: "/stock",
    icon: Package,
    isActive: false,
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

