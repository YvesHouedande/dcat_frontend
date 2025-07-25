import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Props du header opération
export type OperationHeaderProps = {
  onAddOperation: () => void;
};

export const OperationHeader = ({ onAddOperation }: OperationHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Gestion des Opérations</h1>
      <Button onClick={onAddOperation}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nouvelle opération
      </Button>
    </div>
  );
}; 