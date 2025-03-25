import { MenuItem } from '@/types/Menu';

import { HiArchiveBox } from "react-icons/hi2";


export const accountingMenu: MenuItem[] = [
  {
    title: 'Comptabilité',
    path: '#',
    icon: HiArchiveBox , 
    subMenu: [
      { title: 'recette', path: '/accounting/recette', icon: HiArchiveBox  },
      { title: 'Argent', path: '/accounting/argent', icon: HiArchiveBox  },
    ],
  },
];