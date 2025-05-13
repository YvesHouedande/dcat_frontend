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
import { Maintenance } from "../types/maitenance.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MoyensDesTravailColumnsProps {
  onEdit: (maintenance: Maintenance) => void;
  onDelete: (id: number) => void;
}

export const getMoyensDesTravailColumns = ({
  onEdit,
  onDelete,
}: MoyensDesTravailColumnsProps): ColumnDef<Maintenance>[] => [
  {
    accessorKey: "type_maintenance",
    header: "Type maintenance",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("type_maintenance")}</div>
    ),
  },
  {
    accessorKey: "operations",
    header: "Operations",
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate max-w-full hover:text-blue-600">
                {row.getValue("operations")}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-md p-2 text-black bg-white border border-gray-200 shadow-lg rounded-md text-sm">
              {row.getValue("operations")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "id_exemplaire_produit",
    header: "Equipement",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id_exemplaire_produit")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div className="capitalize">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "id_section",
    header: "Section",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id_section")}</div>
    ),
  },
  {
    accessorKey: "id_intervenants",
    header: "Intervenants",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id_intervenants")}</div>
    ),
  },
  {
    accessorKey: "autre_intervenant",
    header: "Autre intervenant",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("autre_intervenant")}</div>
    ),
  },
  {
    accessorKey: "id_partenaire",
    header: "Partenaire",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id_partenaire")}</div>
    ),
  },
  {
    accessorKey: "recommandations",
    header: "Recommandations",
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate max-w-full hover:text-blue-600">
                {row.getValue("recommandations")}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-md p-2 text-black bg-white border border-gray-200 shadow-lg rounded-md text-sm">
              {row.getValue("recommandations")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
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
              onClick={() => onDelete(Number(moyen.id_maintenance))}
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
