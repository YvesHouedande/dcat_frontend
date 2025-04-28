import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Exemplaire, Produit } from "../types/exemplaires";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface ExemplairesTableProps {
  exemplaires: Exemplaire[];
  produits: Produit[];
  onEdit: (exemplaire: Exemplaire) => void;
  onDelete: (id: string) => void;
  onSelectedChange: (ids: string[]) => void;
  selectedIds: string[];
}

export const ExemplairesTable = ({
  exemplaires,
  produits,
  onEdit,
  onDelete,
  onSelectedChange,
  selectedIds = [],
}: ExemplairesTableProps) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      onSelectedChange(exemplaires.map((ex) => ex.id_exemplaire));
    } else {
      onSelectedChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectedChange([...selectedIds, id]);
    } else {
      onSelectedChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
    setSelectAll(false);
  };

  const getProductName = (productId: string) => {
    const product = produits.find((p) => p.id_produit === productId);
    return product ? product.desi_produit : "Inconnu";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
          </TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Numéro de série</TableHead>
          <TableHead>Produit</TableHead>
          <TableHead>Prix</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Commande</TableHead>
          <TableHead>Livraison</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exemplaires.length > 0 ? (
          exemplaires.map((exemplaire) => (
            <TableRow key={exemplaire.id_exemplaire}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(exemplaire.id_exemplaire)}
                  onCheckedChange={(checked) =>
                    handleSelectOne(
                      exemplaire.id_exemplaire,
                      Boolean(checked)
                    )
                  }
                />
              </TableCell>
              <TableCell className="font-medium">
                {exemplaire.id_exemplaire}
              </TableCell>
              <TableCell>{exemplaire.num_serie}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{getProductName(exemplaire.id_produit)}</span>
                  <span className="text-xs text-gray-500">
                    {exemplaire.Code_produit}
                  </span>
                </div>
              </TableCell>
              <TableCell>{exemplaire.prix_exemplaire} €</TableCell>
              <TableCell>
                <Badge
                  variant={
                    exemplaire.etat_disponible_indisponible_ === "disponible"
                      ? "success"
                      : "destructive"
                  }
                >
                  {exemplaire.etat_disponible_indisponible_}
                </Badge>
              </TableCell>
              <TableCell>{exemplaire.Id_Commande || "-"}</TableCell>
              <TableCell>{exemplaire.id_livraison || "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(exemplaire)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(exemplaire.id_exemplaire)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4">
              Aucun exemplaire trouvé
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
