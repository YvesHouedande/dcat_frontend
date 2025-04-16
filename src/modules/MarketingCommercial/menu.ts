import { MenuItem } from '@/types/Menu';
import { Package} from 'lucide-react';


export const MarketingCommercialMenu: MenuItem[] = [
  {
    title: "Marketing & Commercial",
    url: "/marketing",
    icon: Package,
    isActive: false,
    items: [
      {
        title: "marketing",
        url: "/stock/produits",
      },
      {
        title: "commercial",
        url: "/stock/examplaires",
      }
    ],
  },
];

