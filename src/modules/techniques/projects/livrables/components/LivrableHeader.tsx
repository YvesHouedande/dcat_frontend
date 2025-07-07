// src/components/projets/ProjetHeader.tsx
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

type LivrableHeaderProps = {
  onAddLivrable: () => void;
};

export const LivrableHeader = ({ onAddLivrable }: LivrableHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Gestion des Livrables</h1>
      <Button onClick={onAddLivrable}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nouveau livrable
      </Button>
    </div>
  );
};

