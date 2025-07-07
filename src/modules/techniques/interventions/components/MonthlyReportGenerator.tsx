import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MonthlyReportGenerator = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMonthlyReport = async () => {
    if (!date) {
      toast.error('Veuillez sélectionner une date');
      return;
    }

    setIsGenerating(true);
    try {
      // Créer un tableau pour stocker les données du rapport
      const reportData = {
        month: format(date, 'MMMM yyyy', { locale: fr }),
        generatedAt: format(new Date(), 'dd/MM/yyyy HH:mm'),
        // Vous pouvez ajouter d'autres données ici selon vos besoins
      };

      // Créer le contenu du rapport en HTML
      const reportContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Rapport Mensuel des Interventions - ${reportData.month}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #2563eb; }
            .header { margin-bottom: 30px; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Rapport Mensuel des Interventions</h1>
            <div class="info">
              <p><strong>Période :</strong> ${reportData.month}</p>
              <p><strong>Généré le :</strong> ${reportData.generatedAt}</p>
            </div>
          </div>
          <!-- Vous pouvez ajouter plus de contenu ici -->
        </body>
        </html>
      `;

      // Créer un Blob avec le contenu HTML
      const blob = new Blob([reportContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);

      // Créer un lien de téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-interventions-${format(date, 'yyyy-MM')}.html`;
      document.body.appendChild(a);
      a.click();

      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Rapport généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      toast.error('Erreur lors de la génération du rapport');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[240px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'MMMM yyyy', { locale: fr }) : <span>Sélectionner un mois</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date > new Date() || date < new Date(2020, 0)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button 
          onClick={generateMonthlyReport} 
          disabled={isGenerating || !date}
        >
          {isGenerating ? 'Génération...' : 'Générer le rapport'}
        </Button>
      </div>
    </div>
  );
}; 