import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  Calendar,
  XCircle,
  RotateCcw,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  ChevronDown,
  Loader2,
  Truck,
  MoreHorizontal,
} from "lucide-react";
import { useCommandes, useDeleteCommande } from "../hooks/useCommandes";
import { Commande } from "../types/commande";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "../../utils/helpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface CommandesTableProps {
  onCreateNew: () => void;
  onEdit: (commande: Commande) => void;
}

const getStatusInfo = (status: Commande["etat_commande"]) => {
  const statusMap = {
    en_attente: {
      label: "En attente",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
      dotColor: "bg-amber-500",
    },
    Livrée: {
      label: "Livrée",
      color: "bg-green-50 text-green-700 border-green-200",
      icon: CheckCircle,
      dotColor: "bg-green-500",
    },
    annulée: {
      label: "Annulée",
      color: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
      dotColor: "bg-red-500",
    },
    Retournée: {
      label: "Retournée",
      color: "bg-orange-50 text-orange-700 border-orange-200",
      icon: RotateCcw,
      dotColor: "bg-orange-500",
    },
  };
  return statusMap[status as keyof typeof statusMap] || statusMap["en_attente"];
};

export const StatusBadge = ({
  status,
}: {
  status: Commande["etat_commande"];
}) => {
  const statusInfo = getStatusInfo(status);
  const Icon = statusInfo.icon;

  return (
    <Badge variant="outline" className={`${statusInfo.color} border text-xs`}>
      <Icon size={10} className="mr-1" />
      <span className="hidden sm:inline">{statusInfo.label}</span>
      <span className="sm:hidden">{statusInfo.label.split(" ")[0]}</span>
    </Badge>
  );
};

