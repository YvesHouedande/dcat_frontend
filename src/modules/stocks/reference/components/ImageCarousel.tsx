// src/modules/stocks/reference/components/ImageCarousel.tsx
import { useState } from "react";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { ImageProduit } from "@/modules/stocks/types/reference";

export default function ImageCarousel({
  images,
  productName,
}: {
  images?: ImageProduit[];
  productName?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 group hover:border-slate-300 transition-all duration-300">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center shadow-lg">
            <Package className="w-10 h-10 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Aucune image</p>
            <p className="text-xs text-slate-400">Image non disponible</p>
          </div>
        </div>
      </div>
    );
  }

  const nextImage = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prevImage = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  const goToImage = (i: number) => setCurrentIndex(i);

  return (
    <div className="space-y-4">
      <div className="relative group">
        <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-lg">
          <img
            src={images[currentIndex]?.url}
            alt={`${productName ?? "Produit"} - Image ${currentIndex + 1}`}
            className="w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl" />
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 rounded-full p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-white/20">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 rounded-full p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-white/20">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      <div className="flex justify-center space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToImage(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-blue-600 scale-125 shadow-lg" : "bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => goToImage(i)}
            className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
              i === currentIndex ? "border-blue-600 ring-2 ring-blue-200 shadow-lg" : "border-slate-200 hover:border-slate-400"
            }`}
          >
            <img src={img.url} alt={`Miniature ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
