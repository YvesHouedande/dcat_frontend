import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
  // Nombre de lignes et colonnes pour le skeleton
  const rowCount = 7;
  const columnCount = 5;

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Tableau */}
      <div className="w-full border rounded-md">
        {/* En-têtes de colonnes */}
        <div className="grid grid-cols-5 border-b bg-gray-50 p-3">
          {Array.from({ length: columnCount }, (_, i) => (
            <div key={`header-${i}`} className="px-2">
              <Skeleton className="h-6 w-full max-w-24" />
            </div>
          ))}
        </div>

        {/* Lignes du tableau */}
        {Array.from({ length: rowCount }, (_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`grid grid-cols-5 p-3 ${
              rowIndex !== rowCount - 1 ? "border-b" : ""
            }`}
          >
            {Array.from({ length: columnCount }, (_, colIndex) => (
              <div key={`cell-${rowIndex}-${colIndex}`} className="px-2">
                {/* Différentes largeurs pour les cellules pour plus de réalisme */}
                <Skeleton
                  className={`h-5 ${
                    colIndex === 0
                      ? "w-full max-w-28"
                      : colIndex === 1
                      ? "w-full max-w-32"
                      : colIndex === 4
                      ? "w-16"
                      : "w-full max-w-20"
                  }`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
