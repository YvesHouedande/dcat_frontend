// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import Layout from '@/components/Layout';
// import { Home, FileText, Plus } from 'lucide-react';

// export const ProjetsReportsPage: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <Layout>
//       <div className="container mx-auto py-6 space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold">Rapports de Projets</h1>
//             <p className="text-muted-foreground mt-2">
//               Générez et exportez vos rapports de projets
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={() => navigate('/technique/projets')}>
//               <Home className="mr-2 h-4 w-4" />
//               Tableau de bord
//             </Button>
//             <Button variant="outline" onClick={() => navigate('/technique/projets/liste')}>
//               <FileText className="mr-2 h-4 w-4" />
//               Voir tous les projets
//             </Button>
//             <Button onClick={() => navigate('/technique/projets/nouveau')}>
//               <Plus className="mr-2 h-4 w-4" />
//               Nouveau Projet
//             </Button>
//           </div>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Fonctionnalité en cours de développement</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-muted-foreground">
//               La page de rapports pour les projets sera bientôt disponible. 
//               Elle permettra de générer des rapports détaillés sur l'état des projets, 
//               les budgets, les délais et les performances.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </Layout>
//   );
// };

// Page de rapports temporairement désactivée
export const ProjetsReportsPage: React.FC = () => {
  return null;
}; 