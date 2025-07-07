import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Projet, Partenaire, Famille } from "../../types/types";
import { Button } from "@/components/ui/button";
import { ProjetFilters } from "../components/ProjetFilters";
import { ProjetTable } from "../components/ProjetTable";
import { ProjetPagination } from "../components/ProjetPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Home, Plus } from "lucide-react";

// Importation des fonctions API
import { 
  fetchAllProjets, 
  deleteProjetWithConfirmation, 
  getProjetAssociatedPartenaires 
} from "../api/projets";
import { getFamilles } from "../api/famille";
import { getPartenaires } from "../api/partenaires";

export const ProjetsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [projets, setProjets] = useState<Projet[]>([]);
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [familles, setFamilles] = useState<Famille[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEtat, setFilterEtat] = useState("tous");
  const [filterPartenaire, setFilterPartenaire] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const projetsPerPage = 10;
  const [error, setError] = useState<string | null>(null);
  const [serverPagination, setServerPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  // Map pour stocker les associations Projet ID -> Partenaire IDs
  const [projectPartnersMap, setProjectPartnersMap] = useState<Map<number, number[]>>(new Map());

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedProjets, fetchedFamilles, fetchedPartenaires] = await Promise.all([
        fetchAllProjets(currentPage, projetsPerPage, searchTerm, filterEtat, filterPartenaire),
        getFamilles(),
        getPartenaires()
      ]);

      // Handle projets response
      let projetsArray: Projet[] = [];
      if (fetchedProjets.data && Array.isArray(fetchedProjets.data)) {
        projetsArray = fetchedProjets.data;
      } else if (Array.isArray(fetchedProjets)) {
        projetsArray = fetchedProjets;
      }

      setProjets(projetsArray);
      setFamilles(fetchedFamilles);
      setPartenaires(fetchedPartenaires);

      // Stocker la pagination du backend
      if (fetchedProjets.pagination) {
        setServerPagination(fetchedProjets.pagination);
      }

      // Récupère les partenaires associés pour chaque projet
      const tempProjectPartnersMap = new Map<number, number[]>();
      const partnerFetchPromises = projetsArray.map(async (projet) => {
        try {
          const partnersForProject = await getProjetAssociatedPartenaires(projet.id_projet);
          tempProjectPartnersMap.set(projet.id_projet, partnersForProject);
        } catch (fetchError) {
          console.error(
            `Erreur lors de la récupération des partenaires pour le projet ${projet.id_projet} :`,
            fetchError
          );
          tempProjectPartnersMap.set(projet.id_projet, []);
        }
      });

      await Promise.all(partnerFetchPromises);
      setProjectPartnersMap(tempProjectPartnersMap);

    } catch (err: unknown) {
      console.error("Erreur lors du chargement des données :", err);
      setError((err as Error).message || "Impossible de charger les données. Veuillez réessayer.");
      setProjets([]);
      setPartenaires([]);
      setFamilles([]);
      setProjectPartnersMap(new Map());
    } finally {
      setLoading(false);
    }
  }, [currentPage, projetsPerPage, searchTerm, filterEtat, filterPartenaire]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Options pour le filtre des partenaires
  const partenaireOptionsWithNames = [
    { id: 0, name: "Tous les partenaires" },
    ...partenaires.map(p => ({ id: p.id_partenaire, name: p.nom_partenaire }))
  ];

  // Gestionnaire de suppression de projet
  const handleDelete = useCallback(async (id: number) => {
    const projetToDelete = projets.find(p => p.id_projet === id);
    if (!projetToDelete) {
      toast.error("Projet introuvable pour la suppression.");
      return;
    }
    setLoading(true);
    try {
      const result = await deleteProjetWithConfirmation(id, projetToDelete.nom_projet);
      if (result.success) {
        toast.success(`Projet "${projetToDelete.nom_projet}" supprimé avec succès !`);
        await loadAllData();
        if (serverPagination && currentPage > 1 && (serverPagination.total - 1) <= (currentPage - 1) * projetsPerPage) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        setError(result.message);
        toast.error(`Échec de la suppression: ${result.message}`);
      }
    } catch (err: unknown) {
      console.error("Erreur lors de la suppression du projet:", err);
      setError((err as Error).message || "Erreur inconnue lors de la suppression du projet.");
      toast.error(`Erreur lors de la suppression: ${(err as Error).message || "Erreur inconnue."}`);
    } finally {
      setLoading(false);
    }
  }, [projets, loadAllData, currentPage, projetsPerPage, serverPagination]);

  // Gestion des changements de filtre/recherche
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  const handleEtatChange = (value: string) => {
    setFilterEtat(value);
    setCurrentPage(1);
  };
  const handlePartenaireChange = (value: number) => {
    setFilterPartenaire(value);
    setCurrentPage(1);
  };

  // Pagination backend
  const totalPages = serverPagination ? serverPagination.totalPages : 1;
  const totalItems = serverPagination ? serverPagination.total : projets.length;

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Liste des Projets</h1>
            <p className="text-muted-foreground mt-2">
              Gérez tous vos projets techniques
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/technique/projets')}>
              <Home className="mr-2 h-4 w-4" />
              Tableau de bord
            </Button>
            {/* Bouton de rapports temporairement désactivé */}
            {/* <Button variant="outline" onClick={() => navigate('/technique/projets/rapports')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Rapports
            </Button> */}
            <Button onClick={() => navigate('/technique/projets/nouveau')}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Projet
            </Button>
          </div>
        </div>

        {/* Filtres des projets */}
        <ProjetFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterEtat={filterEtat}
          onFilterChange={handleEtatChange}
          filterPartenaire={filterPartenaire}
          onFilterPartenaireChange={handlePartenaireChange}
          partenairesOptions={partenaireOptionsWithNames}
          resultCount={totalItems}
        />

        {/* Affichage des erreurs */}
        {error && (
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              {error}
              <Button variant="ghost" onClick={loadAllData} className="ml-2 px-2 py-1 h-auto text-sm">
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Condition de chargement et d'affichage des projets */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <>
            {/* Message si aucun projet n'est trouvé */}
            {projets.length === 0 && !error ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">Aucun projet trouvé</p>
                <Button
                  variant="link"
                  className="mt-4 text-sm"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterEtat("tous");
                    setFilterPartenaire(0);
                    setCurrentPage(1);
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <>
                {/* Tableau des projets */}
                <ProjetTable
                  projets={projets}
                  onDelete={handleDelete}
                  onView={(id) => navigate(`/technique/projets/${id}/details`)}
                  onEdit={(id) => navigate(`/technique/projets/${id}/editer`)}
                  partenaires={partenaires}
                  familles={familles}
                  projectPartnersMap={projectPartnersMap}
                />
                {/* Pagination des projets */}
                <ProjetPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={projetsPerPage}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}; 