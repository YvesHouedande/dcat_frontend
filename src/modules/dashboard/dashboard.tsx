import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Layout from "@/components/Layout";

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs</CardTitle>
            <CardDescription>Nombre total d'utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">1,234</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenus</CardTitle>
            <CardDescription>Ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">€8,350</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Projets</CardTitle>
            <CardDescription>Projets actifs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Onglets */}
      <Tabs defaultValue="apercu" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="activite">Activité</TabsTrigger>
          <TabsTrigger value="parametres">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="apercu">
          <Card>
            <CardHeader>
              <CardTitle>Dernières transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#1234</TableCell>
                    <TableCell>Dupont SA</TableCell>
                    <TableCell>€1,200</TableCell>
                    <TableCell><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Payé</span></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#1235</TableCell>
                    <TableCell>Martin EURL</TableCell>
                    <TableCell>€850</TableCell>
                    <TableCell><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">En attente</span></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#1236</TableCell>
                    <TableCell>Petit & Fils</TableCell>
                    <TableCell>€2,300</TableCell>
                    <TableCell><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Payé</span></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activite">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Jean Dupont a commenté un projet</p>
                    <p className="text-sm text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>ML</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Marie Lefebvre a créé un nouveau projet</p>
                    <p className="text-sm text-gray-500">Il y a 5 heures</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="parametres">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Notifications</p>
                  <Button variant="outline">Configurer</Button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Confidentialité</p>
                  <Button variant="outline">Modifier</Button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Sécurité</p>
                  <Button variant="outline">Revoir</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Section d'actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Annuler</Button>
        <Button>Sauvegarder</Button>
      </div>
    </div>  
  </Layout>
  );
};

export default Dashboard;
