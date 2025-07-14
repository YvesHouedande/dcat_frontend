import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Intervention } from '../interface/interface';
import { InterventionForm } from '../components/InterventionForm';
import {
  createIntervention,
  deleteIntervention,
  getInterventions,
} from '../api/intervention';
import Layout from '@/components/Layout';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays} from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Plus, FileText, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InterventionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [interventions, setInterventions] = useState<Intervention[]>([]);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await getInterventions();
        // Limiter à 2 interventions les plus récentes
        const recentInterventions = (response.data || [])
          .sort((a, b) => new Date(b.date_intervention).getTime() - new Date(a.date_intervention).getTime())
          .slice(0, 2);
        setInterventions(recentInterventions);
      } catch (error) {
        console.error('Erreur lors du chargement des interventions:', error);
        toast.error('Erreur lors du chargement des interventions');
      }
    };
    fetchInterventions();
  }, []);

  // Calcul des KPIs et données des graphiques
  const dashboardData = useMemo(() => {
    if (!interventions.length) return null;

    const now = new Date();
    const last30Days = subDays(now, 30);

    // 1. Interventions des 30 derniers jours
    const recentInterventions = interventions.filter(
      int => new Date(int.date_intervention) >= last30Days
    );

    // 2. Temps moyen d'intervention
    const avgDuration = recentInterventions.reduce((acc, curr) => {
      const matches = curr.duree.match(/(\d+)h(?:(\d+))?/);
      if (matches) {
        const hours = parseInt(matches[1]) || 0;
        const minutes = parseInt(matches[2]) || 0;
        return acc + (hours * 60 + minutes);
      }
      return acc;
    }, 0) / recentInterventions.length;

    // 3. Types de défaillances les plus courants
    const defaillanceCount = recentInterventions.reduce((acc, curr) => {
      acc[curr.type_defaillance] = (acc[curr.type_defaillance] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 4. Tendance des interventions par jour
    const dailyInterventions = recentInterventions.reduce((acc, curr) => {
      const date = format(new Date(curr.date_intervention), 'dd/MM');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 5. Distribution par lieu
    const lieuDistribution = recentInterventions.reduce((acc, curr) => {
      acc[curr.lieu] = (acc[curr.lieu] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalInterventions: recentInterventions.length,
      avgDurationFormatted: `${Math.floor(avgDuration / 60)}h${Math.round(avgDuration % 60)}`,
      interventionsParJour: Object.entries(dailyInterventions).map(([date, count]) => ({
        date,
        interventions: count
      })),
      defaillances: Object.entries(defaillanceCount).map(([name, value]) => ({
        name,
        value
      })),
      lieux: Object.entries(lieuDistribution).map(([name, value]) => ({
        name,
        value
      })),
      tauxUrgence: (recentInterventions.filter(int => 
        int.mode_intervention?.toLowerCase().includes('urgence')
      ).length / recentInterventions.length * 100).toFixed(1)
    };
  }, [interventions]);

  const COLORS = ['#2563eb', '#16a34a', '#ea580c', '#8b5cf6', '#db2777'];

  // Type pour les données du formulaire
  type FormData = {
    date_intervention: string;
    id_partenaire: number;
    probleme_signale: string;
    type_intervention: 'Corrective' | 'Préventive';
    type_defaillance: 'Électrique' | 'Matérielle' | 'Logiciel';
    cause_defaillance: 'Usure normale' | 'Défaut utilisateur' | 'Défaut produit' | 'Autre';
    detail_cause?: string;
    rapport_intervention: string;
    recommandation: string;
    duree: string;
    lieu: string;
    mode_intervention: string;
    employes: number[];
    superviseur: number;
    id_contrat: number | null;
  };

  const handleCreateSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Validation des champs requis
      if (!data.id_partenaire || data.id_partenaire === 0) {
        throw new Error('Le client est requis');
      }

      // S'assurer que les valeurs numériques sont bien des nombres
      const id_partenaire = data.id_partenaire; // Déjà un number dans FormData

      // Fonction pour tronquer le texte à une longueur maximale
      const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        return text.trim().substring(0, maxLength);
      };

      // Format the data to match the API expectations with length limitations
      const formattedData = {
        date_intervention: data.date_intervention,
        id_partenaire: id_partenaire,
        probleme_signale: truncateText(data.probleme_signale, 50),
        type_intervention: truncateText(data.type_intervention, 50),
        type_defaillance: truncateText(data.type_defaillance, 50),
        cause_defaillance: truncateText(data.cause_defaillance, 50),
        detail_cause: data.detail_cause || '',
        rapport_intervention: truncateText(data.rapport_intervention, 50),
        recommandation: truncateText(data.recommandation, 50),
        duree: truncateText(data.duree, 50),
        lieu: truncateText(data.lieu, 50),
        mode_intervention: truncateText(data.mode_intervention || 'Standard', 50),
        type: truncateText(data.type_intervention, 50),
        id_contrat: data.id_contrat ?? null, // Correction : on prend la valeur du formulaire
        employes: data.employes, // Correction : on envoie les employés sélectionnés
        superviseur: data.superviseur, // Correction : on envoie le superviseur sélectionné
        statut_intervention: 'à faire'
      };

      // Vérification que tous les champs requis sont présents et non vides
      const requiredFields = [
        'date_intervention',
        'type_intervention',
        'type_defaillance',
        'cause_defaillance',
        'lieu',
        'duree'
      ] as const;

      const missingFields = requiredFields.filter(field => !formattedData[field as keyof typeof formattedData]);
      if (missingFields.length > 0) {
        throw new Error(`Les champs suivants sont requis : ${missingFields.join(', ')}`);
      }

      // Log des données avant envoi
      console.log('Données brutes du formulaire:', data);
      console.log('Données formatées envoyées à l\'API:', formattedData);

      try {
        const response = await createIntervention(formattedData);
        console.log('Réponse de l\'API:', response);
        
        if (response.success === false) {
          throw new Error(response.message || 'Erreur lors de la création de l\'intervention');
        }

        setIsCreateDialogOpen(false);
        toast.success('L\'intervention a été créée avec succès.');
        
        // Recharger la liste des interventions
        window.location.reload();
        
      } catch (apiError) {
        console.error('Erreur détaillée de l\'API:', apiError);
        if (axios.isAxiosError(apiError) && apiError.response) {
          console.log('Status:', apiError.response.status);
          console.log('Headers:', apiError.response.headers);
          console.log('Data:', apiError.response.data);
        }
        throw apiError;
      }
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'intervention:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Une erreur est survenue lors de la création de l\'intervention';
        toast.error(errorMessage);
        console.log('Réponse d\'erreur de l\'API:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Une erreur inattendue est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedIntervention) return;
    setIsLoading(true);
    try {
      await deleteIntervention(selectedIntervention.id_intervention);
      setIsDeleteDialogOpen(false);
      toast.success('L\'intervention a été supprimée avec succès.');
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'intervention:', error);
      toast.error('Une erreur est survenue lors de la suppression de l\'intervention.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Interventions</h1>
            <p className="text-muted-foreground mt-2">
              Tableau de bord des interventions techniques
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/technique/interventions/liste')}>
              <FileText className="mr-2 h-4 w-4" />
              Voir toutes les interventions
            </Button>
            <Button variant="outline" onClick={() => navigate('/technique/interventions/rapports')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Rapports
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Intervention
            </Button>
          </div>
        </div>

        {/* Dashboard Section */}
        {dashboardData && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Interventions (30j)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalInterventions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Durée Moyenne
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.avgDurationFormatted}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Taux d'Urgence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.tauxUrgence}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Interventions Aujourd'hui
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {interventions.filter(int => 
                      format(new Date(int.date_intervention), 'yyyy-MM-dd') === 
                      format(new Date(), 'yyyy-MM-dd')
                    ).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Distribution par type de défaillance */}
              <Card>
                <CardHeader>
                  <CardTitle>Types de Défaillances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardData.defaillances}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dashboardData.defaillances.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Distribution par lieu */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Lieu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData.lieux}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Type de Défaillance</TableHead>
              <TableHead>Cause</TableHead>
              <TableHead>Détail</TableHead>
              <TableHead>Rapport</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interventions.map((intervention) => (
              <TableRow key={intervention.id_intervention}>
                <TableCell>{format(new Date(intervention.date_intervention), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{intervention.type_intervention}</TableCell>
                <TableCell>{intervention.type_defaillance}</TableCell>
                <TableCell>{intervention.cause_defaillance}</TableCell>
                <TableCell>{intervention.detail_cause}</TableCell>
                <TableCell>{intervention.rapport_intervention}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="outline" onClick={() => handleDeleteClick(intervention)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog de création */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle Intervention</DialogTitle>
              <DialogDescription>
                Créez une nouvelle fiche d'intervention
              </DialogDescription>
            </DialogHeader>
            <InterventionForm onSubmit={handleCreateSubmit} isLoading={isLoading} />
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmation de suppression */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette intervention ? Cette action
                est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                {isLoading ? 'Suppression...' : 'Supprimer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}; 