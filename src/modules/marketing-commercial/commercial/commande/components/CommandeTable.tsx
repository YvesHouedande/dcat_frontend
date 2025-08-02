import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
  RefreshCw,
  BarChart3,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { useCommandes, useDeleteCommande } from "../hooks/useCommandes";
import { Commande, CommandeData, etat_commande } from "../types/commande";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "@/modules/stocks/utils/helpers";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CommandesTableProps {
  onEdit: (id: string | number) => void;
}

const getStatusInfo = (status: Commande["etat_commande"]) => {
  const statusMap = {
    en_attente: {
      label: "En attente",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
      dotColor: "bg-amber-500",
    },
    en_cours: {
      label: "En Cours",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Clock,
      dotColor: "bg-blue-500",
    },
    livree: {
      label: "Livrée",
      color: "bg-green-50 text-green-700 border-green-200",
      icon: CheckCircle,
      dotColor: "bg-green-500",
    },
    annulee: {
      label: "Annulée",
      color: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
      dotColor: "bg-red-500",
    },
    retournee: {
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

// Composant carte moderne pour mobile
const CommandeCard = ({
  commande,
  onView,
  onEdit,
  onDelete,
  montant_total,
}: {
  commande: Commande;
  onView: (commande: Commande) => void;
  onEdit: (id: string | number) => void;
  onDelete: (commande: Commande) => void;
  montant_total: number;
}) => {
  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">
                #{commande.id_commande}
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <Package className="w-3 h-3 mr-1" />
                {commande.produits?.length || 0} article
                {(commande.produits?.length || 0) > 1 ? "s" : ""}
              </div>
            </div>
          </div>
          <StatusBadge status={commande.etat_commande} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium mb-1">Date</div>
            <div className="text-sm font-semibold text-gray-900">
              {formatDate(commande.date_de_commande)}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-green-600 font-medium mb-1">
              Montant
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {formatCurrency(montant_total)}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Paiement</span>
            <span className="text-sm font-medium">
              {commande.mode_de_paiement}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 break-words">
                {commande.lieu_de_livraison}
              </span>
            </div>
            {commande.date_livraison && (
              <div className="text-xs text-green-600 mt-2 flex items-center">
                <Truck className="w-3 h-3 mr-1" />
                Livré le {formatDate(commande.date_livraison)}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(commande)}
            className="flex-1 text-xs bg-white hover:bg-gray-50"
          >
            <Eye className="w-3 h-3 mr-1" />
            Voir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(commande.id_commande)}
            className="flex-1 text-xs bg-white hover:bg-gray-50"
          >
            <Edit className="w-3 h-3 mr-1" />
            Modifier
          </Button>
          {commande.etat_commande === etat_commande.annulee && (
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

// Composant de statistiques
const StatsCards = ({ commandesData }: { commandesData: CommandeData[] }) => {
  const stats = useMemo(() => {
    const total = commandesData?.length || 0;
    const enAttente =
      commandesData?.filter(
        (c) => c.commande.etat_commande === etat_commande.en_attente
      ).length || 0;
    const livrees =
      commandesData?.filter(
        (c) => c.commande.etat_commande === etat_commande.livree
      ).length || 0;
    const totalMontant = commandesData
      ?.filter((c) => c.commande.etat_commande === etat_commande.livree)
      .reduce((sum, c) => sum + Number(c.montant_total), 0);
    const enCours = commandesData?.filter(
      (c) => c.commande.etat_commande === "en_cours"
    );

    // commandesData?.reduce((sum, c) => sum + c.montant_total, 0) || 0;

    return { total, enAttente, livrees, totalMontant, enCours };
  }, [commandesData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Commandes</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Package className="w-8 h-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">En Cours</p>
              <p className="text-2xl font-bold">{stats.enAttente}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">En Attente</p>
              <p className="text-2xl font-bold">{stats.enAttente}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Livrées</p>
              <p className="text-2xl font-bold">{stats.livrees}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Chiffre d'affaires</p>
              <p className="text-lg font-bold">
                {formatCurrency(stats.totalMontant)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const CommandesTable: React.FC<CommandesTableProps> = ({ onEdit }) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(
    null
  );
  const [showStats, setShowStats] = useState(true);

  const {
    data: commandes,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useCommandes({
    search: "",
  });

  const deleteCommande = useDeleteCommande();
  const navigate = useNavigate();

  const commandesData = useMemo(() => {
    return commandes?.pages
      .flatMap((page) => page.data)
      .sort((a, b) => {
        const dateA = new Date(a.commande.created_at).getTime();
        const dateB = new Date(b.commande.created_at).getTime();
        return dateB - dateA;
      });
  }, [commandes]);

  const totalItems = commandes?.pages[0]?.totalItems || 0;
  const displayedItems = commandesData?.length || 0;

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
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-red-600 mb-6">
            Impossible de charger les commandes. Veuillez réessayer.
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header moderne avec actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des Commandes
            </h1>
            <p className="text-gray-600">
              {displayedItems} commande{displayedItems > 1 ? "s" : ""} affichée
              {displayedItems > 1 ? "s" : ""}
              {hasNextPage && ` sur ${totalItems} au total`}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowStats(!showStats)}
              className="border-gray-200 hover:bg-gray-50"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {showStats ? "Masquer" : "Afficher"} les stats
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      {showStats && commandesData && (
        <StatsCards commandesData={commandesData} />
      )}

      {/* Filtres modernes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="Livrée">Livrée</SelectItem>
              <SelectItem value="annulée">Annulée</SelectItem>
              <SelectItem value="Retournée">Retournée</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => refetch()}
            className="border-gray-200 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>

          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              Pagination infinie
            </Badge>
          </div>
        </div>
      </div>

      {/* Contenu - Tableau pour desktop, Cartes pour mobile */}
      {commandesData && commandesData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune commande trouvée
          </h3>

          <Button
            onClick={() => navigate("/commercial/commande-equipements")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Créer une commande
          </Button>
        </div>
      ) : (
        <>
          {/* Version mobile - Cartes */}
          <div className="block sm:hidden">
            {commandesData?.map((commande) => (
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

          {/* Version desktop - Tableau moderne */}
          <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200">
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
                  {commandesData?.map((commande) => (
                    <TableRow
                      key={commande.commande.id_commande}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <ShoppingCart className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
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
                        <div className="font-bold text-gray-900">
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
                              className="h-8 w-8 p-0 hover:bg-gray-100"
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
                            {commande.commande.etat_commande !==
                              etat_commande.annulee && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onEdit(commande.commande.id_commande)
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />
                            {commande.commande.etat_commande ===
                              etat_commande.annulee && (
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

      {/* Bouton "Charger plus" moderne */}
      {hasNextPage && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-center">
            <Button
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              variant="outline"
              className="border-gray-200 hover:bg-gray-50 disabled:opacity-50 px-8 py-3"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Chargement en cours...
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5 mr-2" />
                  Charger plus de commandes
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {!hasNextPage && commandesData?.length && commandesData.length > 0 && (
        <div className="text-center text-gray-500 py-4">
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-2" />
            <p className="text-sm">Toutes les commandes ont été chargées</p>
          </div>
        </div>
      )}

      {/* Dialog de suppression moderne */}
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
                className="border-gray-200 hover:bg-gray-50"
              >
                Annuler
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteCommande.isLoading}
                className="bg-red-600 hover:bg-red-700 text-white"
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
