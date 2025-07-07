// src/pages/ProjetsPage.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Projet, Partenaire, Famille } from "../types/types"; // Chemin correct pour les types
import { ProjetKPICard } from "../projet/components/ProjetKPICard"; // Supposant que ces composants sont dans src/components
import { ProjetTable } from "../projet/components/ProjetTable"; // Supposant que ces composants sont dans src/components
import { ProjetFilters } from "../projet/components/ProjetFilters"; // Ajout des filtres
import { ProjetPagination } from "../projet/components/ProjetPagination"; // Ajout de la pagination
import {
  BarChart3,
  Clock,
  CheckCircle,
  RefreshCcw,
  Coins,
  FileText,
  Plus,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Import de toast pour les messages
// import Layout from "@/components/Layout";

// Importation des fonctions API depuis leurs fichiers respectifs
// Chemins ajustés basés sur la structure `src/api/`
import {
  fetchAllProjets,
  deleteProjetWithConfirmation,
  getProjetAssociatedPartenaires,
} from "../projet/api/projets"; // Chemin corrigé vers src/api/projets.ts
import { getFamilles } from "../projet/api/famille"; // Chemin corrigé vers src/api/famille.ts
import { getPartenaires } from "../projet/api/partenaires"; // Chemin corrigé vers src/api/partenaires.ts

const ProjetsPage = () => {
  const navigate = useNavigate();
  const [projets, setProjets] = useState<Projet[]>([]);
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [familles, setFamilles] = useState<Famille[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const projetsPerPage = 10;
  const [error, setError] = useState<string | null>(null);

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEtat, setFilterEtat] = useState("tous");
  const [filterPartenaire, setFilterPartenaire] = useState<number>(0);

  // État pour la pagination du serveur
  const [serverPagination, setServerPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  // Map pour stocker les associations Projet ID -> Partenaire IDs
  const [projectPartnersMap, setProjectPartnersMap] = useState<
    Map<number, number[]>
  >(new Map());

  // `loadAllData` est wrappé dans `useCallback` pour éviter les recréations inutiles
  // et les boucles infinies de `useEffect` si elle est passée comme dépendance.
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedProjets, fetchedFamilles, fetchedPartenaires] =
        await Promise.all([
          fetchAllProjets(
            currentPage,
            projetsPerPage,
            searchTerm,
            filterEtat,
            filterPartenaire
          ),
          getFamilles(),
          getPartenaires(),
        ]);

      // Handle projets response - fetchAllProjets returns ApiResponse<Projet[]>
      let projetsArray: Projet[] = [];
      if (fetchedProjets.data && Array.isArray(fetchedProjets.data)) {
        projetsArray = fetchedProjets.data;
      } else if (Array.isArray(fetchedProjets)) {
        projetsArray = fetchedProjets;
      }

      setProjets(projetsArray);
      setFamilles(fetchedFamilles);
      setPartenaires(fetchedPartenaires);

      // Stocker les informations de pagination du serveur
      if (fetchedProjets.pagination) {
        setServerPagination(fetchedProjets.pagination);
      }

      // Récupère les partenaires associés pour chaque projet et construit la map
      const tempProjectPartnersMap = new Map<number, number[]>();
      const partnerFetchPromises = projetsArray.map(async (projet) => {
        try {
          const partnersForProject = await getProjetAssociatedPartenaires(
            projet.id_projet
          );
          // `partnersForProject` est déjà un tableau d'IDs (`number[]`), l'utiliser directement
          tempProjectPartnersMap.set(projet.id_projet, partnersForProject);
        } catch (fetchError) {
          console.error(
            `Erreur lors de la récupération des partenaires pour le projet ${projet.id_projet} :`,
            fetchError
          );
          // En cas d'erreur, s'assurer que le projet a un tableau vide de partenaires
          tempProjectPartnersMap.set(projet.id_projet, []);
        }
      });

      // Attendre que toutes les promesses de récupération de partenaires soient résolues
      await Promise.all(partnerFetchPromises);
      setProjectPartnersMap(tempProjectPartnersMap);
    } catch (err: unknown) {
      console.error("Erreur lors du chargement des données :", err);
      setError(
        (err as Error).message ||
          "Impossible de charger les données. Veuillez réessayer."
      );
      // Réinitialiser les états en cas d'erreur grave pour un affichage cohérent
      setProjets([]);
      setPartenaires([]);
      setFamilles([]);
      setProjectPartnersMap(new Map());
    } finally {
      setLoading(false);
    }
  }, [currentPage, projetsPerPage, searchTerm, filterEtat, filterPartenaire]); // Ajout de currentPage, projetsPerPage, searchTerm, filterEtat, et filterPartenaire comme dépendances

  // Appelle `loadAllData` une seule fois au montage du composant
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Options pour le filtre des partenaires
  const partenaireOptionsWithNames = [
    { id: 0, name: "Tous les partenaires" },
    ...partenaires.map((p) => ({
      id: p.id_partenaire,
      name: p.nom_partenaire,
    })),
  ];

  // Les projets sont déjà filtrés par le serveur
  const currentProjets = projets;

  // Utiliser les données de pagination du serveur si disponibles, sinon calculer côté client
  const totalPages = serverPagination
    ? serverPagination.totalPages
    : Math.ceil(projets.length / projetsPerPage);
  const totalItems = serverPagination ? serverPagination.total : projets.length;

  // Debug logs pour comprendre le problème de pagination
  console.log("=== DEBUG PAGINATION ===");
  console.log("Total projets:", projets.length);
  console.log("Page actuelle:", currentPage);
  console.log("Projets par page:", projetsPerPage);
  console.log("Total pages calculé:", totalPages);
  console.log("Index premier projet:", 0);
  console.log("Index dernier projet:", currentProjets.length);
  console.log("Projets affichés sur cette page:", currentProjets.length);
  console.log(
    "Projets sur cette page:",
    currentProjets.map((p) => `${p.id_projet}: ${p.nom_projet}`)
  );

  // Gestionnaire de suppression de projet
  const handleDelete = useCallback(
    async (id: number) => {
      const projetToDelete = projets.find((p) => p.id_projet === id);
      if (!projetToDelete) {
        console.warn("Projet non trouvé pour suppression:", id);
        toast.error("Projet introuvable pour la suppression."); // Utilisation de toast
        return;
      }
      setLoading(true);
      try {
        // Appel de la fonction de suppression avec confirmation
        const result = await deleteProjetWithConfirmation(
          id,
          projetToDelete.nom_projet
        );
        if (result.success) {
          toast.success(
            `Projet "${projetToDelete.nom_projet}" supprimé avec succès !`
          ); // Utilisation de toast
          await loadAllData(); // Recharger toutes les données après suppression
          // Ajuster la page actuelle si nécessaire (par exemple, si la dernière page devient vide)
          if (
            currentPage > Math.ceil((projets.length - 1) / projetsPerPage) &&
            currentPage > 1
          ) {
            setCurrentPage(currentPage - 1);
          }
        } else {
          setError(result.message);
          toast.error(`Échec de la suppression: ${result.message}`); // Utilisation de toast
        }
      } catch (err: unknown) {
        console.error("Erreur lors de la suppression du projet:", err);
        setError(
          (err as Error).message ||
            "Erreur inconnue lors de la suppression du projet."
        );
        toast.error(
          `Erreur lors de la suppression: ${
            (err as Error).message || "Erreur inconnue."
          }`
        ); // Utilisation de toast
      } finally {
        setLoading(false);
      }
    },
    [projets, loadAllData, currentPage, projetsPerPage]
  ); // Dépendances pour `useCallback`

  // Fonction pour formater un montant en Franc CFA
  const formatCFA = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF", // Code ISO 4217 pour le Franc CFA Ouest-Africain
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calcul des KPIs basé sur tous les projets (pas seulement ceux de la page courante)
  const kpis = {
    totalProjets: serverPagination ? serverPagination.total : projets.length,
    projetsEnCours: projets.filter((p) => p.etat === "en_cours").length,
    projetsTermines: projets.filter((p) => p.etat === "terminé").length,
    projetsAnnules: projets.filter((p) => p.etat === "annulé").length,
    totalBudget: projets.reduce((sum, p) => sum + Number(p.devis_estimatif), 0),
    budgetMoyen:
      projets.length > 0
        ? projets.reduce((sum, p) => sum + Number(p.devis_estimatif), 0) /
          projets.length
        : 0,
  };

  // Fonction pour recharger manuellement les données
  const handleRefresh = () => {
    setCurrentPage(1); // Réinitialiser à la première page
    loadAllData();
  };

  // Fonction pour changer de page
  const handlePageChange = (page: number) => {
    console.log("=== DEBUG handlePageChange ===");
    console.log("Page demandée:", page);
    console.log("Page actuelle avant changement:", currentPage);
    setCurrentPage(page);
    console.log("setCurrentPage appelé avec:", page);
    // Recharger les données avec la nouvelle page
    loadAllData();
  };

  // Fonction pour recharger les données avec les filtres actuels
  const reloadData = () => {
    loadAllData();
  };

  // Gestionnaires pour les changements de filtres
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Réinitialiser à la première page
    // Recharger les données avec les nouveaux filtres
    reloadData();
  };

  const handleEtatChange = (value: string) => {
    setFilterEtat(value);
    setCurrentPage(1); // Réinitialiser à la première page
    // Recharger les données avec les nouveaux filtres
    reloadData();
  };

  const handlePartenaireChange = (value: number) => {
    setFilterPartenaire(value);
    setCurrentPage(1); // Réinitialiser à la première page
    // Recharger les données avec les nouveaux filtres
    reloadData();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord des Projets</h1>
          <p className="text-muted-foreground mt-2">
            Vue d'ensemble de vos projets techniques
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/technique/projets/liste")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Voir tous les projets
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          {/* Bouton de rapports temporairement désactivé */}
          {/* <Button variant="outline" onClick={() => navigate('/technique/projets/rapports')}>
              <BarChart3Icon className="mr-2 h-4 w-4" />
              Rapports
            </Button> */}
          <Button onClick={() => navigate("/technique/projets/nouveau")}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Projet
          </Button>
        </div>
      </div>

      {/* Section des KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProjetKPICard
          title="Total Projets"
          value={kpis.totalProjets}
          icon={<BarChart3 className="h-8 w-8 text-blue-500" />}
        />
        <ProjetKPICard
          title="Budget estimatif Total"
          value={formatCFA(kpis.totalBudget)}
          icon={
            <div className="flex items-center">
              <Coins className="h-5 w-5 text-green-500" />
            </div>
          }
        />
        <ProjetKPICard
          title="Projets en cours"
          value={kpis.projetsEnCours}
          icon={<Clock className="h-8 w-8 text-yellow-500" />}
        />
        <ProjetKPICard
          title="Projets terminés"
          value={kpis.projetsTermines}
          icon={<CheckCircle className="h-8 w-8 text-green-500" />}
        />
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            {error}
            <Button
              variant="ghost"
              onClick={handleRefresh}
              className="ml-2 px-2 py-1 h-auto text-sm"
            >
              <RefreshCcw className="h-3 w-3 mr-1" /> Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Section des projets récents */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tous les Projets</h2>
          <Button
            variant="outline"
            onClick={() => navigate("/technique/projets/liste")}
          >
            Voir la liste détaillée
          </Button>
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

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : currentProjets.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Aucun projet trouvé</p>
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
              projets={currentProjets}
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
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProjetsPage;
