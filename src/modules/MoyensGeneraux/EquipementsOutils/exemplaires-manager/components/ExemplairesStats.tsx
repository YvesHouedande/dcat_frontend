import { Card, CardContent } from '@/components/ui/card';
import { BarChart, CheckCircle, XCircle } from 'lucide-react';

interface ExemplairesStatsProps {
  total: number;
  available: number;
  unavailable: number;
}

export const ExemplairesStats = ({ total, available, unavailable }: ExemplairesStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="flex justify-between items-center p-4">
          <div>
            <p className="text-sm text-gray-500">Total des exemplaires</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <BarChart className="h-8 w-8 text-gray-400" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex justify-between items-center p-4">
          <div>
            <p className="text-sm text-gray-500">Exemplaires disponibles</p>
            <p className="text-2xl font-bold">{available}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex justify-between items-center p-4">
          <div>
            <p className="text-sm text-gray-500">Exemplaires indisponibles</p>
            <p className="text-2xl font-bold">{unavailable}</p>
          </div>
          <XCircle className="h-8 w-8 text-red-500" />
        </CardContent>
      </Card>
    </div>
  );
};