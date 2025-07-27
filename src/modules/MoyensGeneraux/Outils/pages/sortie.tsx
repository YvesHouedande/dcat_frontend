
import DashboardSortieOutil from "../sorties/pages/Dashboard";

function Sortie() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des sorties des outils
        </h1>
        <p className="text-muted-foreground">
          Gérez toutes les sorties  des outils dans le système
        </p>
      </div>
      <DashboardSortieOutil/>
    </div>
  )
}

export default Sortie
