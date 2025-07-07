import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

type TacheHeaderProps = {
  onAddTask: () => void; // Fonction appelée quand on clique sur "Nouvelle Tâche"
};

export const TacheHeader = ({ onAddTask }: TacheHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Gestion des Tâches</h1>
      <Button onClick={onAddTask}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nouvelle Tâche
      </Button>
    </div>
  );
};
