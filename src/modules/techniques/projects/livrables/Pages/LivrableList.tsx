// src/techniques/projects/livrables/components/LivrableList.tsx
import { Livrable } from "../../types/types";
import { LivrableItem } from "../../components/gestions/LivrableItem";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useLivrables } from "../hooks/useLivrables";
import { useProjects } from "../../projet/hooks/useProjects";
import { LivrableForm } from "../../components/forms/LivrableForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type LivrableListProps = {
  projectId?: string;
};

export const LivrableList = ({ projectId }: LivrableListProps) => {
  const { livrables, loading, error, createLivrable } = useLivrables(projectId);
  const { projects } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateLivrable = async (livrable: Omit<Livrable, 'Id_Livrable'>) => {
    try {
      await createLivrable(livrable);
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
        <h2 className="text-xl font-semibold">Livrables</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouveau livrable
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau livrable</DialogTitle>
            </DialogHeader>
            <LivrableForm 
              onSubmit={handleCreateLivrable} 
              projects={projects.map(p => ({ 
                id_projet: p.id_projet, 
                nom_projet: p.nom_projet 
              }))}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {livrables.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucun livrable trouvé
        </div>
      ) : (
        <div className="space-y-2">
          {livrables.map(livrable => (
            <LivrableItem 
              key={livrable.Id_Livrable} 
              livrable={livrable} 
            />
          ))}
        </div>
      )}
    </div>
  );
};