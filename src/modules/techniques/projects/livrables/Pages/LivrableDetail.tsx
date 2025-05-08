// src/techniques/projects/livrables/pages/LivrableDetail.tsx
import { useParams } from "react-router-dom";
import { useLivrables } from "../hooks/useLivrables";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "../../components/gestions/StatusBadge";
import { useProjects } from "../../projet/hooks/useProjects";
import { FileText } from "lucide-react";
import Layout from "@/components/Layout";

export const LivrableDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { livrables, loading, error } = useLivrables();
  const { projects } = useProjects();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  const livrable = livrables.find(l => l.Id_Livrable.toString() === id);
  if (!livrable) return <div>Livrable non trouvé</div>;

  const project = projects.find(p => p.id_projet === livrable.id_projet);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/rapports">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            {livrable.titre || `Livrable #${livrable.Id_Livrable}`}
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-500" />
                  <CardTitle>Détails du livrable</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground">Statut</h3>
                    <div className="mt-1">
                      <StatusBadge status={livrable.Approbation} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Date</h3>
                    <p className="text-sm mt-1">
                      {new Date(livrable.Date_).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Version</h3>
                    <p className="text-sm mt-1">
                      {livrable.version || 'Non spécifiée'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Projet</h3>
                    <p className="text-sm mt-1">
                      <Link 
                        to={`/technique/Projet/${livrable.id_projet}`}
                        className="hover:underline"
                      >
                        {project?.nom_projet || livrable.id_projet}
                      </Link>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm text-muted-foreground">Réalisations</h3>
                  <p className="text-sm mt-1 whitespace-pre-line">
                    {livrable.Réalisations}
                  </p>
                </div>
                
                {livrable.Réserves && (
                  <div>
                    <h3 className="text-sm text-muted-foreground">Réserves</h3>
                    <p className="text-sm mt-1 whitespace-pre-line">
                      {livrable.Réserves}
                    </p>
                  </div>
                )}
                
                {livrable._Recommandation && (
                  <div>
                    <h3 className="text-sm text-muted-foreground">Recommandations</h3>
                    <p className="text-sm mt-1 whitespace-pre-line">
                      {livrable._Recommandation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/technique/rapports/${livrable.Id_Livrable}/modifier`}>
                    Éditer le livrable
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Télécharger le rapport
                </Button>
                <Button variant="outline" className="w-full">
                  Générer un PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};