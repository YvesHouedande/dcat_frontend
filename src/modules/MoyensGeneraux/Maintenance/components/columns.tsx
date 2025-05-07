import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoyenDeTravail } from "../types/moyens-de-travail.types";
import { formatDate } from "../utils/format";

interface MoyensDesTravailColumnsProps {
  onEdit: (moyen: MoyenDeTravail) => void;
  onDelete: (id: number) => void;
}

export const getMoyensDesTravailColumns = ({
  onEdit,
  onDelete,
}: MoyensDesTravailColumnsProps): ColumnDef<MoyenDeTravail>[] => [
  {
    accessorKey: "id_moyens_de_travail",
    header: "ID",
    cell: ({ row }) => <span className="font-medium">#{row.getValue("id_moyens_de_travail")}</span>,
  },
  {
    accessorKey: "denomination",
    header: "Dénomination",
    cell: ({ row }) => <div className="font-medium">{row.getValue("denomination")}</div>,
  },
  {
    accessorKey: "date_acquisition",
    header: "Date d'acquisition",
    cell: ({ row }) => formatDate(row.getValue("date_acquisition")),
  },
  {
    accessorKey: "section",
    header: "Section",
    cell: ({ row }) => <div className="capitalize">{row.getValue("section")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const moyen = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(moyen)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={() => onDelete(moyen.id_moyens_de_travail)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
