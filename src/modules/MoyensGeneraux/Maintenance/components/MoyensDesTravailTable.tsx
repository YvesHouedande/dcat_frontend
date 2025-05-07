import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Plus } from "lucide-react";
import { getMoyensDesTravailColumns } from "./columns";
import { MoyensDesTravailDialog } from "./MoyensDesTravailDialog";
import { MoyensDesTravailFilter } from "./MoyensDesTravailFilter";
import { 
  MoyenDeTravail, 
  MoyenDeTravailFormData, 
  MoyensFilters 
} from "../types/moyens-de-travail.types";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MoyensDesTravailTableProps {
  moyens: MoyenDeTravail[];
  sections: string[];
  filters: MoyensFilters;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isSubmitting: boolean;
  updateFilters: (filters: Partial<MoyensFilters>) => void;
  createMoyen: (data: MoyenDeTravailFormData) => void;
  updateMoyen: (params: { id: number; data: MoyenDeTravailFormData }) => void;
  deleteMoyen: (id: number) => void;
}

export function MoyensDesTravailTable({
  moyens,
  sections,
  filters,
  pagination,
  isLoading,
  isError,
  error,
  isSubmitting,
  updateFilters,
  createMoyen,
  updateMoyen,
  deleteMoyen,
}: MoyensDesTravailTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMoyen, setSelectedMoyen] = useState<MoyenDeTravail | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleEdit = (moyen: MoyenDeTravail) => {
    setSelectedMoyen(moyen);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMoyen(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleSubmit = (data: MoyenDeTravailFormData) => {
    if (selectedMoyen) {
      updateMoyen({
        id: selectedMoyen.id_moyens_de_travail,
        data,
      });
    } else {
      createMoyen(data);
    }
    
    if (!isSubmitting) {
      setDialogOpen(false);
      setSelectedMoyen(undefined);
    }
  };

  const handleOpenDialog = () => {
    setSelectedMoyen(undefined);
    setDialogOpen(true);
  };

  const columns = getMoyensDesTravailColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const table = useReactTable({
    data: moyens,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Générer un tableau de pages à afficher autour de la page courante
  const getPaginationRange = () => {
    const { page, totalPages } = pagination;
    const delta = 2; // Nombre de pages à afficher de chaque côté
    
    let range = [];
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    // Ajouter les ellipses si nécessaire
    if (page - delta > 2) range.unshift("...");
    if (page + delta < totalPages - 1) range.push("...");
    
    // Ajouter toujours la première et la dernière page
    if (totalPages > 1) {
      range.unshift(1);
      if (totalPages > 1) range.push(totalPages);
    }
    
    return range;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Moyens de Travail</h2>
        <Button variant={"blue"} onClick={handleOpenDialog}>
          <Plus  className="h-4 w-4 mr-2" /> Ajouter
        </Button>
      </div>
      
      <MoyensDesTravailFilter 
        filters={filters} 
        sections={sections} 
        onFiltersChange={updateFilters} 
      />

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Une erreur est survenue: {(error as Error)?.message || "Impossible de charger les données"}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2 text-sm text-muted-foreground">Chargement des données...</p>
                    </TableCell>
                  </TableRow>
                ) : moyens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Aucun résultat trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Affichage de la pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Affichage de {(pagination.page - 1) * pagination.limit + 1} à{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total} entrées
              </p>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.page > 1) {
                            updateFilters({ page: pagination.page - 1 });
                        }
                      }}
                      className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {getPaginationRange().map((pageNumber, i) => (
                    <PaginationItem key={i}>
                      {pageNumber === "..." ? (
                        <span className="px-4 py-2">...</span>
                      ) : (
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            updateFilters({ page: pageNumber as number });
                          }}
                          isActive={pageNumber === pagination.page}
                        >
                          {pageNumber}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.page < pagination.totalPages) {
                          updateFilters({ page: pagination.page + 1 });
                        }
                      }}
                      className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      <MoyensDesTravailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        moyen={selectedMoyen}
        onSubmit={handleSubmit}
        sections={sections}
        isSubmitting={isSubmitting}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce moyen de travail ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

