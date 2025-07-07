// src/components/projets/ProjetHeader.tsx
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

type ProjetHeaderProps = {
  onAddProject: () => void;
};

export const ProjetHeader = ({ onAddProject }: ProjetHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <Button onClick={onAddProject}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nouveau Projet
      </Button>
    </div>
  );
};