// src/pages/LivrablesPage.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Import toast for messages

// Importez vos types
import { Livrable, Projet, ApiResponse } from "../types/types";

// Importez les composants nécessaires pour les livrables
import { LivrableHeader } from "./components/LivrableHeader";
import { LivrableKPICard } from "./components/LivrableKPICard"; // Vous devrez créer ce composant
import { LivrableFilters } from "./components/LivrableFilters";
import { LivrableTable } from "./components/LivrableTable";
import { LivrablePagination } from "./components/LivrablePagination"; // Vous devrez créer ce composant de pagination

// Importez les fonctions API réelles pour les livrables et projets
import {
  getAllLivrables, // Renommé de fetchAllLivrables pour correspondre à notre API
  deleteLivrable,
} from "./api/livrables";
import { fetchAllProjets } from "../projet/api/projets"; // Chemin correct pour l'API des projets

// Import des icônes pour les KPIs
import { Skeleton } from "@/components/ui/skeleton"; // Pour l'état de chargement
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  CircleDashed, // Nouvelle icône pour Total Livrables (ou toute autre icône pertinente)
} from 'lucide-react'; // Assurez-vous d'avoir Lucide React installé

const LivrablesPage: React.FC = () => {
  const navigate = useNavigate();

  // --- États pour les données et le chargement ---
  const [livrables, setLivrables] = useState<Livrable[]>([]);
  const [projets, setProjets] = useState<Projet[]>([]); // Pour les filtres et l'affichage
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- États pour les filtres et la pagination ---
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterApprobation, setFilterApprobation] = useState<Livrable["approbation"] | "tous">("tous");
  const [filterProjet, setFilterProjet] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const livrablesPerPage = 8; // Nombre de livrables par page, comme pour les projets

  // --- Chargement initial des données ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Appels aux fonctions API réelles
        const [livrablesResponse, projetsResponseRaw] = await Promise.all([
          getAllLivrables(), // Retourne Promise<ApiResponse<Livrable[]>>
          fetchAllProjets(), // Retourne Promise<ApiResponse<Projet[]>> ou Promise<Projet[]>
        ]);

        // Extraction des livrables
        if (Array.isArray(livrablesResponse)) {
          setLivrables(livrablesResponse);
          console.log("[LivrablesPage] Livrables récupérés:", livrablesResponse);
        } else {
          console.warn("[LivrablesPage] Structure de réponse livrables inattendue:", livrablesResponse);
          setLivrables([]); // S'assure que c'est un tableau vide en cas de structure inattendue
          toast.warning("Impossible de charger les livrables. Structure de réponse inattendue.");
        }


        // Extraction des projets (logique copiée de EditerLivrablePage pour robustesse)
        let projectsToSet: Projet[] = [];
        if (projetsResponseRaw && typeof projetsResponseRaw === 'object' && ('data' in projetsResponseRaw || 'success' in projetsResponseRaw)) {
          const apiResponse = projetsResponseRaw as ApiResponse<Projet[]>; 
          if (apiResponse.data && Array.isArray(apiResponse.data)) {
            projectsToSet = apiResponse.data;
            console.log("[LivrablesPage] Projets récupérés via ApiResponse.data:", projectsToSet);
          } else {
            console.warn("Structure d'ApiResponse inattendue pour la récupération des projets, données manquantes:", projetsResponseRaw);
            toast.warning("Impossible de charger les projets. Données de l'API inattendues.");
          }
        } else if (Array.isArray(projetsResponseRaw)) {
          projectsToSet = projetsResponseRaw;
          console.log("[LivrablesPage] Projets récupérés directement sous forme de tableau:", projectsToSet);
        } else {
          console.warn("Structure de réponse inattendue pour la récupération des projets: ni ApiResponse ni un tableau direct.", projetsResponseRaw);
          toast.warning("Impossible de charger les projets. Structure de réponse inattendue.");
        }
        setProjets(projectsToSet);

      } catch (err) {
        console.error("Erreur lors du chargement des données des livrables :", err);
        setError("Impossible de charger les livrables. Veuillez réessayer.");
        toast.error("Erreur de chargement: " + (err instanceof Error ? err.message : "Erreur inconnue"));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); // [] pour un chargement au montage uniquement

  // Prépare les options de projets pour le filtre
  const projetsOptionsWithNames = useMemo(() => {
    return [
      { id_projet: 0, nom_projet: "Tous les projets" }, // Option "Tous"
      ...projets.map(p => ({ id_projet: p.id_projet, nom_projet: p.nom_projet }))
    ];
  }, [projets]);

  // --- Logique de filtrage des livrables ---
  const filteredLivrables = useMemo(() => {
    return livrables.filter(livrable => {
      const matchesSearch =
        livrable.libelle_livrable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (livrable.realisations && livrable.realisations.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (livrable.reserves && livrable.reserves.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesApprobation = filterApprobation === "tous" || livrable.approbation === filterApprobation;
      const matchesProjet = filterProjet === 0 || livrable.id_projet === filterProjet;

      return matchesSearch && matchesApprobation && matchesProjet;
    });
  }, [livrables, searchTerm, filterApprobation, filterProjet]);

  // --- Pagination ---
  const indexOfLastLivrable = currentPage * livrablesPerPage;
  const indexOfFirstLivrable = indexOfLastLivrable - livrablesPerPage;
  const currentLivrables = filteredLivrables.slice(indexOfFirstLivrable, indexOfLastLivrable);
  const totalPages = Math.ceil(filteredLivrables.length / livrablesPerPage);

  // --- Suppression d'un livrable ---
  const handleDelete = async (id: number) => {
    // Utilisation de toast.promise pour la confirmation et le feedback asynchrone
    toast.promise(
      async () => {
        await deleteLivrable(id); // Appel à la fonction de suppression réelle
        setLivrables(prev => prev.filter(livrable => livrable.id_livrable !== id));
        return "Livrable supprimé avec succès !";
      },
      {
        loading: "Suppression du livrable...",
        success: (message) => message,
        error: (err) => {
          console.error("Erreur lors de la suppression du livrable :", err);
          return "Échec de la suppression du livrable.";
        },
        // Optionnel: ajouter une confirmation plus explicite avant l'action
        // Si vous voulez un dialogue de confirmation explicite, vous devrez implémenter un modal séparé.
        // Pour l'instant, toast.promise gère un chargement puis un succès/échec.
      }
    );
  };

  // --- Calcul des KPIs pour les Livrables (utiliser useMemo pour optimiser) ---
  const kpis = useMemo(() => {
    const totalLivrables = livrables.length;
    const livrablesByApprobation: { [key: string]: number } = {
      "en attente": 0,
      "approuvé": 0,
      "rejeté": 0,
      "révisions requises": 0,
    };
    let overdueLivrables = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer seulement les dates

    livrables.forEach(livrable => {
      // KPI par statut d'approbation
      if (livrable.approbation in livrablesByApprobation) {
        livrablesByApprobation[livrable.approbation]++;
      }
      // Livrables en retard (basé sur la date et le statut d'approbation)
      if (livrable.date && livrable.approbation !== "approuvé" && livrable.approbation !== "rejeté") {
        const livrableDate = new Date(livrable.date);
        livrableDate.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer seulement les dates

        if (livrableDate < today) {
          overdueLivrables++;
        }
      }
    });

    return {
      totalLivrables,
      livrablesApprouves: livrablesByApprobation["approuvé"],
      livrablesEnAttente: livrablesByApprobation["en attente"],
      livrablesRejetes: livrablesByApprobation["rejeté"],
      livrablesRevisionsRequises: livrablesByApprobation["révisions requises"],
      overdueLivrables,
    };
  }, [livrables]);

  return (


      <div className="p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header pour la page Livrables */}
          <LivrableHeader onAddLivrable={() => navigate("/technique/projets/livrables/nouveau")} />

          {/* Cartes KPI pour les Livrables */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <LivrableKPICard
              title="Total Livrables"
              value={kpis.totalLivrables}
              icon={<CircleDashed className="h-5 w-5 text-blue-500" />} // Exemple d'icône
            />
            <LivrableKPICard
              title="Approuvés"
              value={kpis.livrablesApprouves}
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            />
            <LivrableKPICard
              title="En attente"
              value={kpis.livrablesEnAttente}
              icon={<Clock className="h-5 w-5 text-yellow-500" />}
            />
            <LivrableKPICard
              title="En retard"
              value={kpis.overdueLivrables}
              icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
            />
          </div>

          {/* Filtres */}
          <LivrableFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterApprobation={filterApprobation}
            onFilterApprobationChange={setFilterApprobation}
            filterProjet={filterProjet}
            onFilterProjetChange={setFilterProjet}
            projetsOptions={projetsOptionsWithNames}
            resultCount={filteredLivrables.length}
          />

          {/* Contenu principal : Table des livrables ou message de chargement/erreur/vide */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(livrablesPerPage)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 text-lg text-red-600">
              {error}
            </div>
          ) : filteredLivrables.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun livrable trouvé pour les filtres actuels.
            </div>
          ) : (
            <>
              <LivrableTable
                livrables={currentLivrables}
                onDelete={handleDelete}
                onEdit={(id) => navigate(`/technique/projets/livrables/${id}/editer`)}
                onView={(id) => navigate(`/technique/projets/livrables/${id}/details`)}
                projets={projets} // Passez les projets pour mapper les noms
              />
              <LivrablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredLivrables.length}
                itemsPerPage={livrablesPerPage}
                className="mt-4"
              />
            </>
          )}
        </div>
      </div>

  );
};

export default LivrablesPage;