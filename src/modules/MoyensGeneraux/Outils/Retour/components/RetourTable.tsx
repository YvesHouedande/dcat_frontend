import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { RetourSchemaFormsValue } from "../types";
import { idSotieOutils } from "../../sorties/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronRight,
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ExemplaireRetourTableProps {
  exemplairesRetour: RetourSchemaFormsValue[];
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
  onEdit: (sortie: RetourSchemaFormsValue) => void;
  onDelete: (id: idSotieOutils) => void;
}
function RetourTable({
  exemplairesRetour,
  searchTerm,
  pagination,
  loading,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
}: ExemplaireRetourTableProps) {
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
      </div>
      <Table>
        <TableHeader>
          <TableRow className="table-fixed">
            <TableHead>Outils</TableHead>
            <TableHead>Date de retour</TableHead>
            <TableHead>Etat avant</TableHead>
            <TableHead>Personne</TableHead>
            <TableHead>etat apres</TableHead>
            <TableHead>Commentaire</TableHead>
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
          ) : exemplairesRetour.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Aucun Retour trouvé.
              </TableCell>
            </TableRow>
          ) : (
            exemplairesRetour.map((retour, key) => (
              <TableRow key={key}>
                <TableCell className="whitespace-nowrap">
                  {retour.id_exemplaire}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {retour.date_de_retour}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {retour.etat_apres}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <button className="text-blue-600 hover:underline cursor-pointer hover:text-blue-800 flex items-center gap-1">
                    {retour.id_employes}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {retour.etat_apres}
                </TableCell>
                <TableCell className="max-w-[150px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate">{retour.commentaire}</div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{retour.commentaire}</p>
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
                      <DropdownMenuItem onClick={() => onEdit(retour)}>
                        <Edit className="mr-2 h-4 w-4" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onDelete({
                            id_employes: retour.id_employes,
                            id_exemplaire: retour.id_exemplaire,
                            date_de_retour: retour.date_de_retour,
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Affichage de {exemplairesRetour.length} sur {pagination.total} sorties
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

export default RetourTable;
