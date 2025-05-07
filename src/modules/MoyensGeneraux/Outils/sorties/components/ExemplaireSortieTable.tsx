// src/components/dashboard/ExemplaireSortieTable.tsx
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
  ChevronRight,
  Undo2,
} from "lucide-react";
import { ExemplaireSortieFormValues, idSotieOutils } from "../types";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExemplaireSortieTableProps {
  exemplaireSorties: ExemplaireSortieFormValues[];
  searchTerm: string;
  pagination: {
    page: number;
    totalPages: number;
    pageSize: number;
    total: number;
  };
  loading: boolean;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onEdit: (sortie: ExemplaireSortieFormValues) => void;
  onDelete: (id: idSotieOutils) => void;
  onAdd: () => void;
  onRetrun: (sortie: ExemplaireSortieFormValues)=>void;
}

export function ExemplaireSortieTable({
  exemplaireSorties,
  searchTerm,
  pagination,
  loading,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
  onAdd,
  onRetrun,
}: ExemplaireSortieTableProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher..."
            value={localSearchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </form>
        <Button onClick={onAdd} variant={"blue"} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une sortie
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">
                  {" "}
                  Nom de l'outil
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  Date de sortie
                </TableHead>
                <TableHead className="whitespace-nowrap">Motif</TableHead>
                <TableHead className="whitespace-nowrap">Employé</TableHead>
                <TableHead className="whitespace-nowrap">
                  {" "}
                  Site d'utilisation{" "}
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  {" "}
                  Etat du matériel{" "}
                </TableHead>
                <TableHead className="w-[80px] whitespace-nowrap">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : exemplaireSorties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Aucune sortie trouvée
                  </TableCell>
                </TableRow>
              ) : (
                exemplaireSorties.map((sortie, key) => (
                  <TableRow key={key}>
                    <TableCell className="whitespace-nowrap">
                      {sortie.id_exemplaire}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {sortie.date_de_sortie}
                    </TableCell>
                    <TableCell className="max-w-[150px]">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="truncate">{sortie.but_usage}</div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{sortie.but_usage}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <button className="text-blue-600 hover:underline cursor-pointer hover:text-blue-800 flex items-center gap-1">
                        {sortie.id_employes}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </TableCell>
                    <TableCell className="max-w-[150px]">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="truncate">
                              {sortie.site_intervention}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{sortie.site_intervention}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {sortie.etat_avant}
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
                          <DropdownMenuItem onClick={() => onEdit(sortie)}>
                            <Edit className="mr-2 h-4 w-4" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onRetrun(sortie)} >
                            <Undo2 className="mr-2 h-4 w-4"  /> Retourner
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onDelete({
                                id_employes: sortie.id_employes,
                                id_exemplaire: sortie.id_exemplaire,
                                date_de_sortie: sortie.date_de_sortie,
                              })
                            }
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
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Affichage de {exemplaireSorties.length} sur {pagination.total} sorties
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
          >
            Précédent
          </Button>
          <div className="text-sm">
            Page {pagination.page} sur {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages || loading}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
