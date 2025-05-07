import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReferenceProduit } from "@/modules/stocks/types/reference";
import { useNavigate } from "react-router-dom";
import { ProductInstanceForm } from "@/modules/stocks/exemplaire";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExemplaireSortieForm } from "@/modules/stocks/sorties/components/ExemplaireSortieForm";
import { ExemplaireSortieFormValues } from "@/modules/stocks/sorties/schemas/exemplaireSortieSchema";
import { useExemplaireSorties } from "@/modules/stocks/sorties/hooks/useExemplaireSorties";
interface ReferenceCarteProps {
  product: ReferenceProduit;
}
function ReferenceCarte({ product }: ReferenceCarteProps) {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormSortieOpen, setIsSortieFormOpen] = useState(false);
  const closeForm = () => {
    setIsFormOpen(false);
  };
  const closeSortieForm = () => {
    setIsSortieFormOpen(false);
  };
  const formRef = useRef<any>(null);
  const handleFormSuccess = () => {
    toast.success(
      `Exemplaire "${formRef.current.getValues(
        "num_serie"
      )}" ajouté avec succès`,
      {
        duration: 2000,
      }
    );
    formRef.current.setValue("num_serie", "");
  };
  const { createExemplaireSortie } = useExemplaireSorties();
  const handleSubmit = async (data: ExemplaireSortieFormValues) => {
    await createExemplaireSortie(data);
    closeForm();
  };
  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un exemplaire</DialogTitle>
          </DialogHeader>
          <ProductInstanceForm
            initialData={{
              id_produit: String(product.id_produit),
            }}
            ref={formRef}
            onCancel={closeForm}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isFormSortieOpen} onOpenChange={setIsSortieFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter une sortie de produit</DialogTitle>
          </DialogHeader>
          <ExemplaireSortieForm
            onSubmit={handleSubmit}
            onCancel={closeSortieForm}
            defaultValues={{
              id_sortie_exemplaire: 0,
              type_sortie: "",
              reference_id: "",
              date_sortie: new Date().toISOString().split("T")[0],
              quantite: 1,
              id_produit: Number(product.id_produit),
            }}
            isEditMode={false}
          />
        </DialogContent>
      </Dialog>

      <Card
        key={product.id_produit}
        className="overflow-hidden border rounded-md hover:shadow-lg hover:scale-105 transition duration-300  hover:cursor-pointer"
        onClick={() => {
          navigate(`${product.id_produit}`);
        }}
      >
        <div className="h-32 bg-gray-100 relative">
          <img
            src="/api/placeholder/400/300"
            alt={product.desi_produit}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-1 right-1 text-xs px-1 py-0 bg-blue-500">
            {product.qte_produit}
          </Badge>
        </div>

        <CardHeader className="px-3 py-2">
          <CardTitle className="text-sm font-medium line-clamp-1">
            {product.desi_produit}
          </CardTitle>
          <p className="text-xs text-gray-500 mt-1">{product.code_produit}</p>
        </CardHeader>

        <CardContent className="px-3 pb-3 pt-0">
          <div className="flex gap-1 flex-wrap mb-2">
            <Badge variant="outline" className="text-xs px-1 py-0">
              {product.emplacement}
            </Badge>
            <Badge variant="secondary" className="text-xs px-1 py-0">
              {product.id_type_produit}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsSortieFormOpen(true);
              }}
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 flex-1 cursor-pointer"
            >
              Sortie
            </Button>
            <Button
              size="sm"
              className="text-xs h-7 px-2 flex-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsFormOpen(true);
              }}
            >
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default ReferenceCarte;
