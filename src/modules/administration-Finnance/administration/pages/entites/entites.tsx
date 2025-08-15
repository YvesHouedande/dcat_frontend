// src/components/EntitesList.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  // Search, 
  // Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Building,
  MapPin,
  Phone
} from "lucide-react";
import { useEntiteApi } from '@/modules/administration-Finnance/services/entiteService';
import { toast } from "sonner";
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

const EntitesList: React.FC = () => {
  const { fetchEntites, deleteEntite } = useEntiteApi();
  const [searchTerm] = useState("");
  const [statusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");

  // Charger les entités
  const { data: entites, isLoading, error, refetch } = useQuery({
    queryKey: ['entites'],
    queryFn: fetchEntites,
  });

  // Filtrer les entités
  const filteredEntites = entites?.filter((entite) => {
    const matchesSearch = entite.denomination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entite.abreviation_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entite.localisation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || true; // Pas de statut pour les entités pour l'instant
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredEntites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEntites = filteredEntites.slice(startIndex, endIndex);

  const handleDeleteEntite = async (id: number, denomination: string) => {
    setConfirmDeleteId(id);
    setConfirmDeleteName(denomination);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    
    try {
      const result = await deleteEntite(confirmDeleteId);
      
      if (result.success) {
        toast.success(result.message);
        refetch();
      } else {
        // Afficher un message d'information bleu au lieu d'une erreur rouge
        toast.info(result.message, {
          duration: 6000, // Durée plus longue pour permettre la lecture
          description: "Vous pouvez gérer les contrats dans la section 'Gestion des contrats'"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'entité:", error);
      toast.error("Une erreur inattendue s'est produite lors de la suppression de l'entité");
    } finally {
      setConfirmDeleteId(null);
      setConfirmDeleteName("");
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
    setConfirmDeleteName("");
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement des entités...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Erreur lors du chargement des entités</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Gestion des entités
              </h1>
              <p className="text-gray-500">
                Gérez les entités de votre organisation
              </p>
            </div>
            <Link to="/gestion-administrative/entites/ajouter">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une entité
              </Button>
            </Link>
          </div>
        </div>

        {/* Filtres */}
        {/* <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="search">Rechercher</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Rechercher par nom, abréviation, localisation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="active">Actives</SelectItem>
                    <SelectItem value="inactive">Inactives</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Statistiques */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total des entités</p>
                  <p className="text-2xl font-bold text-gray-900">{entites?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Localisations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(entites?.map(e => e.localisation) || []).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Phone className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avec contact</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {entites?.filter(e => e.contact).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table des entités */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Liste des entités</CardTitle>
          </CardHeader>
          <CardContent>
            {paginatedEntites.length === 0 ? (
              <div className="text-center py-8">
                <Building className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune entité trouvée</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== "all" 
                    ? "Aucune entité ne correspond à vos critères de recherche."
                    : "Commencez par ajouter votre première entité."
                  }
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <div className="mt-6">
                    <Link to="/gestion-administrative/entites/ajouter">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter une entité
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entité</TableHead>
                      <TableHead>Abréviation</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEntites.map((entite) => (
                      <TableRow key={entite.id_entite}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarFallback className="bg-blue-500 text-white text-xs">
                                {getInitials(entite.denomination)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{entite.denomination}</div>
                              {/* <div className="text-sm text-gray-500">ID: {entite.id_entite}</div> Utilisez le si vous voulez voir l'id de l'entité */}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {entite.abreviation_nom ? (
                            <Badge variant="secondary">{entite.abreviation_nom}</Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            {entite.localisation || <span className="text-gray-400">-</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {entite.contact ? (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-400 mr-1" />
                              {entite.contact}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {entite.adresse_postal || <span className="text-gray-400">-</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/gestion-administrative/entites/${entite.id_entite}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir les détails
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/gestion-administrative/entites/${entite.id_entite}/editer`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteEntite(entite.id_entite, entite.denomination)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-700">
                      Affichage de {startIndex + 1} à {Math.min(endIndex, filteredEntites.length)} sur {filteredEntites.length} entités
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* AlertDialog pour la confirmation de suppression */}
        <AlertDialog
          open={!!confirmDeleteId}
          onOpenChange={(open) => {
            if (!open) handleCancelDelete();
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer l'entité "{confirmDeleteName}" ? Cette action
                est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDelete}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default EntitesList; 