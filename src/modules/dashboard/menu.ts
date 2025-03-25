import { MenuItem } from '@/types/Menu';
import { HiArchiveBox } from "react-icons/hi2";


export const dashboardMenu: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: HiArchiveBox , 
    subMenu: [
      { title: 'recette', path: '/dashboard/recette', icon: HiArchiveBox  },
      { title: 'another', path: '/dashboard/another', icon: HiArchiveBox  },
    ],
  },
];