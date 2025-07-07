// src/components/tables/ExemplaireProduitTable.tsx
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Search,
  Edit,
  Trash2,
  Plus,
  Undo2,
  ArrowLeftFromLine,
} from "lucide-react";
import { ExemplaireProduit } from "../types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExemplaireProduitTableProps {
  ExemplaireProduits: ExemplaireProduit[];
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onEdit: (instance: ExemplaireProduit) => void;
  onDelete: (id: string | number) => void;
  onAdd: () => void;
  onOut: (instance: ExemplaireProduit) => void;
  onReturn: (instance: ExemplaireProduit) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  loading: boolean;
}

export function ExemplaireOutilsTable({
  ExemplaireProduits,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
  onAdd,
  onOut,
  onReturn,
  currentPage,
  totalPages,
  total,
  loading,
}: ExemplaireProduitTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full max-sm:w-64"
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </form>
        <Button onClick={onAdd} variant={"blue"} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-" /> Ajouter un exemplaire d'outil
        </Button>
      </div>

      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[200px] font-semibold">
                N° Série
              </TableHead>
              <TableHead className="w-[120px] font-semibold">
                Date d'entrée
              </TableHead>
              <TableHead className="w-[120px] font-semibold">État</TableHead>
              <TableHead className="font-semibold">Commentaire</TableHead>
              <TableHead className="w-[80px] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : ExemplaireProduits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Aucun exemplaire trouvé
                </TableCell>
              </TableRow>
            ) : (
              ExemplaireProduits.map((instance) => (
                <TableRow key={instance.id_exemplaire}>
                  <TableCell>{instance.num_serie}</TableCell>
                  <TableCell>{instance.date_entree}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        instance.etat_vente === "vendu"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {instance.etat_vente}
                    </span>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="truncate max-w-full  hover:text-blue-600">
                            {instance.commentaire || "Pas de commentaire"}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md p-2 text-black bg-white border border-gray-200 shadow-lg rounded-md text-sm">
                          {instance.commentaire || "Pas de commentaire"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(instance)}>
                          <Edit className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOut(instance)}>
                          <ArrowLeftFromLine className="mr-2 h-4 w-4" /> Sortir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReturn(instance)}>
                          <Undo2 className="mr-2 h-4 w-4" /> Retourner
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(instance.id_exemplaire)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Affichage de {ExemplaireProduits.length} sur {total} exemplaires
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
          >
            Précédent
          </Button>
          <div className="text-sm">
            Page {currentPage} sur {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
