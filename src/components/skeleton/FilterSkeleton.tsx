import { Skeleton } from "@/components/ui/skeleton";

function FilterSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-4 mb-8">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export default FilterSkeleton;
