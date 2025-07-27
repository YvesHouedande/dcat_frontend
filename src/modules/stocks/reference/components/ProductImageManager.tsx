// src/modules/stocks/reference/components/ProductImageManager.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import { ImageProduit } from "@/modules/stocks/types/reference";

export default function ProductImageManager({
  images,
  productName,
}: {
  images?: ImageProduit[];
  productName?: string;
}) {
  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Package className="h-5 w-5 text-blue-600" />
          Galerie d'images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ImageCarousel images={images} productName={productName} />
      </CardContent>
    </Card>
  );
}
