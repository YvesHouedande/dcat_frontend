// src/techniques/projects/documents/pages/DocumentDetail.tsx
import { useParams } from "react-router-dom";
import { useDocuments } from "../hooks/useDocuments";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, Download, File } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "../../components/gestions/StatusBadge";
import { useProjects } from "../../projet/hooks/useProjects";
import Layout from "@/components/Layout";

export const DocumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { documents, error } = useDocuments();
  const { projects } = useProjects();

  if (error) return <div>Erreur: {error}</div>;

  const document = documents.find(d => d.Id_documents?.toString() === id);
  if (!document || !document.Id_documents) return <div>Document non trouvé</div>;

  const project = document.id_projet 
    ? projects.find(p => p.id_projet === document.id_projet)
    : null;

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'contrat': return <File className="h-8 w-8 text-blue-500" />;
      case 'facture': return <File className="h-8 w-8 text-green-500" />;
      case 'rapport': return <File className="h-8 w-8 text-purple-500" />;
      case 'plan': return <File className="h-8 w-8 text-orange-500" />;
      default: return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/documents">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{document.libele_document}</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getFileIcon(document.classification_document)}
                  <CardTitle>Détails du document</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground">Type</h3>
                    <p className="text-sm mt-1 capitalize">
                      {document.classification_document}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Statut</h3>
                    <div className="mt-1">
                      <StatusBadge status={document.etat_document} />
                    </div>
                  </div>
                  {document.version && (
                    <div>
                      <h3 className="text-sm text-muted-foreground">Version</h3>
                      <p className="text-sm mt-1">{document.version}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm text-muted-foreground">Projet</h3>
                    <p className="text-sm mt-1">
                      {project ? (
                        <Link 
                          to={`/Projets/${project.id_projet}`}
                          className="hover:underline"
                        >
                          {project.nom_projet}
                        </Link>
                      ) : (
                        'Non associé'
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Créé le</h3>
                    <p className="text-sm mt-1">
                      {document.date_creation ? 
                        new Date(document.date_creation).toLocaleDateString() : 
                        '-'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Créateur</h3>
                    <p className="text-sm mt-1">
                      {document.createur || 'Non spécifié'}
                    </p>
                  </div>
                </div>
                
                {document.description && (
                  <div>
                    <h3 className="text-sm text-muted-foreground">Description</h3>
                    <p className="text-sm mt-1 whitespace-pre-line">
                      {document.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prévisualisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-8 text-center bg-gray-50">
                  <p className="text-muted-foreground">
                    Aperçu du document non disponible
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {document.libele_document}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" asChild>
                  <a 
                    href={`/api/documents/${document.Id_documents}/download`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/technique/documents/${document.Id_documents}/modifier`}>
                    Éditer le document
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Générer un PDF
                </Button>
                <Button variant="outline" className="w-full">
                  Partager
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};