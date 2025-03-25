import React from "react";

export interface MenuItem {
  title: string;
  path: string;
  icon?: React.ElementType;
  subMenu?: MenuItem[];
}