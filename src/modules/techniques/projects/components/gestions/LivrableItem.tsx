// src/techniques/projects/components/LivrableItem.tsx
import { Livrable } from "../../types/types";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { FileText, MoreHorizontal, Calendar, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type LivrableItemProps = {
  livrable: Livrable;
  className?: string;
  onStatusChange?: (id: number, newStatus: Livrable['Approbation']) => void;
};

export const LivrableItem = ({ livrable, className }: LivrableItemProps) => {
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow",
      className
    )}>
      <div className="p-3 rounded-full bg-blue-50 text-blue-600">
        <FileText className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">
          {livrable.titre || `Livrable #${livrable.Id_Livrable}`}
          {livrable.version && (
            <span className="text-sm text-muted-foreground ml-2">
              v{livrable.version}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <StatusBadge status={livrable.Approbation} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {livrable.createur && (
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{livrable.createur}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(livrable.Date_), 'dd MMM yyyy', { locale: fr })}
          </span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Éditer</DropdownMenuItem>
          <DropdownMenuItem>Télécharger</DropdownMenuItem>
          <DropdownMenuItem className="text-green-600">Approuver</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Rejeter</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};