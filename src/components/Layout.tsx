import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import DynamicBreadcrumb from "./DynamicBreadcrumb";
// import SearchBar from "./searchBar";
// import Notification from "./notification";
import { Toaster } from "@/components/ui/sonner";
import { Link } from "react-router-dom";
// import Homme from "./home";

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
    <div className="min-h-screen bg-background">
      <header className="flex h-16 lg:h-28 border-b shrink-0 items-center gap-2 w-full min-h-[4rem] lg:min-h-[7rem] sticky top-0 z-10 bg-background">
        <div className="flex items-center gap-2 px-4 w-full py-2">
          <div className="flex-1 flex-col w-full">
            <div className="flex w-full space-x-4 px-2 items-center">
              {/* <SearchBar />
              <Notification />
              <Homme /> */}
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="logo" className="w-20 h-20" />
                <span className="text-2xl font-bold">Gestion DCAT</span>
              </Link>
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
          <div className="flex-col gap-4 p-4 pt-0 h-[calc(100vh-7rem)]">
            {children}
            <Toaster richColors />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Layout;
