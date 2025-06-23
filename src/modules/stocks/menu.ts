import { MenuItem } from '@/types/Menu';
import { Package} from 'lucide-react';


export const stocksMenu: MenuItem[] = [
  {
    title: "Gestion ds stocks",
    url: "/stocks",
    icon: Package,
    isActive: false,
    items: [
      {
        title: "produits",
        url: "/stocks/references",
      },
      {
        title: "achats",
        url: "/stocks/achats",
      },
      {
        title: "exemplaires",
        url: "/stocks/exemplaires",
      },
      {
        title: "commandes",
        url: "/stocks/commandes",
      },
      {
        title: "sorties",
        url: "/stocks/sorties",
      },
    ],
  },
];

