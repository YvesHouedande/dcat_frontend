import React, { useState, useEffect} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreHorizontal,
  Eye,
  Download,
  FileText,
  Calendar,
  Share2,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate} from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { useAllInterventionDocuments } from "../hooks/useInterventions";
import { InterventionDocument as InterventionDocumentType } from "../interface/interface";
// Ajoute un type local pour la structure de réponse API attendue

export const InterventionDocument: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [documents, setDocuments] = useState<InterventionDocumentType[]>([]);
  const navigate = useNavigate();
  
  
  // Utiliser le nouveau hook pour récupérer les documents des interventions
  const {
    data: documentsData,
    isLoading,
    isError
  } = useAllInterventionDocuments(currentPage, 20);

  // Mettre à jour les documents quand les données changent
  useEffect(() => {
    if (documentsData?.data) {
      setDocuments(documentsData.data);
    }
  }, [documentsData]);

  // Fonction pour extraire le type de fichier à partir de l'extension
  const getFileType = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    return extension.toUpperCase();
  };

  const handleViewDocument = (idDoc: number) => {
    navigate(`/gestion-des-interventions/documents/${idDoc}/detail`, {
      state: {
        data: JSON.stringify(
          documents.find((doc) => doc.id_documents === idDoc)
        ),
      },
    });
  };

  const handleDeleteDocument = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      try {
        // TODO: Implémenter la suppression de document
        console.log("Suppression du document:", id);
        setDocuments((docs) => docs.filter((doc) => doc.id_documents !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression du document");
      }
    }
  };

  const getFileTypeColor = (filename: string) => {
    const type = getFileType(filename).toLowerCase();
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "docx":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "xlsx":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pptx":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getFileIcon = (filename: string) => {
    const type = getFileType(filename).toLowerCase();

    switch (type) {
      case "pdf":
        return <FileText size={28} className="text-red-500" />;
      case "docx":
        return <FileText size={28} className="text-blue-500" />;
      case "xlsx":
        return <FileText size={28} className="text-green-500" />;
      case "pptx":
        return <FileText size={28} className="text-orange-500" />;
      default:
        return <FileText size={28} className="text-gray-500" />;
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM", { locale: fr });
    } catch (err) {
      console.error("Erreur de formatage de date:", err);
      return dateString.split("T")[0];
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(date, "HH:mm", { locale: fr });
    } catch (err) {
      console.error("Erreur de formatage d'heure:", err);
      return dateString.split("T")[1]?.substring(0, 5) || "-";
    }
  };

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        Erreur lors du chargement des documents
      </div>
    );
  }

  // Vérification de sécurité supplémentaire
  if (!Array.isArray(documents)) {
    console.error("documents n'est pas un tableau:", documents);
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        Erreur de format de données
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header avec titre et actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Gestion des Documents des Interventions
            </h1>
            <p className="text-sm text-gray-500">
              {documents.length} document
              {documents.length !== 1 ? "s" : ""} disponible
              {documents.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-8"
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
                className="rounded-none h-8"
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

        {/* Barre de recherche */}
        <div className="mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              placeholder="Rechercher par le libellé du document"
              className="pl-9 py-2 h-10 border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              /* Grille compacte de documents */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {documents.map((document) => (
                  <Card
                    key={document.id_documents}
                    className="overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer"
                    onClick={() => handleViewDocument(document.id_documents)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        {getFileIcon(document.lien_document)}
                        <Badge
                          className={`text-xs font-normal ${getFileTypeColor(
                            document.lien_document
                          )}`}
                        >
                          {getFileType(document.lien_document)}
                        </Badge>
                      </div>

                      <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1 h-10">
                        {document.libelle_document}
                      </h3>

                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          <span>{formatDate(document.date_document)}</span>
                        </div>
                        <div className="flex">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-gray-100"
                              >
                                <MoreHorizontal size={12} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDocument(document.id_documents);
                                }}
                                className="cursor-pointer text-xs py-1"
                              >
                                <Eye size={12} className="mr-2" />
                                Consulter
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-xs py-1">
                                <Download size={12} className="mr-2" />
                                Télécharger
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-xs py-1">
                                <Share2 size={12} className="mr-2" />
                                Partager
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-xs py-1 text-red-500"
                                onClick={(e) =>
                                  handleDeleteDocument(document.id_documents, e)
                                }
                              >
                                <Trash2 size={12} className="mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Vue liste compacte */
              <div className="border rounded-lg overflow-hidden bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left p-3 text-xs font-medium text-gray-500">
                        Titre
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 hidden md:table-cell">
                        Fichier
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 hidden sm:table-cell">
                        Type
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-500 hidden lg:table-cell">
                        Date
                      </th>
                      <th className="text-right p-3 text-xs font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((document, index) => (
                      <tr
                        key={document.id_documents}
                        className={`border-b hover:bg-gray-50 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="p-3">
                          <div className="flex items-center">
                            {getFileIcon(document.lien_document)}
                            <div className="ml-2">
                              <p className="text-sm font-medium text-gray-800">
                                {document.libelle_document}
                              </p>
                              <p className="text-xs text-gray-500 md:hidden">
                                {document.lien_document}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-gray-600 hidden md:table-cell">
                          {document.lien_document}
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          <Badge
                            className={`text-xs font-normal ${getFileTypeColor(
                              document.lien_document
                            )}`}
                          >
                            {getFileType(document.lien_document)}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-gray-600 hidden lg:table-cell">
                          {document.date_document
                            ? `${formatDate(
                                document.date_document
                              )} à ${formatTime(document.date_document)}`
                            : "-"}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() =>
                                handleViewDocument(document.id_documents)
                              }
                            >
                              <Eye size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <Download size={14} />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                >
                                  <MoreHorizontal size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer text-xs">
                                  <Share2 size={14} className="mr-2" />
                                  Partager
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer text-xs text-red-500"
                                  onClick={(e) =>
                                    handleDeleteDocument(
                                      document.id_documents,
                                      e
                                    )
                                  }
                                >
                                  <Trash2 size={14} className="mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {documentsData?.pagination && documentsData.pagination.page < documentsData.pagination.totalPages && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Charger plus
          </Button>
        )}

        {/* Message si aucun résultat */}
        {documents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 bg-white rounded-lg border mt-4">
            <FileText size={48} className="text-gray-300 mb-2" />
            <p className="text-gray-600 mb-2">
              {searchQuery
                ? "Aucun document ne correspond à votre recherche"
                : "Aucun document d'intervention n'a encore été ajouté"}
            </p>
            {searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Réinitialiser la recherche
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterventionDocument;