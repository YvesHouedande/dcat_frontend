import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  PlusCircle,
  MoreHorizontal,
  Eye,
  Download,
  FileText,
  Calendar,
  Share2,
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { EmployeDocument } from "../../types/interfaces";



export const documents: EmployeDocument[] = [
  {
    id_documents: 1,
    libelle_document: "Rapport annuel 2024",
    lien_document: "rapport-annuel-2024.pdf",
    etat_document: "private",
    id_nature_document: 1,
    date_document: "2024-04-01T09:30:00",
    classification_document: "confidentiel"
  },
  {
    id_documents: 2,
    libelle_document: "Présentation du projet Alpha",
    lien_document: "presentation-projet-alpha.pptx",
    etat_document: "public",
    id_nature_document: 2,
    date_document: "2024-03-28T14:15:00",
    classification_document: "interne"
  },
  {
    id_documents: 3,
    libelle_document: "Manuel d'utilisation ERP",
    lien_document: "manuel-erp.pdf",
    etat_document: "private",
    id_nature_document: 3,
    date_document: "2024-03-25T11:45:00",
    classification_document: "public"
  },
  {
    id_documents: 4,
    libelle_document: "Contrat de service client",
    lien_document: "contrat-service.docx",
    etat_document: "public",
    id_nature_document: 4,
    date_document: "2024-03-20T16:00:00",
    classification_document: "personnel"
  },
  {
    id_documents: 5,
    libelle_document: "Analyse de marché Q1 2024",
    lien_document: "analyse-marche-q1.xlsx",
    etat_document: "private",
    id_nature_document: 5,
    date_document: "2024-03-18T10:20:00",
    classification_document: "restreint"
  },
  {
    id_documents: 6,
    libelle_document: "Spécifications techniques",
    lien_document: "specs-techniques.pdf",
    etat_document: "public",
    id_nature_document: 1,
    date_document: "2024-03-15T15:30:00",
    classification_document: "confidentiel"
  },
  {
    id_documents: 7,
    libelle_document: "Calendrier des formations",
    lien_document: "calendrier-formations.xlsx",
    etat_document: "private",
    id_nature_document: 2,
    date_document: "2024-03-10T09:00:00",
    classification_document: "interne"
  },
  {
    id_documents: 8,
    libelle_document: "Procédures internes",
    lien_document: "procedures-internes.pdf",
    etat_document: "public",
    id_nature_document: 3,
    date_document: "2024-03-08T11:15:00",
    classification_document: "public"
  },
];
const ModernDocumentGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  // Données d'exemple pour les documents
  

  // Filtrage des documents basé sur la recherche
  const filteredDocuments = searchQuery
    ? documents.filter(
        (document) =>
          document.libelle_document.toLowerCase().includes(searchQuery.toLowerCase()) ||
          document.lien_document?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          document.classification_document?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : documents;

  const handleAddDocument = () => {
    navigate("/administration/documents/nouveau");
  };

  const handleViewDocument = (id: number) => {
    navigate(`/administration/documents/${id}/details`);
  };

  const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    return extension.toUpperCase();
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
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
    const typeMap = {
      pdf: { color: "text-red-500", size: 28 },
      docx: { color: "text-blue-500", size: 28 },
      xlsx: { color: "text-green-500", size: 28 },
      pptx: { color: "text-orange-500", size: 28 },
      default: { color: "text-gray-500", size: 28 }
    };

    const style = typeMap[type as keyof typeof typeMap] || typeMap.default;
    return <FileText size={style.size} className={style.color} />;
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM", { locale: fr });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm", { locale: fr });
  };

  return (
    <div className="bg-gray-50 p-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header avec titre et actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Annuaire des documents
            </h1>
            <p className="text-sm text-gray-500">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} disponible{filteredDocuments.length !== 1 ? 's' : ''}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </Button>
            </div>
            <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 h-8">
              <Filter size={14} className="mr-1" />
              Filtres
            </Button>
            <Button
              onClick={handleAddDocument}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer h-8"
              size="sm"
            >
              <PlusCircle size={14} className="mr-1" />
              Ajouter
            </Button>
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
              placeholder="Rechercher par titre, type de fichier..."
              className="pl-9 py-2 h-10 border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {viewMode === "grid" ? (
          /* Grille compacte de documents */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredDocuments.map((document) => (
              <Card
                key={document.id_documents}
                className="overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer"
                onClick={() => handleViewDocument(document.id_documents)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    {getFileIcon(document.lien_document || "")}
                    <Badge
                      className={`text-xs font-normal ${getFileTypeColor(getFileType(document.lien_document || ""))}`}
                    >
                      {getFileType(document.lien_document || "")}
                    </Badge>
                  </div>

                  <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1 h-10">
                    {document.libelle_document}
                  </h3>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      <span>{formatDate(document.date_document || "")}</span>
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
                          <DropdownMenuItem className="cursor-pointer text-xs py-1 text-red-500">
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
                  <th className="text-left p-3 text-xs font-medium text-gray-500">Titre</th>
                  <th className="text-left p-3 text-xs font-medium text-gray-500 hidden md:table-cell">Fichier</th>
                  <th className="text-left p-3 text-xs font-medium text-gray-500 hidden sm:table-cell">Type</th>
                  <th className="text-left p-3 text-xs font-medium text-gray-500 hidden lg:table-cell">Date</th>
                  <th className="text-right p-3 text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((document, index) => (
                  <tr
                    key={document.id_documents}
                    className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        {getFileIcon(document.lien_document || "")}
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-800">{document.libelle_document}</p>
                          <p className="text-xs text-gray-500 md:hidden">{document.lien_document}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-600 hidden md:table-cell">{document.lien_document}</td>
                    <td className="p-3 hidden sm:table-cell">
                      <Badge className={`text-xs font-normal ${getFileTypeColor(getFileType(document.lien_document || ""))}`}>
                        {getFileType(document.lien_document || "")}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-600 hidden lg:table-cell">
                      {formatDate(document.date_document || "")} à {formatTime(document.date_document || "")}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleViewDocument(document.id_documents)}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Download size={14} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <MoreHorizontal size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer text-xs">
                              <Share2 size={14} className="mr-2" />
                              Partager
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-xs text-red-500">
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

        {/* Message si aucun résultat */}
        {filteredDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 bg-white rounded-lg border mt-4">
            <FileText size={48} className="text-gray-300 mb-2" />
            <p className="text-gray-600 mb-2">
              Aucun document ne correspond à votre recherche
            </p>
            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
              Réinitialiser la recherche
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernDocumentGrid;
