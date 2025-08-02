import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Projet, Employe, Tache, TacheWithAssignedEmployes, Operation, EmployeResponse } from "../types/types";

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
    deleteTacheSafely, 
    assignEmployeToTache,
    removeEmployeFromTache,
    getEmployesAssignes 
} from "../tasks/api/taches";
import { fetchAllProjets } from "../projet/api/projets";
import { useEmployesApi } from "../projet/api/employes";
import { getOperationsByProjet } from "../operation/api/operation";
import { getTachesByOperation } from "../tasks/api/taches";
import { SquareKanban, Clock, Flag, Gauge } from "lucide-react"; 


const TachesPage = () => {
    const navigate = useNavigate();
    const [taches, setTaches] = useState<TacheWithAssignedEmployes[]>([]); 
    const [projets, setProjets] = useState<Projet[]>([]);
    const [employes, setEmployes] = useState<Employe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [operations, setOperations] = useState<Operation[]>([]);
    const { getEmployes } = useEmployesApi();
    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
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
                console.log('[TachesPage] Début du chargement des projets et employés');
                const [fetchedProjets, fetchedEmployes] = await Promise.all([
                    fetchAllProjets(),
                    getEmployes({limit: 100, page: 1}),
                ]);
                console.log('[TachesPage] Projets récupérés:', fetchedProjets);
                console.log('[TachesPage] Employés récupérés:', fetchedEmployes);

                let projetsArray: Projet[] = [];
                if (fetchedProjets.data && Array.isArray(fetchedProjets.data)) {
                    projetsArray = fetchedProjets.data;
                } else if (Array.isArray(fetchedProjets)) {
                    projetsArray = fetchedProjets;
                }

                setProjets(projetsArray);
                
                // Vérifier que fetchedEmployes est un tableau
                let employesArray: Employe[] = [];
                if (fetchedEmployes && Array.isArray(fetchedEmployes)) {
                    employesArray = fetchedEmployes;
                } else if (fetchedEmployes && typeof fetchedEmployes === 'object' && 'data' in fetchedEmployes && Array.isArray((fetchedEmployes as EmployeResponse).data)) {
                    employesArray = (fetchedEmployes as EmployeResponse).data;
                }
                setEmployes(employesArray);

                // Charger toutes les opérations de tous les projets
                const allOperations: Operation[] = [];
                const allBaseTaches: Tache[] = [];
                for (const projet of projetsArray) {
                    const operationsResponse = await getOperationsByProjet(projet.id_projet);
                    const ops = operationsResponse.data || [];
                    allOperations.push(...ops);
                    console.log(`[TachesPage] Opérations pour projet ${projet.id_projet}:`, ops);
                    for (const operation of ops) {
                        const tachesResponse = await getTachesByOperation(operation.id_operation);
                        if (tachesResponse.data && Array.isArray(tachesResponse.data)) {
                            allBaseTaches.push(...tachesResponse.data);
                        }
                        console.log(`[TachesPage] Tâches pour opération ${operation.id_operation}:`, tachesResponse.data);
                    }
                }
                setOperations(allOperations);
                console.log('[TachesPage] Toutes les opérations:', allOperations);
                console.log('[TachesPage] Toutes les tâches de base:', allBaseTaches);

                // Filtrage pour s'assurer que tache.id_tache est valide avant de récupérer les assignés
                const tachesWithAssigneesPromises = allBaseTaches
                    .filter(tache => 
                        tache &&
                        typeof tache.id_tache === 'number' &&
                        !isNaN(tache.id_tache)
                    )
                    .map(async (tache) => {
                        try {
                            const assignedEmployes = await getEmployesAssignes(tache.id_tache);
                            console.log(`[TachesPage] Employés assignés pour tâche ${tache.id_tache}:`, assignedEmployes);
                            return {
                                ...tache,
                                id_assigne_a: assignedEmployes,
                            } as TacheWithAssignedEmployes;
                        } catch (assigneeError) {
                            console.error(`[TachesPage] Erreur lors de la récupération des assignés pour la tâche ${tache.id_tache}:`, assigneeError);
                            return {
                                ...tache,
                                id_assigne_a: [],
                            } as TacheWithAssignedEmployes;
                        }
                    });

                const enrichedTaches = await Promise.all(tachesWithAssigneesPromises);
                setTaches(enrichedTaches);
                console.log('[TachesPage] Toutes les tâches enrichies:', enrichedTaches);

            } catch (err) {
                console.error('[TachesPage] Erreur lors du chargement des données initiales:', err);
                if (err instanceof Error) {
                    setError(`Impossible de charger les données: ${err.message}`);
                    toast.error(`Erreur de chargement des données: ${err.message}`);
                } else {
                    setError("Impossible de charger les données. Veuillez réessayer.");
                    toast.error("Erreur de chargement des données. Veuillez réessayer.");
                }
            } finally {
                setLoading(false);
                console.log('[TachesPage] Fin du chargement. loading:', loading, 'error:', error);
            }
        };
        loadAllData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    // Filtering Logic for the TacheTable
    const filteredTaches = useMemo(() => {
        return taches.filter(tache => {
            const matchesSearch =
                (tache.nom_tache || '').toLowerCase().includes(searchTerm.toLowerCase());
            // Plus de desc_tache, statut, priorite
            // Filtrage par projet via l'opération
            const matchesProjet = filterProjet === 0 || operations.some((op: Operation) => op.id_projet === filterProjet && tache.id_operation === op.id_operation);
            const matchesAssignee = filterAssignee === 0 ||
                (tache.id_assigne_a && tache.id_assigne_a.some(employe => employe.id_employes === filterAssignee));
            return matchesSearch && matchesProjet && matchesAssignee;
        });
    }, [taches, searchTerm, filterProjet, filterAssignee, operations]);

    // Pagination logic
    const indexOfLastTache = currentPage * tachesPerPage;
    const indexOfFirstTache = indexOfLastTache - tachesPerPage;
    const currentTaches = filteredTaches.slice(indexOfFirstTache, indexOfLastTache);
    const totalPages = Math.ceil(filteredTaches.length / tachesPerPage);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
        console.log('[TachesPage] Filtres changés. currentPage reset à 1');
    }, [searchTerm, filterProjet, filterAssignee]);

    // KPI Calculations (plus de statut/priorite)
    const kpiData = useMemo(() => {
        const tasksForKPIs = filterProjet === 0
            ? taches
            : taches.filter(tache => operations.some((op: Operation) => op.id_projet === filterProjet && tache.id_operation === op.id_operation));
        const totalTasks = tasksForKPIs.length;
        // Plus de tasksByStatus, completionRate, overdueTasks liés à statut/priorite
        return { totalTasks };
    }, [taches, filterProjet, operations]); 


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
        navigate(`/gestion-des-projets/projets/taches/${id}/editer`);
    };

    const handleViewTache = (id: number) => {
        navigate(`/gestion-des-projets/projets/taches/${id}`);
    };

    const handleAddTask = () => {
        navigate("/gestion-des-projets/projets/taches/nouvelle");
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
    const employesOptions = useMemo(() => {
        if (!Array.isArray(employes)) {
            return [{ id: 0, name: "Tous les employés" }];
        }
        return [
            { id: 0, name: "Tous les employés" },
            ...employes.map(e => ({
                id: e.id_employes,
                name: `${e.prenom_employes || ''} ${e.nom_employes || ''}`.trim() || `Employé #${e.id_employes}`
            }))
        ];
    }, [employes]);

    const clearFilters = () => {
        setSearchTerm("");
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
                                    value={kpiData.totalTasks}
                                    icon={<Clock className="h-8 w-8 text-yellow-500" />}
                                />
                                <TacheKPICard
                                    title="Taux d'Achèvement"
                                    value={`${kpiData.totalTasks} sur ${kpiData.totalTasks} terminées`}
                                    icon={<Gauge className="h-8 w-8 text-purple-500" />}
                                    subtext={`${kpiData.totalTasks} sur ${kpiData.totalTasks} terminées`}
                                />
                                <TacheKPICard
                                    title="Tâches en Retard"
                                    value={0}
                                    icon={<Flag className="h-8 w-8 text-red-500" />}
                                    subtext="À jour"
                                />
                            </>
                        )}
                    </div>

                    {/* Filters */}
                    <TacheFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
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
                                employes={employes}
                                operations={operations}
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
