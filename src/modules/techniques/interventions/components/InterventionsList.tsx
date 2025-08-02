import React, { useEffect, useState, useMemo } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Intervention } from '../interface/interface';
import { getInterventions } from '../api/intervention';
import { Search, X } from 'lucide-react';

interface InterventionsListProps {
  onDelete: (intervention: Intervention) => void;
}

export const InterventionsList: React.FC<InterventionsListProps> = ({
  onDelete,
}) => {
  const navigate = useNavigate();
  const [allInterventions, setAllInterventions] = useState<Intervention[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDefaillance, setFilterDefaillance] = useState<string>('');
  const itemsPerPage = 10;

  const loadInterventions = async () => {
    setIsLoading(true);
    try {
      // Charger toutes les interventions pour permettre le filtrage local
      const response = await getInterventions(1, 1000); // Charger beaucoup d'interventions
      setAllInterventions(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des interventions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInterventions();
  }, []);

  // Filtrage des interventions
  const filteredInterventions = useMemo(() => {
    let filtered = allInterventions;

    // Filtre par recherche textuelle
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((intervention) =>
        intervention.probleme_signale?.toLowerCase().includes(searchLower) ||
        intervention.lieu?.toLowerCase().includes(searchLower) ||
        intervention.rapport_intervention?.toLowerCase().includes(searchLower) ||
        intervention.type_intervention?.toLowerCase().includes(searchLower) ||
        intervention.type_defaillance?.toLowerCase().includes(searchLower) ||
        intervention.cause_defaillance?.toLowerCase().includes(searchLower) ||
        intervention.statut_intervention?.toLowerCase().includes(searchLower)
      );
    }

    // Filtre par type d'intervention
    if (filterType && filterType !== 'all') {
      filtered = filtered.filter((intervention) =>
        intervention.type_intervention === filterType
      );
    }

    // Filtre par statut
    if (filterStatus && filterStatus !== 'all') {
      filtered = filtered.filter((intervention) =>
        intervention.statut_intervention === filterStatus
      );
    }

    // Filtre par type de défaillance
    if (filterDefaillance && filterDefaillance !== 'all') {
      filtered = filtered.filter((intervention) =>
        intervention.type_defaillance === filterDefaillance
      );
    }

    return filtered;
  }, [allInterventions, searchTerm, filterType, filterStatus, filterDefaillance]);

  // Pagination des interventions filtrées
  const totalPages = Math.ceil(filteredInterventions.length / itemsPerPage);
  const paginatedInterventions = filteredInterventions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Réinitialiser la page courante quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterStatus, filterDefaillance]);

  const handleView = (intervention: Intervention) => {
    navigate(`/gestion-des-interventions/interventions/${intervention.id_intervention}`);
  };

  const handleEdit = (intervention: Intervention) => {
    navigate(`/gestion-des-interventions/interventions/${intervention.id_intervention}/edit`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeChange = (value: string) => {
    setFilterType(value);
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
  };

  const handleDefaillanceChange = (value: string) => {
    setFilterDefaillance(value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('');
    setFilterDefaillance('');
  };

  const hasActiveFilters = searchTerm || (filterType && filterType !== 'all') || (filterStatus && filterStatus !== 'all') || (filterDefaillance && filterDefaillance !== 'all');

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "terminé":
      case "completed":
        return "default";
      case "en cours":
      case "in progress":
        return "secondary";
      case "planifié":
      case "planned":
        return "outline";
      default:
        return "destructive";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-64 pl-10"
            />
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={filterType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type d'intervention" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Corrective">Corrective</SelectItem>
                <SelectItem value="Préventive">Préventive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="à faire">À faire</SelectItem>
                <SelectItem value="en cours">En cours</SelectItem>
                <SelectItem value="terminé">Terminé</SelectItem>
                <SelectItem value="planifié">Planifié</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDefaillance} onValueChange={handleDefaillanceChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de défaillance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les défaillances</SelectItem>
                <SelectItem value="Électrique">Électrique</SelectItem>
                <SelectItem value="Matérielle">Matérielle</SelectItem>
                <SelectItem value="Logiciel">Logiciel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bouton pour effacer les filtres */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Effacer les filtres
          </Button>
        )}
      </div>

      {/* Statistiques des filtres */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          {filteredInterventions.length} intervention{filteredInterventions.length > 1 ? 's' : ''} trouvée{filteredInterventions.length > 1 ? 's' : ''} 
          {allInterventions.length !== filteredInterventions.length && (
            <span> sur {allInterventions.length} au total</span>
          )}
        </div>
      )}

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
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                    Chargement...
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedInterventions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {hasActiveFilters ? (
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">Aucune intervention ne correspond aux critères de recherche</p>
                      <Button variant="outline" size="sm" onClick={clearFilters}>
                        Effacer les filtres
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Aucune intervention trouvée</p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              paginatedInterventions.map((intervention) => (
                <TableRow key={intervention.id_intervention}>
                  <TableCell>
                    {format(new Date(intervention.date_intervention), 'dd/MM/yyyy', {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {intervention.type_intervention}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={intervention.probleme_signale}>
                      {intervention.probleme_signale}
                    </div>
                  </TableCell>
                  <TableCell>{intervention.lieu}</TableCell>
                  <TableCell>{intervention.duree}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(intervention.statut_intervention)}>
                      {intervention.statut_intervention}
                    </Badge>
                  </TableCell>
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

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
}; 