import EntreeDashboard from "@/modules/stocks/entree/pages/Dashboard";

function Entree() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des entrées des outils
        </h1>
        <p className="text-muted-foreground">
          Gérez toutes les entrées des outils dans le système
        </p>
      </div>
      <EntreeDashboard/>
    </div>
  );
}

export default Entree;
