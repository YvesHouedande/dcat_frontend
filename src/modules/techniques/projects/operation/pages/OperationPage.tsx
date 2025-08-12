import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"; // Importez useNavigate
import { OperationHeader } from "../components/OperationHeader";
import { OperationKPICard } from "../components/OperationKPICard";
import { OperationFilters } from "../components/OperationFilters";
import { OperationTable } from "../components/OperationTable";
import OperationPagination from "../components/OperationPagination";
import OperationForm from "../components/OperationForm";
import { getAllOperations, createOperation, deleteOperationSimple } from "../api/operation";
import { fetchAllProjets } from "../../projet/api/projets";
import { Operation, Projet } from "../../types/types";
import { CheckCircle, Clock, AlertTriangle, CircleDashed } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteOperationConfirmationDialog } from "../components/DeleteOperationConfirmationDialog";

const OperationPage: React.FC = () => {
  const navigate = useNavigate(); // Initialisez useNavigate ici

  const [operations, setOperations] = useState<Operation[]>([]);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState<Operation["statut"] | "tous">("tous");
  const [filterProjet, setFilterProjet] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const operationsPerPage = 8;

  const [modalOpen, setModalOpen] = useState(false);

  // État pour le dialogue de confirmation de suppression
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    operationId: number | null;
    operationName: string;
  }>({
    isOpen: false,
    operationId: null,
    operationName: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [operationsRes, projetsRes] = await Promise.all([
          getAllOperations(),
          fetchAllProjets(),
        ]);
        // Vérifiez que operationsRes.data est bien un tableau avant de l'assigner
        setOperations(Array.isArray(operationsRes.data) ? operationsRes.data : []);
        setProjets(Array.isArray(projetsRes.data) ? projetsRes.data : []);
      } catch {
        toast.info("Les données ne sont pas disponibles pour le moment. Veuillez actualiser la page.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const projetsOptions = useMemo(() => [
    { id_projet: 0, nom_projet: "Tous les projets" },
    ...projets.map((p) => ({ id_projet: p.id_projet, nom_projet: p.nom_projet })),
  ], [projets]);

  const filteredOperations = useMemo(() => {
    return operations.filter((op) => {
      const matchesSearch =
        op.nom_operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (op.desc_operation && op.desc_operation.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatut = filterStatut === "tous" || op.statut === filterStatut;
      const matchesProjet = filterProjet === 0 || op.id_projet === filterProjet;
      return matchesSearch && matchesStatut && matchesProjet;
    });
  }, [operations, searchTerm, filterStatut, filterProjet]);

  const indexOfLast = currentPage * operationsPerPage;
  const indexOfFirst = indexOfLast - operationsPerPage;
  const currentOperations = filteredOperations.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOperations.length / operationsPerPage);

  const kpis = useMemo(() => {
    const total = operations.length;
    const byStatut: { [key: string]: number } = {
      planifié: 0,
      en_cours: 0,
      terminé: 0,
      annulé: 0,
    };
    const today = new Date();
    let overdue = 0;
    operations.forEach((op) => {
      if (op.statut in byStatut) byStatut[op.statut]++;
      if (op.date_fin && op.statut !== "terminé" && op.statut !== "annulé") {
        const fin = new Date(op.date_fin);
        if (fin < today) overdue++;
      }
    });
    return {
      total,
      planifie: byStatut["planifié"],
      enCours: byStatut["en_cours"],
      termine: byStatut["terminé"],
      annule: byStatut["annulé"],
      overdue,
    };
  }, [operations]);

  const handleAddOperation = () => setModalOpen(true);

  const handleCreateOperation = async (payload: Omit<Operation, "id_operation">) => {
    try {
      const created = await createOperation(payload);
      if (created) {
        setOperations((prev) => [created, ...prev]);
        setModalOpen(false);
        toast.success("Opération créée avec succès !");
      } else {
        toast.error("Erreur lors de la création de l'opération.");
      }
    } catch (err) {
      // Assurez-vous que l'erreur est de type Error avant d'accéder à .message
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue.";
      toast.error(`Erreur lors de la création de l'opération: ${errorMessage}`);
    }
  };

  // --- CORRECTION : Ajout des redirections ici ---
  const handleView = (id: number) => {
    // Redirection vers la page de détails de l'opération
    navigate(`/gestion-des-projets/projets/operations/${id}`);
    toast.info(`Navigation vers les détails de l'opération #${id}`);
  };

  const handleEdit = (id: number) => {
    // Redirection vers la page d'édition de l'opération
    navigate(`/gestion-des-projets/projets/operations/${id}/editer`);
    toast.info(`Navigation vers la page d'édition de l'opération #${id}`);
  };
  // --- FIN DES CORRECTIONS ---

  // Gestionnaire pour ouvrir le dialogue de confirmation
  const handleDeleteClick = (id: number) => {
    const operationToDelete = operations.find((op) => op.id_operation === id);
    if (!operationToDelete) {
      toast.info("Opération introuvable pour la suppression.");
      return;
    }
    setDeleteDialog({
      isOpen: true,
      operationId: id,
      operationName: operationToDelete.nom_operation,
    });
  };

  // Gestionnaire de suppression d'opération confirmée
  const handleDeleteConfirmed = async () => {
    if (!deleteDialog.operationId) return;
    
    try {
      const result = await deleteOperationSimple(deleteDialog.operationId);
      if (result.success) {
        setOperations((prev) => prev.filter((op) => op.id_operation !== deleteDialog.operationId));
        toast.success(`Opération "${deleteDialog.operationName}" supprimée avec succès !`);
      } else {
        toast.info(`Suppression non effectuée: ${result.message}`);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'opération:", err);
      toast.info(
        `Suppression non effectuée: ${
          err instanceof Error ? err.message : "Veuillez réessayer plus tard."
        }`
      );
    } finally {
      setDeleteDialog({ isOpen: false, operationId: null, operationName: "" });
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <OperationHeader onAddOperation={handleAddOperation} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <OperationKPICard
            title="Total opérations"
            value={kpis.total}
            icon={<CircleDashed className="h-5 w-5 text-blue-500" />}
          />
          <OperationKPICard
            title="En cours"
            value={kpis.enCours}
            icon={<Clock className="h-5 w-5 text-yellow-500" />}
          />
          <OperationKPICard
            title="Terminées"
            value={kpis.termine}
            icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          />
          <OperationKPICard
            title="En retard"
            value={kpis.overdue}
            icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          />
        </div>
        <OperationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatut={filterStatut}
          onFilterStatutChange={setFilterStatut}
          filterProjet={filterProjet}
          onFilterProjetChange={setFilterProjet}
          projetsOptions={projetsOptions}
          resultCount={filteredOperations.length}
        />
        {loading ? (
          <div className="space-y-4">
            {[...Array(operationsPerPage)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-lg text-red-600">{error}</div>
        ) : filteredOperations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucune opération trouvée pour les filtres actuels.</div>
        ) : (
          <>
            <OperationTable
              operations={currentOperations}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
            <OperationPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredOperations.length}
              itemsPerPage={operationsPerPage}
              className="mt-4"
            />
          </>
        )}

        {/* Dialogue de confirmation de suppression */}
        <DeleteOperationConfirmationDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, operationId: null, operationName: "" })}
          onConfirm={handleDeleteConfirmed}
          title="Confirmer la suppression"
          description={`Êtes-vous sûr de vouloir supprimer l'opération "${deleteDialog.operationName}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      </div>
      <Sheet open={modalOpen} onOpenChange={setModalOpen}>
        <SheetContent side="right" className="w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Nouvelle opération</h2>
          <OperationForm
            projetsDisponibles={projets.map(p => ({ id_projet: p.id_projet, nom_projet: p.nom_projet }))}
            onCreate={handleCreateOperation}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OperationPage;
