import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Projet, Employe, Tache, TacheWithAssignedEmployes } from "../types/types";

// Import components
import { TacheHeader } from "../tasks/components/TacheHeader";
import { TacheFilters } from "../tasks/components/TacheFilters";
import { TacheTable } from "../tasks/components/TacheTable";
import { TacheKPICard } from "../tasks/components/TacheKPICards";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ProjetPagination } from "../projet/components/ProjetPagination";

// Import API functions
import { 
    getTachesByProjet, 
    deleteTacheSafely, 
    assignEmployeToTache,
    removeEmployeFromTache,
    getEmployesAssignes 
} from "../tasks/api/taches";
import { fetchAllProjets } from "../projet/api/projets";
import { getEmployes } from "../projet/api/employes";

import { SquareKanban, Clock, Flag, Gauge } from "lucide-react"; 

const TachesPage = () => {
    const navigate = useNavigate();
    const [taches, setTaches] = useState<TacheWithAssignedEmployes[]>([]); 
    const [projets, setProjets] = useState<Projet[]>([]);
    const [employes, setEmployes] = useState<Employe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatut, setFilterStatut] = useState<Tache["statut"] | "tous">("tous");
    const [filterPriorite, setFilterPriorite] = useState<Tache["priorite"] | "toutes">("toutes");
    const [filterProjet, setFilterProjet] = useState<number>(0);
    const [filterAssignee, setFilterAssignee] = useState<number>(0);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const tachesPerPage = 10; // Nombre de tâches par page

    // Data Loading Effect
    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [fetchedProjets, fetchedEmployes] = await Promise.all([
                    fetchAllProjets(),
                    getEmployes(),
                ]);

                // Handle projets response - fetchAllProjets returns ApiResponse<Projet[]>
                let projetsArray: Projet[] = [];
                if (fetchedProjets.data && Array.isArray(fetchedProjets.data)) {
                    projetsArray = fetchedProjets.data;
                } else if (Array.isArray(fetchedProjets)) {
                    projetsArray = fetchedProjets;
                }

                setProjets(projetsArray);
                setEmployes(fetchedEmployes);

                let allBaseTaches: Tache[] = [];
                if (projetsArray.length > 0) {
                    const allTachesPromises = projetsArray.map(projet => 
                        getTachesByProjet(projet.id_projet)
                    );
                    // Attend toutes les réponses des API
                    const tachesResponses = await Promise.all(allTachesPromises);

                    // MODIFICATION CLÉ ICI : Extraire l'array 'data' de chaque réponse AVANT d'aplatir
                    allBaseTaches = tachesResponses.flatMap(response => {
                        // S'assurer que la réponse est un objet et qu'elle contient une propriété 'data' qui est un tableau
                        return (response && typeof response === 'object' && Array.isArray(response.data)) 
                               ? response.data 
                               : [];
                    });
                }
                
                // AJOUT POUR LE DIAGNOSTIC : Vérifier le contenu de allBaseTaches après extraction et aplatissement
                console.log("DEBUG: Tâches de base récupérées (après extraction et aplatissement):", allBaseTaches);

                // Filtrage pour s'assurer que tache.id_tache est valide avant de récupérer les assignés
                const tachesWithAssigneesPromises = allBaseTaches
                    .filter(tache => 
                        tache && // S'assurer que l'objet tache n'est pas null/undefined
                        typeof tache.id_tache === 'number' && // S'assurer que id_tache est un nombre
                        !isNaN(tache.id_tache) // S'assurer que le nombre n'est pas NaN
                    )
                    .map(async (tache) => {
                        try {
                            const assignedEmployes = await getEmployesAssignes(tache.id_tache);
                            return {
                                ...tache,
                                id_assigne_a: assignedEmployes,
                            } as TacheWithAssignedEmployes;
                        } catch (assigneeError) {
                            console.error(`Erreur lors de la récupération des assignés pour la tâche ${tache.id_tache}:`, assigneeError);
                            // En cas d'erreur pour une tâche spécifique, on retourne la tâche sans assignés (tableau vide)
                            // pour ne pas bloquer l'affichage des autres tâches.
                            return {
                                ...tache,
                                id_assigne_a: [],
                            } as TacheWithAssignedEmployes;
                        }
                    });

                const enrichedTaches = await Promise.all(tachesWithAssigneesPromises);
                setTaches(enrichedTaches);

            } catch (err) {
                console.error("Erreur lors du chargement des données initiales:", err);
                if (err instanceof Error) {
                    setError(`Impossible de charger les données: ${err.message}`);
                    toast.error(`Erreur de chargement des données: ${err.message}`);
                } else {
                    setError("Impossible de charger les données. Veuillez réessayer.");
                    toast.error("Erreur de chargement des données. Veuillez réessayer.");
                }
            } finally {
                setLoading(false);
            }
        };
        loadAllData();
    }, []); 

    // Filtering Logic for the TacheTable
    const filteredTaches = useMemo(() => {
        return taches.filter(tache => {
            const matchesSearch =
                (tache.nom_tache || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (tache.desc_tache || '').toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatut = filterStatut === "tous" || tache.statut === filterStatut;
            
            const matchesPriorite = filterPriorite === "toutes" || 
            (tache.priorite && tache.priorite.toLowerCase() === filterPriorite.toLowerCase());
            
            const matchesProjet = filterProjet === 0 || tache.id_projet === filterProjet;
            
            const matchesAssignee = filterAssignee === 0 || 
                (tache.id_assigne_a && tache.id_assigne_a.some(employe => employe.id_employes === filterAssignee));

            return matchesSearch && matchesStatut && matchesPriorite && matchesProjet && matchesAssignee;
        });
    }, [taches, searchTerm, filterStatut, filterPriorite, filterProjet, filterAssignee]);

    // Pagination logic
    const indexOfLastTache = currentPage * tachesPerPage;
    const indexOfFirstTache = indexOfLastTache - tachesPerPage;
    const currentTaches = filteredTaches.slice(indexOfFirstTache, indexOfLastTache);
    const totalPages = Math.ceil(filteredTaches.length / tachesPerPage);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatut, filterPriorite, filterProjet, filterAssignee]);

    // KPI Calculations (NOW PROJECT-SPECIFIC)
    const kpiData = useMemo(() => {
        // Sélectionne les tâches pertinentes pour le KPI, filtrées par projet
        const tasksForKPIs = filterProjet === 0
            ? taches // Si 'Tous les projets' est sélectionné, utilise toutes les tâches
            : taches.filter(tache => tache.id_projet === filterProjet);

        const totalTasks = tasksForKPIs.length;
        const tasksByStatus = {
            "à faire": tasksForKPIs.filter(t => t.statut === "à faire").length,
            "en cours": tasksForKPIs.filter(t => t.statut === "en cours").length,
            "en revue": tasksForKPIs.filter(t => t.statut === "en revue").length,
            "terminé": tasksForKPIs.filter(t => t.statut === "terminé").length,
            "bloqué": tasksForKPIs.filter(t => t.statut === "bloqué").length,
        };
        const overdueTasks = tasksForKPIs.filter(tache =>
            tache.date_fin && new Date(tache.date_fin) < new Date() && tache.statut !== "terminé"
        ).length;

        const completedTasks = tasksByStatus["terminé"];
        const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : "0.0";

        return { totalTasks, tasksByStatus, overdueTasks, completionRate };
    }, [taches, filterProjet]); 


    // Action Handlers
    const handleDeleteTache = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
            try {
                await deleteTacheSafely(id);
                setTaches((prev) => prev.filter((t) => t.id_tache !== id));
                toast.success("Tâche supprimée avec succès !");
            } catch (err) {
                console.error("Erreur lors de la suppression de la tâche:", err);
                if (err instanceof Error) {
                    toast.error(`Échec de la suppression: ${err.message}`);
                } else {
                    toast.error("Échec de la suppression de la tâche. Veuillez réessayer.");
                }
            }
        }
    };

    const handleEditTache = (id: number) => {
        navigate(`/technique/projets/taches/${id}/editer`);
    };

    const handleViewTache = (id: number) => {
        navigate(`/technique/projets/taches/${id}/details`);
    };

    const handleAddTask = () => {
        navigate("/technique/projets/taches/nouvelle");
    };

    // Handler pour assigner un employé
    const handleAssignEmployeToTache = async (tacheId: number, employeId: number) => {
        try {
            await assignEmployeToTache(tacheId, employeId); 
            
            const employeToAssign = employes.find(e => e.id_employes === employeId);
            if (employeToAssign) {
                setTaches(prevTaches => prevTaches.map(tache => {
                    if (tache.id_tache === tacheId) {
                        const isAlreadyAssigned = tache.id_assigne_a?.some(emp => emp.id_employes === employeId);
                        if (!isAlreadyAssigned) {
                            return { 
                                ...tache, 
                                id_assigne_a: [...(tache.id_assigne_a || []), employeToAssign] 
                            } as TacheWithAssignedEmployes;
                        }
                    }
                    return tache;
                }));
            }
            
            const employeName = employeToAssign 
                ? `${employeToAssign.prenom_employes || ''} ${employeToAssign.nom_employes || ''}`.trim() 
                : `Employé #${employeId}`;
            
            toast.success(`Tâche assignée à ${employeName} avec succès !`);
        } catch (err) {
            console.error("Erreur lors de l'assignation de la tâche:", err);
            if (err instanceof Error) {
                toast.error(`Échec de l'assignation: ${err.message}`);
            } else {
                toast.error("Échec de l'assignation de la tâche. Veuillez réessayer.");
            }
        }
    };

    // Handler pour désassigner un employé
    const handleUnassignEmployeFromTache = async (tacheId: number, employeId: number) => {
        try {
            await removeEmployeFromTache(tacheId, employeId); 
            
            setTaches(prevTaches => prevTaches.map(tache => {
                if (tache.id_tache === tacheId) {
                    return {
                        ...tache,
                        id_assigne_a: (tache.id_assigne_a || []).filter(emp => emp.id_employes !== employeId)
                    } as TacheWithAssignedEmployes;
                }
                return tache;
            }));
            
            const employe = employes.find(e => e.id_employes === employeId);
            const employeName = employe 
                ? `${employe.prenom_employes || ''} ${employe.nom_employes || ''}`.trim() 
                : `Employé #${employeId}`;
            
            toast.success(`${employeName} désassigné avec succès !`);
        } catch (err) {
            console.error("Erreur lors de la désassignation:", err);
            if (err instanceof Error) {
                toast.error(`Échec de la désassignation: ${err.message}`);
            } else {
                toast.error("Échec de la désassignation. Veuillez réessayer.");
            }
        }
    };

    // Options for project filter
    const projetsOptions = useMemo(() => ([
        { id: 0, name: "Tous les projets" },
        ...projets.map(p => ({ id: p.id_projet, name: p.nom_projet }))
    ]), [projets]);

    // Options for employee filter
    const employesOptions = useMemo(() => ([
        { id: 0, name: "Tous les employés" },
        ...employes.map(e => ({
            id: e.id_employes,
            name: `${e.prenom_employes || ''} ${e.nom_employes || ''}`.trim() || `Employé #${e.id_employes}`
        }))
    ]), [employes]);

    const clearFilters = () => {
        setSearchTerm("");
        setFilterStatut("tous");
        setFilterPriorite("toutes");
        setFilterProjet(0);
        setFilterAssignee(0);
    };

    return (
        
            <div className="p-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <TacheHeader onAddTask={handleAddTask} />

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {loading ? (
                            <>
                                <Skeleton className="h-[100px] w-full" />
                                <Skeleton className="h-[100px] w-full" />
                                <Skeleton className="h-[100px] w-full" />
                                <Skeleton className="h-[100px] w-full" />
                            </>
                        ) : (
                            <>
                                <TacheKPICard
                                    title="Total des Tâches"
                                    value={kpiData.totalTasks}
                                    icon={<SquareKanban className="h-8 w-8 text-blue-500" />}
                                />
                                <TacheKPICard
                                    title="Tâches en Cours"
                                    value={kpiData.tasksByStatus["en cours"]}
                                    icon={<Clock className="h-8 w-8 text-yellow-500" />}
                                />
                                <TacheKPICard
                                    title="Taux d'Achèvement"
                                    value={`${kpiData.completionRate}%`}
                                    icon={<Gauge className="h-8 w-8 text-purple-500" />}
                                    subtext={`${kpiData.tasksByStatus["terminé"]} sur ${kpiData.totalTasks} terminées`}
                                />
                                <TacheKPICard
                                    title="Tâches en Retard"
                                    value={kpiData.overdueTasks}
                                    icon={<Flag className="h-8 w-8 text-red-500" />}
                                    subtext={kpiData.overdueTasks > 0 ? "Action requise !" : "À jour"}
                                />
                            </>
                        )}
                    </div>

                    {/* Filters */}
                    <TacheFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterStatut={filterStatut}
                        onFilterStatutChange={setFilterStatut}
                        filterPriorite={filterPriorite}
                        onFilterPrioriteChange={setFilterPriorite}
                        filterProjet={filterProjet}
                        onFilterProjetChange={setFilterProjet}
                        filterAssignee={filterAssignee}
                        onFilterAssigneeChange={setFilterAssignee}
                        projetsOptions={projetsOptions}
                        employesOptions={employesOptions}
                        resultCount={filteredTaches.length}
                    />

                    {/* Main Content (Table or No Results) */}
                    {loading ? (
                        <div className="space-y-4 mt-6">
                            {[...Array(8)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-600">
                            <p>{error}</p>
                        </div>
                    ) : filteredTaches.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Aucune tâche trouvée.</p>
                            <button
                                className="mt-4 text-sm text-blue-600 hover:text-blue-800"
                                onClick={clearFilters}
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    ) : (
                        <>
                            <TacheTable
                                taches={currentTaches}
                                onDelete={handleDeleteTache}
                                onView={handleViewTache}
                                onEdit={handleEditTache}
                                onAssign={handleAssignEmployeToTache}
                                onUnassign={handleUnassignEmployeFromTache} 
                                projets={projets}
                                employes={employes} 
                            />
                            <ProjetPagination 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalItems={filteredTaches.length}
                                itemsPerPage={tachesPerPage}
                                className="mt-4"
                            />
                        </>
                    )}
                </div>
            </div>
    );
};

export default TachesPage;