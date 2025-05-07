import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCatalogSkeleton() {
  // Simuler un nombre de produits
  const skeletonItems = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {skeletonItems.map((item) => (
          <div key={item} className="border rounded-lg p-4">
            {/* Product Image Skeleton */}
            <Skeleton className="h-48 w-full mb-4" />

            {/* Product Title Skeleton */}
            <Skeleton className="h-6 w-full mb-2" />

            {/* Product Description Skeleton */}
            <Skeleton className="h-4 w-5/6 mb-1" />
            <Skeleton className="h-4 w-4/6 mb-4" />

            {/* Product Price Skeleton */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="mt-8 flex justify-center">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
