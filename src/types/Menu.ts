import { type LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];

  icon?: LucideIcon;
}
