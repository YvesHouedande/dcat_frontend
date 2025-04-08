"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useMatch } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar"; // Assurez-vous d'importer useSidebar

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  // Utilisez le hook useSidebar pour obtenir l'état de la sidebar
  const { state } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>ERP/CRM</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = !!useMatch(item.url + "/*"); // Vérifie si l'URL correspond
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger
                  asChild
                  className={
                    isActive
                      ? "bg-indigo-50 text-blue-700 font-thin"
                      : "text-gray-700"
                  }
                >
                  {state === "expanded" ? (
                    <div className="flex flex-1 h-12 items-center px-4 rounded-sm ">
                      <NavLink to={item.url} className="flex w-full rounded-md">
                        {item.icon && <item.icon />}
                        <span className="text-base font-semibold ml-2">
                          {item.title}
                        </span>
                      </NavLink>
                      <ChevronRight
                        className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90`}
                      />
                    </div>
                  ) : (
                    <SidebarMenuButton tooltip={item.title}>
                      <NavLink to={item.url}>
                        {item.icon && <item.icon />}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink
                            className={({ isActive }) =>
                              isActive ? " text-blue-500" : ""
                            }
                            to={subItem.url}
                          >
                            {({ isActive }) => (
                              <span className={isActive ? "active" : ""}>
                                {isActive ? "👉" : ""}{" "}
                                {subItem.title}
                              </span>
                            )}
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
