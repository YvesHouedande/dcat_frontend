import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ExemplairesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "disponible" | "indisponible";
  onStatusChange: (value: "all" | "disponible" | "indisponible") => void;
  onReset: () => void;
}

export const ExemplairesFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onReset
}: ExemplairesFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="flex flex-col md:flex-row gap-4 p-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            type="text" 
            placeholder="Rechercher par numéro de série ou ID..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="disponible">Disponible</SelectItem>
              <SelectItem value="indisponible">Indisponible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={onReset}>
          <Filter className="h-4 w-4 mr-1" />
          Réinitialiser
        </Button>
      </CardContent>
    </Card>
  );
};