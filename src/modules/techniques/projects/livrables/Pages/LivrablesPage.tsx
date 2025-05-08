// src/techniques/projects/livrables/pages/LivrablesPage.tsx
import { useLivrables } from "../hooks/useLivrables";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "../../components/gestions/StatusBadge";
import { PlusIcon, SearchIcon } from "lucide-react";
import { LivrableForm } from "../../components/forms/LivrableForm";
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
import { FileText } from "lucide-react";
import { Livrable } from "../../types/types";
import Layout from "@/components/Layout";

export const LivrablesPage = () => {
  const { livrables, stats, error, createLivrable } = useLivrables();
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredLivrables = livrables.filter(livrable =>
    (livrable.titre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    livrable.Réalisations.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livrable._Recommandation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProjectName = (id: string) => {
    return projects.find(p => p.id_projet === id)?.nom_projet || id;
  };

  const handleCreateLivrable = async (livrable: Omit<Livrable, 'Id_Livrable'>) => {
    try {
      await createLivrable(livrable);
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <div>Erreur: {error}</div>;

  const btnlivrable = () =>{
    return(
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="cursor-pointer transition ease-in-out duration-300 active:scale-95" variant={"outline"}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouveau Livrable
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau livrable</DialogTitle>
          </DialogHeader>
          <LivrableForm 
            onSubmit={handleCreateLivrable} 
            projects={projects.map(p => ({ 
              id_projet: p.id_projet, 
              nom_projet: p.nom_projet 
            }))}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Layout autre={btnlivrable}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des Livrables</h1>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard 
            title="Total des livrables" 
            value={stats?.total || 0} 
          />
          <KPICard 
            title="Livrables approuvés" 
            value={stats?.byStatus['approuvé'] || 0} 
          />
          <KPICard 
            title="Livrables en attente" 
            value={stats?.byStatus['en attente'] || 0} 
          />
          <KPICard 
            title="Livrables rejetés" 
            value={stats?.byStatus['rejeté'] || 0} 
          />
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des livrables..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Livrables table */}
        <Card>
          <CardHeader>
            <CardTitle>Tous les livrables</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLivrables.map(livrable => (
                  <TableRow key={livrable.Id_Livrable}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <Link 
                          to={`/technique/rapports/${livrable.Id_Livrable}`}
                          className="hover:underline"
                        >
                          {livrable.titre || `Livrable #${livrable.Id_Livrable}`}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link 
                        to={`/technique/Projets/${livrable.id_projet}`}
                        className="hover:underline"
                      >
                        {getProjectName(livrable.id_projet)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={livrable.Approbation} />
                    </TableCell>
                    <TableCell>
                      {new Date(livrable.Date_).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/technique/rapports/${livrable.Id_Livrable}/modifier`}>
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