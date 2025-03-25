import { MenuItem } from '@/types/Menu';
import { HiArchiveBox } from "react-icons/hi2";


export const stocksMenu: MenuItem[] = [
  {
    title: 'Stockage',
    path: '/stock',
    icon: HiArchiveBox , 
    subMenu: [
      { title: 'recette', path: '/stock/recette', icon: HiArchiveBox  },
      { title: 'another', path: '/stock/another', icon: HiArchiveBox  },
    ],
  },
];