// Composant carte pour mobile
const CommandeCard = ({
  commande,
  onView,
  onEdit,
  onDelete,
  montant_total,
}: {
  commande: Commande;
  onView: (commande: Commande) => void;
  onEdit: (commande: Commande) => void;
  onDelete: (commande: Commande) => void;
  montant_total: number;
}) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                #{commande.id_commande}
              </div>
              <div className="text-sm text-gray-500">
                {commande.produits?.length || 0} article
                {(commande.produits?.length || 0) > 1 ? "s" : ""}
              </div>
            </div>
          </div>
          <StatusBadge status={commande.etat_commande} />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {formatDate(commande.date_de_commande)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Montant:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(montant_total)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Paiement:</span>
            <span className="font-medium">{commande.mode_de_paiement}</span>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 break-words">
                {commande.lieu_de_livraison}
              </span>
            </div>
            {commande.date_livraison && (
              <div className="text-xs text-green-600 mt-1 flex items-center">
                <Truck className="w-3 h-3 mr-1" />
                Livré le {formatDate(commande.date_livraison)}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(commande)}
            className="flex-1 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            Voir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(commande)}
            className="flex-1 text-xs"
          >
            <Edit className="w-3 h-3 mr-1" />
            Modifier
          </Button>
          {commande.etat_commande === "annulée" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(commande)}
              className="flex-1 text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Supprimer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const CommandesTable: React.FC<CommandesTableProps> = ({
  onCreateNew,
  onEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(
    null
  );

  const {
    data: commandes,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommandes({
    search: searchTerm,
  });

  const deleteCommande = useDeleteCommande();
  const navigate = useNavigate();

  const commandesData = useMemo(
    () => commandes?.pages.flatMap((page) => page.data),
    [commandes]
  );

  const filteredCommandes = useMemo(
    () =>
      commandesData?.filter((commande) => {
        const matchesSearch =
          commande.commande.id_commande.toString().includes(searchTerm) ||
          commande.commande.lieu_de_livraison
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" ||
          commande.commande.etat_commande === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    [commandesData, searchTerm, statusFilter]
  );

  // Calculs pour l'affichage
  const totalItems = commandes?.pages[0]?.totalItems || 0;
  const displayedItems = filteredCommandes?.length || 0;

  const handleDelete = async () => {
    if (!selectedCommande) return;

    const type = selectedCommande.id_commande
      ? "vente en ligne"
      : "vente directe";
    await deleteCommande.mutateAsync({
      id: selectedCommande.id_commande || 0,
      type: type,
    });
    setOpenDelete(false);
    setSelectedCommande(null);
  };

  const handleView = (commande: Commande) => {
    navigate(commande.id_commande.toString());
  };

  const handleDeleteClick = (commande: Commande) => {
    setOpenDelete(true);
    setSelectedCommande(commande);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Chargement des commandes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-red-600">
            Impossible de charger les commandes. Veuillez réessayer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header moderne */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Gestion des Commandes
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {displayedItems} commande{displayedItems > 1 ? "s" : ""} affichée
              {displayedItems > 1 ? "s" : ""}
              {hasNextPage && ` sur ${totalItems} au total`}
            </p>
          </div>
          <Button
            onClick={() => navigate("nouvelle")}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Truck size={16} className="mr-2" />
            <span className="hidden sm:inline">Nouvelle commande</span>
            <span className="sm:hidden">Nouvelle</span>
          </Button>
        </div>
      </div>

      {/* Filtres modernes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="Livrée">Livrée</SelectItem>
              <SelectItem value="annulée">Annulée</SelectItem>
              <SelectItem value="Retournée">Retournée</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-600">Pagination infinie</div>
          </div>
        </div>
      </div>

      {/* Contenu - Tableau pour desktop, Cartes pour mobile */}
      {filteredCommandes && filteredCommandes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
          <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Aucune commande trouvée
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Aucune commande ne correspond à vos critères de recherche."
              : "Commencez par créer votre première commande."}
          </p>
          <Button
            onClick={onCreateNew}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Créer une commande
          </Button>
        </div>
      ) : (
        <>
          {/* Version mobile - Cartes */}
          <div className="block sm:hidden">
            {filteredCommandes?.map((commande) => (
              <CommandeCard
                key={commande.commande.id_commande}
                commande={commande.commande}
                onView={handleView}
                onEdit={onEdit}
                onDelete={handleDeleteClick}
                montant_total={commande.montant_total}
              />
            ))}
          </div>

          {/* Version desktop - Tableau */}
          <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Commande
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Date
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Statut
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Montant
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Livraison
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommandes?.map((commande) => (
                    <TableRow
                      key={commande.commande.id_commande}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              #{commande.commande.id_commande}
                            </div>
                            <div className="text-sm text-gray-500">
                              {commande.nb_articles || 0} article
                              {(commande.nb_articles || 0) > 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(commande.commande.date_de_commande)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          Commandé
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={commande.commande.etat_commande} />
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(commande.montant_total)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <CreditCard className="w-3 h-3 mr-1" />
                          {commande.commande.mode_de_paiement}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900 flex items-start">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="break-words">
                            {commande.commande.lieu_de_livraison}
                          </span>
                        </div>
                        {commande.commande.date_livraison && (
                          <div className="text-xs text-green-600 mt-1 flex items-center">
                            <Truck className="w-3 h-3 mr-1" />
                            Livré le{" "}
                            {formatDate(commande.commande.date_livraison)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleView(commande.commande)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onEdit(commande.commande)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            {commande.commande.etat_commande === "annulée" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteClick(commande.commande)
                                }
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* Bouton "Charger plus" pour pagination infinie */}
      {hasNextPage && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex justify-center">
            <Button
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              variant="outline"
              className="border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Chargement...
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Charger plus de commandes
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      {!hasNextPage && commandesData?.length && commandesData.length > 0 && (
        <div className="text-center text-gray-500 mt-4">Fin de la liste</div>
      )}

      {/* Dialog de suppression */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Supprimer la commande
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>Cette action est irréversible.</strong>
                <br />
                Voulez-vous vraiment supprimer cette commande ?<br />
                Elle sera définitivement supprimée de votre historique.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDelete(false)}
                className="border-gray-200 hover:bg-gray-50 order-2 sm:order-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteCommande.isLoading}
                className="bg-red-600 hover:bg-red-700 text-white order-1 sm:order-2"
              >
                {deleteCommande.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Suppression...
                  </>
                ) : (
                  "Confirmer la suppression"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
