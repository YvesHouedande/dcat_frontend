import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "./app-sidebar";
import DynamicBreadcrumb from "./DynamicBreadcrumb";
import SearchBar from "./searchBar";
import Notification from "./notification";

const StableHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 lg:h-28 border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear  group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 w-full  min-h-[4rem] lg:min-h-[7rem] ">
          <div className="flex items-center gap-2 px-4 w-full py-2">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <div className="flex-1 flex-col w-full">
              <div className="flex w-full space-x-4 px-2 items-center">
                <SearchBar />
                <Notification />
              </div>

              <DynamicBreadcrumb />
            </div>
          </div>
        </header>
        <div className="flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StableHeader;
