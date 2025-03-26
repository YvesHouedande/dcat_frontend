import { type LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  isActive?: true;
  items: {
    title: string;
    url: string;
  }[];

  icon?: LucideIcon;
}
