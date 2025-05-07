import { MoyensDesTravailTable } from "../components/MoyensDesTravailTable";
import { useMoyensDeTravail } from "../hooks/moyens-de-travail/use-moyens-de-travail";

export function MoyensDesTravailPage() {
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
      <MoyensDesTravailTable
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
