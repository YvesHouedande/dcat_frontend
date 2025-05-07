import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardSortieOutil from "../sorties/pages/Dashboard";
import { RetourDashboard } from "../Retour/pages/RetourDashboard";

function EntreeSortie() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des mouvements d’outils
        </h1>
        <p className="text-muted-foreground">
          Gérez toutes les sorties et les retours des outils dans le système
        </p>
      </div>
      <Tabs defaultValue="sortie" className="w-full">
        <TabsList className="flex gap-2">
          <TabsTrigger value="sortie" className="w-32">
            Sortie
          </TabsTrigger>
          <TabsTrigger value="retour" className="w-32">
            Retour
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sortie">
          <DashboardSortieOutil />
        </TabsContent>
        <TabsContent value="retour">
          <RetourDashboard/>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EntreeSortie;
