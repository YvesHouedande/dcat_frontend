import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Partenaire } from "../types/types";

interface LivraisonTableProps {
  partenaires: Partenaire[];

  onDelete: (id: number) => void;
  onViewPartenaire?: (id: number) => void;
}

const LivraisonTable: React.FC<LivraisonTableProps> = () => {
  return (
    <div className="w-full overflow-hidden rounded-md border">
      {/* Table Desktop */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Reference</TableHead>
              <TableHead className="font-semibold">Frais Divers</TableHead>
              <TableHead className="font-semibold">Période d'achat</TableHead>
              <TableHead className="font-semibold">Prix d'achat</TableHead>
              <TableHead className="font-semibold">Prix de revient</TableHead>
              <TableHead className="font-semibold">Prix de vente</TableHead>
              <TableHead className="font-semibold">Partenaire</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody></TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LivraisonTable;
