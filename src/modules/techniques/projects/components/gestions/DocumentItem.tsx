// src/techniques/projects/components/DocumentItem.tsx
import { Document } from "../../types/types";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { File, MoreHorizontal, Download, User, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type DocumentItemProps = {
  document: Document;
  className?: string;
  onStatusChange?: (id: number, newStatus: Document['etat_document']) => void;
};

export const DocumentItem = ({ document, className }: DocumentItemProps) => {
  const getFileIcon = (type: string) => {
    switch(type) {
      case 'contrat': return <File className="h-5 w-5 text-blue-500" />;
      case 'facture': return <File className="h-5 w-5 text-green-500" />;
      case 'rapport': return <File className="h-5 w-5 text-purple-500" />;
      case 'plan': return <File className="h-5 w-5 text-orange-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow",
      className
    )}>
      <div className="p-2 rounded-lg bg-gray-50">
        {getFileIcon(document.classification_document)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{document.libele_document}</h3>
        <div className="flex items-center gap-2 mt-1">
          <StatusBadge status={document.etat_document} />
          <span className="text-xs text-muted-foreground">
            {document.classification_document}
          </span>
          {document.version && (
            <span className="text-xs text-muted-foreground">
              v{document.version}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {document.createur && (
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{document.createur}</span>
          </div>
        )}
        {document.date_creation && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(document.date_creation), 'dd MMM yyyy', { locale: fr })}
            </span>
          </div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Télécharger
          </DropdownMenuItem>
          <DropdownMenuItem>Éditer</DropdownMenuItem>
          <DropdownMenuItem className="text-green-600">Valider</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Archiver</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};