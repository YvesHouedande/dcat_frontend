import { RetourDashboard } from "../Retour/pages/RetourDashboard";

function Retour() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des retours des outils
        </h1>
        <p className="text-muted-foreground">
          Gérez toutes les retours des outils dans le système
        </p>
      </div>
      <RetourDashboard/>
    </div>
  );
}

export default Retour;
