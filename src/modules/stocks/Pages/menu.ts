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
        title: "produits",
        url: "/stock/produits",
      },
      {
        title: "another",
        url: "/stock/anothe",
      },
    ],
  },
];

