import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MonthlyReport } from '../components/MonthlyReport';
import { PartenaireReport } from '../components/PartenaireReport';
import Layout from '@/components/Layout';
import { Home, FileText, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InterventionsReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('report');

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Rapports d'Interventions</h1>
            <p className="text-muted-foreground mt-2">
              Générez et exportez vos rapports d'interventions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/technique/interventions')}>
              <Home className="mr-2 h-4 w-4" />
              Tableau de bord
            </Button>
            <Button variant="outline" onClick={() => navigate('/technique/interventions/liste')}>
              <FileText className="mr-2 h-4 w-4" />
              Voir toutes les interventions
            </Button>
            <Button onClick={() => navigate('/technique/interventions')}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Intervention
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="report">Rapport Mensuel</TabsTrigger>
            <TabsTrigger value="partenaire">Rapport par Partenaire</TabsTrigger>
          </TabsList>

          <TabsContent value="report">
            <MonthlyReport />
          </TabsContent>

          <TabsContent value="partenaire">
            <PartenaireReport />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}; 