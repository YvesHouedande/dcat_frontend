// src/techniques/projects/documents/components/DocumentList.tsx
import { Document } from "../../types/types";
import { DocumentItem } from "../../components/gestions/DocumentItem";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useDocuments } from "../hooks/useDocuments";
import { useProjects } from "../../projet/hooks/useProjects";
import { DocumentForm } from "../../components/forms/DocumentForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type DocumentListProps = {
  projectId?: string;
};

export const DocumentList = ({ projectId }: DocumentListProps) => {
  const { documents, loading, error, createDocument } = useDocuments(projectId);
  const { projects } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateDocument = async (document: Omit<Document, 'Id_documents'>) => {
    try {
      await createDocument(document);
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );

  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Documents</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouveau document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau document</DialogTitle>
            </DialogHeader>
            <DocumentForm 
              onSubmit={handleCreateDocument} 
              projects={projects.map(p => ({ 
                id_projet: p.id_projet, 
                nom_projet: p.nom_projet 
              }))}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucun document trouvé
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map(document => (
            <DocumentItem 
              key={document.Id_documents} 
              document={document} 
            />
          ))}
        </div>
      )}
    </div>
  );
};