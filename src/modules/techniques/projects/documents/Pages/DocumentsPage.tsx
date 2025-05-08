// src/techniques/projects/documents/pages/DocumentsPage.tsx
import { useDocuments } from "../hooks/useDocuments";
import { KPICard } from "../../components/gestions/KPICard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "../../components/gestions/StatusBadge";
import { PlusIcon, SearchIcon } from "lucide-react";
import { DocumentForm } from "../../components/forms/DocumentForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useProjects } from "../../projet/hooks/useProjects";
import { Link } from "react-router-dom";
import { File } from "lucide-react";
import Layout from "@/components/Layout";
import { omit } from "@/lib/utils";
// Si vous avez besoin de gérer l'upload de fichiers, vous pourriez avoir besoin d'importer d'autres fonctions
// import { uploadDocumentFile } from "../api/documentApi"; // Exemple

export const DocumentsPage = () => {
  const { documents, stats, error, createDocument } = useDocuments();
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredDocuments = documents.filter(
    (document) =>
      document.lien_document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.classification_document
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getProjectName = (id?: string) => {
    if (!id) return "Non associé";
    return projects.find((p) => p.id_projet === id)?.nom_projet || id;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "contrat":
        return <File className="h-4 w-4 text-blue-500" />;
      case "facture":
        return <File className="h-4 w-4 text-green-500" />;
      case "rapport":
        return <File className="h-4 w-4 text-purple-500" />;
      case "plan":
        return <File className="h-4 w-4 text-orange-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  // Version corrigée de handleCreateDocument
  const handleCreateDocument = async (values: {
    version: string;
    description: string;
    id_projet: string;
    libele_document: string;
    classification_document:
      | "contrat"
      | "facture"
      | "rapport"
      | "plan"
      | "autre";
    lien_document: string;
    etat_document: "brouillon" | "validé" | "archivé" | "obsolète";
    date_creation: Date;
    createur: string;
    file?: File;
  }) => {
    try {
      const formValues = omit(values, ["file"]);
      // Map form values to your Document model
      const documentToCreate = {
        ...formValues,
        nom_document: formValues.libele_document, // or another mapping if needed
        description_document: formValues.description, // or another mapping if needed
        date_creation: formValues.date_creation instanceof Date
          ? formValues.date_creation.toISOString()
          : formValues.date_creation,
      };

      // Remove fields not expected by your API if necessary
      // For example, if your API does not expect 'version', 'createur', etc., remove them here

      await createDocument(documentToCreate); // Cast if needed, or adjust your types

      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <div>Erreur: {error}</div>;

  const btndoc = () => {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="cursor-pointer transition ease-in-out duration-300 active:scale-95"
            variant={"outline"}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouveau Document
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau document</DialogTitle>
          </DialogHeader>
          <DocumentForm
            onSubmit={handleCreateDocument}
            projects={projects.map((p) => ({
              id_projet: p.id_projet,
              nom_projet: p.nom_projet,
            }))}
          />
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Layout autre={btndoc}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des Documents</h1>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard title="Total des documents" value={stats?.total || 0} />
          <KPICard
            title="Documents validés"
            value={stats?.byStatus["validé"] || 0}
          />
          <KPICard title="Contrats" value={stats?.byType["contrat"] || 0} />
          <KPICard
            title="Documents archivés"
            value={stats?.byStatus["archivé"] || 0}
          />
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des documents..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Documents table */}
        <Card>
          <CardHeader>
            <CardTitle>Tous les documents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.Id_documents}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getFileIcon(document.classification_document)}
                        <Link
                          to={`/technique/documents/${document.Id_documents}`}
                          className="hover:underline"
                        >
                          {document.libele_document}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">
                        {document.classification_document}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={document.etat_document} />
                    </TableCell>
                    <TableCell>
                      {document.id_projet ? (
                        <Link
                          to={`/technique/Projets/${document.id_projet}`}
                          className="hover:underline"
                        >
                          {getProjectName(document.id_projet)}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">
                          Non associé
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {document.date_creation
                        ? new Date(document.date_creation).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          to={`/documents/${document.Id_documents}/modifier`}
                        >
                          Éditer
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
