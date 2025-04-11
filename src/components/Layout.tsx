import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppSidebar } from "./app-sidebar";
import DynamicBreadcrumb from "./DynamicBreadcrumb";
import SearchBar from "./searchBar";
import Notification from "./notification";
import { Toaster } from "@/components/ui/sonner"

const Layout = ({
  children,
  autre: AnotherComponent,
}: {
  children: React.ReactNode;
  autre?: React.ReactElement | (() => React.ReactElement);
}) => {
  // Fonction pour rendre le composant conditionnel
  const renderAnotherComponent = () => {
    if (!AnotherComponent) return null;

    // Si c'est une fonction, l'appeler
    if (typeof AnotherComponent === "function") {
      return AnotherComponent();
    }

    // Si c'est déjà un élément React, le retourner directement
    return AnotherComponent;
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 lg:h-28 border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 w-full min-h-[4rem] lg:min-h-[7rem] sticky top-0 z-10 bg-background">
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
              <div className="flex flex-1 justify-between items-center">
                <DynamicBreadcrumb />
                {/* Condition améliorée pour le rendu conditionnel */}
                {AnotherComponent && (
                  <nav className="flex items-center max-lg:hidden">
                    {renderAnotherComponent()}
                  </nav>
                )}
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 h-[calc(100vh-7rem)] lg:h-[calc(100vh-7rem)]">
          <ScrollArea className="h-full w-full">
            <div className="flex-col gap-4 p-4 pt-0">
              {children}
              <Toaster />
            </div>
          </ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;