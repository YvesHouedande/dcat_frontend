import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Intervention } from '../interface/interface';
import { getInterventions } from '../api/intervention';

interface InterventionsListProps {
  onDelete: (intervention: Intervention) => void;
}

export const InterventionsList: React.FC<InterventionsListProps> = ({
  onDelete,
}) => {
  const navigate = useNavigate();
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');

  const loadInterventions = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getInterventions(page, 10);
      setInterventions(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Erreur lors du chargement des interventions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInterventions(currentPage);
  }, [currentPage]);

  const handleView = (intervention: Intervention) => {
    navigate(`/technique/interventions/${intervention.id_intervention}`);
  };

  const handleEdit = (intervention: Intervention) => {
    navigate(`/technique/interventions/${intervention.id_intervention}/edit`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    return pages;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-64"
          />
          <Select value={filterType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Type d'intervention" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="Corrective">Corrective</SelectItem>
              <SelectItem value="Préventive">Préventive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Problème signalé</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : interventions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Aucune intervention trouvée
                </TableCell>
              </TableRow>
            ) : (
              interventions.map((intervention) => (
                <TableRow key={intervention.id_intervention}>
                  <TableCell>
                    {format(new Date(intervention.date_intervention), 'dd/MM/yyyy', {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell>{intervention.type_intervention}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {intervention.probleme_signale}
                  </TableCell>
                  <TableCell>{intervention.lieu}</TableCell>
                  <TableCell>{intervention.duree}</TableCell>
                  <TableCell>{intervention.statut_intervention}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(intervention)}
                      >
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(intervention)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(intervention)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
            />
          </PaginationItem>
          {renderPagination()}
          <PaginationItem>
            <PaginationNext
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              onClick={() => currentPage < totalPages && setCurrentPage((prev) => prev + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}; 