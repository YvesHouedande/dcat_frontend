import { MenuItem } from '@/types/Menu';
import { HiArchiveBox } from "react-icons/hi2";


export const interventionsMenu: MenuItem[] = [
  {
    title: 'Interventions',
    path: '/interventions',
    icon: HiArchiveBox , 
    subMenu: [
      { title: 'recette', path: '/interventions/recette', icon: HiArchiveBox  },
      { title: 'Argent', path: '/interventions/argent', icon: HiArchiveBox  },
    ],
  },
];