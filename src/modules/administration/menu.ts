import { HiArchiveBox } from "react-icons/hi2";
import { MenuItem } from "@/types/Menu";
export const administrationMenu : MenuItem[]  = [
  {
    title: 'Administration',
    path: '/administrations',
    icon: HiArchiveBox ,  // Use as JSX element
    subMenu: [
      { title: 'personnel', path: '/personnel/example', icon: HiArchiveBox },
      { title: 'conges', path: '/conges/example', icon: HiArchiveBox },
    ],
  },
]; 