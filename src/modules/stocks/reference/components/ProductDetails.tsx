// src/modules/stocks/reference/components/ProductDetails.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ReferenceProduit as Produit } from "@/modules/stocks/types/reference";

const getStockStatus = (quantity: number | undefined) => {
  if (quantity === undefined)
    return { label: "Non défini", color: "text-gray-500" };
  if (quantity <= 0) return { label: "Épuisé", color: "text-red-600" };
  if (quantity <= 5)
    return { label: "Presque épuisé", color: "text-orange-600" };
  if (quantity <= 10)
    return { label: "Stock limité", color: "text-yellow-600" };
  return { label: "En stock", color: "text-green-600" };
};

export default function ProductDetails({ product }: { product?: Produit }) {
  const stock = getStockStatus(product?.qte_produit);

  return (
    <>
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <BarChart3 className="h-5 w-5 text-green-600" />
            État du stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p className="text-sm font-medium text-blue-600 mb-2">Quantité</p>
              <p className="text-3xl font-bold text-blue-700">
                {product?.qte_produit ?? "—"}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <p className="text-sm font-medium text-green-600 mb-2">Statut</p>
              <p className={`text-lg font-semibold ${stock.color}`}>
                {stock.label}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mt-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <Info className="h-5 w-5 text-purple-600" />
            Détails du produit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">Description</p>
            <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
              {product?.desc_produit ?? "Aucune description disponible"}
            </p>
          </div>
          <Separator className="bg-slate-200" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">
              Caractéristiques
            </p>
            <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
              {product?.caracteristiques ?? "Aucune caractéristique disponible"}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
