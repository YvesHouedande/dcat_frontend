import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReferenceProduit } from "@/modules/stocks/types/reference";
import { useNavigate } from "react-router-dom";

interface ReferenceCarteProps {
  product: ReferenceProduit;
}
function ReferenceCarte({ product }: ReferenceCarteProps) {
  const navigate = useNavigate();
  return (
    <Card
      key={product.id_produit}
      className="overflow-hidden border rounded-md hover:shadow-md transition-shadow"
    >
      <div className="h-32 bg-gray-100 relative">
        <img
          src="/api/placeholder/400/300"
          alt={product.desi_produit}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-1 right-1 text-xs px-1 py-0 bg-blue-500">
          {product.Qte_produit}
        </Badge>
      </div>

      <CardHeader className="px-3 py-2">
        <CardTitle className="text-sm font-medium line-clamp-1">
          {product.desi_produit}
        </CardTitle>
        <p className="text-xs text-gray-500 mt-1">{product.Code_produit}</p>
      </CardHeader>

      <CardContent className="px-3 pb-3 pt-0">
        <div className="flex gap-1 flex-wrap mb-2">
          <Badge variant="outline" className="text-xs px-1 py-0">
            {product.emplacement}
          </Badge>
          <Badge variant="secondary" className="text-xs px-1 py-0">
            {product.type_produit}
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button
            onClick={() => {
              navigate(`${product.id_produit}`);
            }}
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2 flex-1 cursor-pointer"
          >
            Détails
          </Button>
          <Button size="sm" className="text-xs h-7 px-2 flex-1 cursor-pointer">
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReferenceCarte;
