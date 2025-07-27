// src/modules/stocks/reference/components/ProductClassification.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, MapPin } from "lucide-react";
import { ReferenceProduit as Produit } from "@/modules/stocks/types/reference";

export default function ProductClassification({
  product,
}: {
  product?: Produit;
}) {
  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Tag className="h-5 w-5 text-orange-600" />
          Classifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {[
            ["Catégorie", product?.categorie],
            ["Modèle", product?.modele],
            ["Marque", product?.marque],
            ["Famille", product?.famille],
            ["Type", product?.type_produit],
            ["Emplacement", product?.emplacement_produit],
          ].map(([label, value], idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {label}
              </p>
              <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg flex items-center gap-1">
                {label === "Emplacement" && (
                  <MapPin className="h-3 w-3 text-slate-400" />
                )}
                {value ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
