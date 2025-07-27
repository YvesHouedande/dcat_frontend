import { MaintenanceTable } from "../components/MaintenanceTable";
import { useMoyensDeTravail } from "../hooks/moyens-de-travail/use-maintenance";

export function MaintenancePage() {
  const {
    moyens,
    pagination,
    filters,
    updateFilters,
    sections,
    isLoading,
    isError,
    error,
    createMoyen,
    updateMoyen,
    deleteMoyen,
    isSubmitting,
  } = useMoyensDeTravail();

  return (
    <div className="container py-6">
      <MaintenanceTable
        moyens={moyens}
        sections={sections}
        filters={filters}
        pagination={pagination}
        isLoading={isLoading}
        isError={isError}
        error={error}
        isSubmitting={isSubmitting}
        updateFilters={updateFilters}
        createMoyen={createMoyen}
        updateMoyen={updateMoyen}
        deleteMoyen={deleteMoyen}
      />
    </div>
  );
}
