// src/components/MoyenDeTravailList.tsx
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { MoyenDeTravail } from '../types/moyenDeTravail';
  import { formatDate } from '../utils/dateUtils';
  import { Pencil, Trash } from 'lucide-react';
  
  interface MoyenDeTravailListProps {
    moyensDeTravail: MoyenDeTravail[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
  }
  
  export const MoyenDeTravailList = ({ 
    moyensDeTravail, 
    onEdit, 
    onDelete 
  }: MoyenDeTravailListProps) => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Dénomination</TableHead>
            <TableHead>Date d'acquisition</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {moyensDeTravail.map((moyen) => (
            <TableRow key={moyen.id_moyens_de_travail}>
              <TableCell>{moyen.id_moyens_de_travail}</TableCell>
              <TableCell>{moyen.denomination}</TableCell>
              <TableCell>{formatDate(moyen.date_acquisition)}</TableCell>
              <TableCell>{moyen.section}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(moyen.id_moyens_de_travail)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDelete(moyen.id_moyens_de_travail)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  