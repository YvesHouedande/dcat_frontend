import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  PlusCircle,
  MoreHorizontal,
  Eye,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  User,
  AlertTriangle,
  CalendarRange,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from 'sonner';
import {
  useFilteredDemandes,
  useEmployes,
  useApprouverDemande,
  useRefuserDemande,
  useDeleteDemande,
} from "../../../hooks";

const DemandesAnnuaire: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDemandeId, setSelectedDemandeId] = useState<number | null>(null);
  const [approvalComment, setApprovalComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const navigate = useNavigate();

  // Chargement des demandes filtrées et des employés via TanStack Query
  const {
    demandes: filteredDemandes,
    isLoading: demandesLoading,
    error: demandesError,
  } = useFilteredDemandes({
    search: searchQuery,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  });
  const { data: employes, isLoading: employesLoading } = useEmployes();

  // Mutations
  const approuverDemande = useApprouverDemande();
  const refuserDemande = useRefuserDemande();
  const deleteDemande = useDeleteDemande();

  // Map employé pour accès rapide
  const employeMap = React.useMemo(() => {
    const map = new Map<number, { nom_employes: string; prenom_employes: string }>();
    employes?.forEach((employe) =>
      map.set(employe.id_employes, {
        nom_employes: employe.nom_employes,
        prenom_employes: employe.prenom_employes,
      })
    );
    return map;
  }, [employes]);

  // Statistiques
  const totalDemandes = filteredDemandes.length;
  const enAttenteCount = filteredDemandes.filter((d) => d.status === "En attente").length;
  const approuveesCount = filteredDemandes.filter((d) => d.status === "Approuvé" || d.status === "Approuvée").length;
  const refuseesCount = filteredDemandes.filter((d) => d.status === "Refusé" || d.status === "Refusée").length;

  // Navigation
  const handleAddDemande = () => {
    navigate("/administration/demandes/nouvelle");
  };
  const handleViewDemande = (id: number) => {
    navigate(`/administration/demandes/${id}/details`);
  };
  const handleEditDemande = (id: number) => {
    navigate(`/administration/demandes/${id}/modifier`);
  };

  // Dialogues d'action
  const handleApproveClick = (id: number) => {
    setSelectedDemandeId(id);
    setShowApproveDialog(true);
  };
  const handleRejectClick = (id: number) => {
    setSelectedDemandeId(id);
    setShowRejectDialog(true);
  };
  const handleDeleteClick = (id: number) => {
    setSelectedDemandeId(id);
    setShowDeleteDialog(true);
  };

  // Actions mutation
  const handleApprove = async () => {
    if (!selectedDemandeId) return;
    approuverDemande.mutate(
      { id: selectedDemandeId, commentaire: approvalComment },
      {
        onSuccess: () => {
          setShowApproveDialog(false);
          setApprovalComment("");
          setSelectedDemandeId(null);
        },
      }
    );
  };
  const handleReject = async () => {
    if (!selectedDemandeId) return;
    refuserDemande.mutate(
      { id: selectedDemandeId, motif: rejectionReason },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          setRejectionReason("");
          setSelectedDemandeId(null);
        },
      }
    );
  };
  const handleDelete = async () => {
    if (!selectedDemandeId) return;
    deleteDemande.mutate(
      { id: selectedDemandeId },
      {
        onSuccess: () => {
          setShowDeleteDialog(false);
          setSelectedDemandeId(null);
          toast.success('Demande supprimée avec succès');
        },
        onError: (err: unknown) => {
          if (err instanceof Error) {
            toast.error(err.message);
          } else if (typeof err === 'object' && err !== null && 'message' in err) {
            toast.error(String((err as { message?: string }).message));
          } else {
            toast.error('Erreur lors de la suppression de la demande');
          }
        }
      }
    );
  };

  const formatShortDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A"; // Gère les cas null/undefined
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Vérifie si la date est valide
    if (isNaN(dateObj.getTime())) return "N/A";
    
    return format(dateObj, "dd MMM", { locale: fr });
  };

  const calculateDuration = (startDate: string | Date | null, endDate: string | Date | null) => {
    if (!startDate || !endDate) return "N/A";

    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "N/A";
    
    const days = differenceInDays(end, start) + 1; // +1 to include both start and end day
    return days === 1 ? "1 jour" : `${days} jours`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En attente":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "Approuvé":
      case "Approuvée":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Refusé":
      case "Refusée":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "En cours":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Terminée":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Congé":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Formation":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Matériel":
        return "bg-teal-100 text-teal-800 hover:bg-teal-100";
      case "Télétravail":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100";
      case "Remboursement":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
      case "Autre":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "En attente":
        return <Clock size={16} className="text-amber-500" />;
      case "Approuvé":
      case "Approuvée":
        return <CheckCircle size={16} className="text-green-500" />;
      case "Refusé":
      case "Refusée":
        return <XCircle size={16} className="text-red-500" />;
      case "En cours":
        return <CalendarRange size={16} className="text-blue-500" />;
      case "Terminée":
        return <FileText size={16} className="text-gray-500" />;
      default:
        return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Congé":
        return <Calendar size={16} className="text-purple-500" />;
      case "Formation":
        return <FileText size={16} className="text-blue-500" />;
      case "Matériel":
        return <FileText size={16} className="text-teal-500" />;
      case "Télétravail":
        return <User size={16} className="text-indigo-500" />;
      case "Remboursement":
        return <FileText size={16} className="text-emerald-500" />;
      case "Autre":
        return <FileText size={16} className="text-gray-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  const getInitials = (nom: string | undefined, prenom: string | undefined) => {
    if (!nom || !prenom) return "??";
    return `${prenom[0]}${nom[0]}`.toUpperCase();
  };

  const getAvatarColor = (id: number) => {
    const colors = [
      "bg-blue-500 text-white",
      "bg-indigo-500 text-white",
      "bg-purple-500 text-white",
      "bg-pink-500 text-white",
      "bg-red-500 text-white",
      "bg-orange-500 text-white",
      "bg-amber-500 text-white",
      "bg-teal-500 text-white",
    ];

    const colorIndex = id % colors.length;
    return colors[colorIndex];
  };

  const uniqueTypes = Array.from(new Set(filteredDemandes.map((d) => d.type_demande)));
  const uniqueStatuses = Array.from(new Set(filteredDemandes.map((d) => d.status)));

  if (demandesLoading || employesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="mb-4 text-gray-700">Chargement des demandes...</div>
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  if (demandesError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600 bg-gray-50">
        <div className="mb-4 text-lg font-medium">{demandesError instanceof Error ? demandesError.message : String(demandesError)}</div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header avec titre et statistiques */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Annuaire des demandes
            </h1>
            <p className="text-sm text-gray-500">
              Gérez et suivez les demandes des employés
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddDemande}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer h-8"
              size="sm"
            >
              <PlusCircle size={14} className="mr-1" />
              Nouvelle demande
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total
              </CardTitle>
              <FileText className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDemandes}</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                En attente
              </CardTitle>
              <Clock className="h-6 w-6 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enAttenteCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Approuvées
              </CardTitle>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approuveesCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Refusées
              </CardTitle>
              <XCircle className="h-6 w-6 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{refuseesCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-grow">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              placeholder="Rechercher par nom, motif ou type..."
              className="pl-9 py-2 h-10 border-gray-300 rounded-lg w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 text-gray-700 border-gray-300"
                >
                  <Filter size={14} className="mr-1" />
                  Statut {statusFilter && <span className="ml-1 font-semibold text-blue-600">•</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setStatusFilter(null)}
                  className="cursor-pointer"
                >
                  <span className="font-medium">Tous les statuts</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {uniqueStatuses.map((status) => (
                  <DropdownMenuItem
                    key={status} // Added key
                    onClick={() => setStatusFilter(status)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      {getStatusIcon(status)}
                      <span className="ml-2">{status}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 text-gray-700 border-gray-300"
                >
                  <Filter size={14} className="mr-1" />
                  Type {typeFilter && <span className="ml-1 font-semibold text-blue-600">•</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setTypeFilter(null)}
                  className="cursor-pointer"
                >
                  <span className="font-medium">Tous les types</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {uniqueTypes.map((type) => (
                  <DropdownMenuItem
                    key={type} // Added key
                    onClick={() => setTypeFilter(type)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      {getTypeIcon(type)}
                      <span className="ml-2">{type}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-10"
                onClick={() => setViewMode("grid")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-10"
                onClick={() => setViewMode("list")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {filteredDemandes.length > 0 ? (
          viewMode === "grid" ? (
            /* Grille compacte de demandes */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredDemandes.map((demande) => {
                const employee = employeMap.get(demande.id_employes);
                return (
                  <Card
                    key={demande.id_demandes}
                    className="overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer bg-white"
                    onClick={() => handleViewDemande(demande.id_demandes)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={`${getStatusColor(demande.status)}`}>
                          <div className="flex items-center">
                            {getStatusIcon(demande.status)}
                            <span className="ml-1 text-xs">{demande.status}</span>
                          </div>
                        </Badge>
                        <Badge className={`${getTypeColor(demande.type_demande)}`}>
                          <div className="flex items-center">
                            {getTypeIcon(demande.type_demande)}
                            <span className="ml-1 text-xs">
                              {demande.type_demande}
                            </span>
                          </div>
                        </Badge>
                      </div>

                      <h3 className="font-medium text-gray-800 line-clamp-2 mb-3 text-sm">
                        {demande.motif}
                      </h3>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium ${getAvatarColor(
                              demande.id_employes
                            )}`}
                          >
                            {getInitials(
                              employee?.nom_employes,
                              employee?.prenom_employes
                            )}
                          </div>
                          <span className="ml-2 text-sm text-gray-700 truncate max-w-[120px]">
                            {employee?.prenom_employes} {employee?.nom_employes}
                          </span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-gray-100"
                            >
                              <MoreHorizontal size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDemande(demande.id_demandes);
                              }}
                              className="cursor-pointer text-xs py-1"
                            >
                              <Eye size={14} className="mr-2" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditDemande(demande.id_demandes);
                              }}
                              className="cursor-pointer text-xs py-1 text-blue-600"
                            >
                              <svg className="mr-2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                              Modifier
                            </DropdownMenuItem>
                            {demande.status === "En attente" && (
                              <>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproveClick(demande.id_demandes);
                                  }}
                                  className="cursor-pointer text-xs py-1 text-green-600"
                                >
                                  <CheckCircle size={14} className="mr-2" />
                                  Approuver
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRejectClick(demande.id_demandes);
                                  }}
                                  className="cursor-pointer text-xs py-1 text-red-600"
                                >
                                  <XCircle size={14} className="mr-2" />
                                  Refuser
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-700 focus:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(demande.id_demandes);
                              }}
                              disabled={deleteDemande.isLoading}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {deleteDemande.isLoading ? 'Suppression...' : 'Supprimer'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="border-t pt-2 text-xs text-gray-500">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CalendarRange size={14} className="mr-1" />
                            <span>
                              {formatShortDate(demande.date_absence)} -{" "}
                              {formatShortDate(demande.date_retour)}
                            </span>
                          </div>
                          <span>
                            {calculateDuration(
                              demande.date_absence,
                              demande.date_retour
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Vue liste compacte */
            <div className="border rounded-lg overflow-hidden bg-white">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-3 text-xs font-medium text-gray-500">
                      #ID
                    </th>
                    <th className="text-left p-3 text-xs font-medium text-gray-500">
                      Employé
                    </th>
                    <th className="text-left p-3 text-xs font-medium text-gray-500">
                      Motif
                    </th>
                    <th className="text-left p-3 text-xs font-medium text-gray-500 hidden sm:table-cell">
                      Type
                    </th>
                    <th className="text-left p-3 text-xs font-medium text-gray-500 hidden md:table-cell">
                      Période
                    </th>
                    <th className="text-left p-3 text-xs font-medium text-gray-500 hidden lg:table-cell">
                      Durée
                    </th>
                    <th className="text-left p-3 text-xs font-medium text-gray-500">
                      Statut
                    </th>
                    <th className="text-right p-3 text-xs font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDemandes.map((demande, index) => {
                    const employee = employeMap.get(demande.id_employes);
                    return (
                      <tr
                        key={demande.id_demandes}
                        className={`border-b hover:bg-gray-50 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } cursor-pointer`}
                        onClick={() => handleViewDemande(demande.id_demandes)}
                      >
                        <td className="p-3 text-sm font-medium text-gray-700">
                          #{demande.id_demandes}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div
                              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium ${getAvatarColor(
                                demande.id_employes
                              )}`}
                            >
                              {getInitials(
                                employee?.nom_employes,
                                employee?.prenom_employes
                              )}
                            </div>
                            <div className="ml-2">
                              <p className="text-sm font-medium text-gray-800">
                                {employee?.prenom_employes} {employee?.nom_employes}
                              </p>
                              <p className="text-xs text-gray-500 hidden sm:block md:hidden">
                                {demande.type_demande}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          <div className="line-clamp-1 max-w-[150px]">
                            {demande.motif}
                          </div>
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          <Badge
                            className={`${getTypeColor(
                              demande.type_demande
                            )} text-xs`}
                          >
                            {demande.type_demande}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-gray-600 hidden md:table-cell">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1 text-gray-400" />
                            <span>
                              {formatShortDate(demande.date_absence)} -{" "}
                              {formatShortDate(demande.date_retour)}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-gray-600 hidden lg:table-cell">
                          {calculateDuration(demande.date_absence, demande.date_retour)}
                        </td>
                        <td className="p-3">
                          <Badge className={`${getStatusColor(demande.status)}`}>
                            <div className="flex items-center">
                              {getStatusIcon(demande.status)}
                              <span className="ml-1 text-xs">{demande.status}</span>
                            </div>
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDemande(demande.id_demandes);
                              }}
                            >
                              <Eye size={14} />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                >
                                  <MoreHorizontal size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDemande(demande.id_demandes);
                                  }}
                                  className="cursor-pointer text-xs py-1"
                                >
                                  <Eye size={14} className="mr-2" />
                                  Voir les détails
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditDemande(demande.id_demandes);
                                  }}
                                  className="cursor-pointer text-xs py-1 text-blue-600"
                                >
                                  <svg className="mr-2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                                  Modifier
                                </DropdownMenuItem>
                                {demande.status === "En attente" && (
                                  <>
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleApproveClick(demande.id_demandes);
                                      }}
                                      className="cursor-pointer text-xs py-1 text-green-600"
                                    >
                                      <CheckCircle size={14} className="mr-2" />
                                      Approuver
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRejectClick(demande.id_demandes);
                                      }}
                                      className="cursor-pointer text-xs py-1 text-red-600"
                                    >
                                      <XCircle size={14} className="mr-2" />
                                      Refuser
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(demande.id_demandes);
                                  }}
                                  disabled={deleteDemande.isLoading}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {deleteDemande.isLoading ? 'Suppression...' : 'Supprimer'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Aucune demande trouvée
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              {filteredDemandes.length > 0
                ? "Aucune demande ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou d'effectuer une nouvelle recherche."
                : "Il n'y a actuellement aucune demande enregistrée."}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter(null);
                setTypeFilter(null);
              }}
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filteredDemandes.length > 0 && (
          <div className="flex justify-between items-center mt-4 bg-white rounded-lg p-3 border">
            <div className="text-sm text-gray-600">
              Affichage de{" "}
              <span className="font-medium">{filteredDemandes.length}</span>{" "}
              demande{filteredDemandes.length > 1 ? "s" : ""} sur{" "}
              <span className="font-medium">{filteredDemandes.length}</span> au total
            </div>
            {/* Pagination buttons (still static in this corrected version, needs full implementation) */}
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 border-gray-300"
                disabled // Still disabled; requires pagination state
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              <Button variant="default" size="sm" className="h-8 w-8 p-0">
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 border-gray-300"
                disabled // Still disabled; requires pagination state
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogue d'approbation */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approuver la demande</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir approuver cette demande ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="approval-comment">Commentaire (optionnel)</Label>
              <Textarea
                id="approval-comment"
                placeholder="Ajoutez un commentaire d'approbation..."
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={approuverDemande.isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApprove}
              disabled={approuverDemande.isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {approuverDemande.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approbation...
                </>
              ) : (
                "Approuver"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialogue de refus */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refuser la demande</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir refuser cette demande ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Motif du refus (recommandé)</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Expliquez pourquoi cette demande est refusée..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={refuserDemande.isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject}
              disabled={refuserDemande.isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {refuserDemande.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refus...
                </>
              ) : (
                "Refuser"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialogue de suppression */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la demande</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette demande ? Cette action
              est irréversible et la demande sera définitivement perdue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteDemande.isLoading}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteDemande.isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteDemande.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer définitivement"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DemandesAnnuaire;