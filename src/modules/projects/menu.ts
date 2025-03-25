import { MenuItem } from '@/types/Menu';
import { HiArchiveBox } from "react-icons/hi2";


export const projetsMenu: MenuItem[] = [
  {
    title: 'Projets',
      path: '#',
    icon: HiArchiveBox , 
    subMenu: [
      { title: 'en cours', path: '/projets/cours', icon: HiArchiveBox  },
      { title: 'termines', path: '/projets/termines', icon: HiArchiveBox  },
    ],
  },
];