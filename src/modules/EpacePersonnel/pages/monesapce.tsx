import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Backpack,
  Cake,
  Clock9,
  FileText,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Passeword from "./passeword";

export default function UserProfile() {
  // Données de l'utilisateur (à remplacer par vos données réelles)
  const userData = {
    id: 1,
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@example.com",
    contact: "0123456789",
    adresse: "123 Rue de Paris, 75001",
    status: "Actif",
    dateEmbauche: "15/01/2020",
    dateNaissance: "05/05/1985",
    contrat: "CDI",
    fonction: "Développeur",
  };

  // Historique des demandes
  const demandes = [
    { id: 1, type: "Congés", date: "10/05/2023", statut: "Approuvé" },
    { id: 2, type: "Formation", date: "22/06/2023", statut: "En attente" },
    { id: 3, type: "Matériel", date: "05/07/2023", statut: "Refusé" },
    { id: 4, type: "Télétravail", date: "12/08/2023", statut: "Approuvé" },
  ];
  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section Profil */}
        <div className="lg:col-span-1 space-y-6 ">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/avatars/01.png" />
                <AvatarFallback>
                  {userData.prenom[0]}
                  {userData.nom[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center">
                <CardTitle className="text-lg leading-tight">
                  {userData.prenom} {userData.nom}
                </CardTitle>
                <CardDescription className="text-sm">
                  {userData.fonction}
                </CardDescription>
                <Badge
                  variant={
                    userData.status === "Actif" ? "default" : "secondary"
                  }
                  className="mt-1 w-fit"
                >
                  {userData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 pt-0">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{userData.contact}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">{userData.adresse}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <Backpack size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date d'embauche</p>
                  <p className="font-medium">{userData.dateEmbauche}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contrat</p>
                  <p className="font-medium">{userData.contrat}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <Cake size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de naissance</p>
                  <p className="font-medium">{userData.dateNaissance}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Modifier le profil</Button>
              <Button variant="outline">Voir CV</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accès et sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Mot de passe</Label>
                <p>••••••••</p>
              </div>
              <Button variant="outline" onClick={()=>setShowPasswordDialog(true)} className="w-full">
                Modifier le mot de passe
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Section Historique des demandes */}
        <div className="lg:col-span-1 flex flex-col h-[80vh]">
          <Card className="flex flex-col flex-1 min-h-0">
            <CardHeader>
              <CardTitle>Historique des demandes</CardTitle>
              <CardDescription>
                Vos demandes récentes et leur statut
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1 min-h-0">
              <div className="space-y-4">
                {demandes.map((demande) => (
                  <div
                    key={demande.id}
                    className="flex items-center justify-between pb-2 border-b last:border-b-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-medium text-sm">{demande.type}</h3>
                      <p className="text-xs text-gray-500 flex gap-x-2 items-center">
                        <Clock9 size={12} />
                        Date: {demande.date}
                      </p>
                    </div>
                    <Badge
                      variant={
                        demande.statut === "Approuvé"
                          ? "default"
                          : demande.statut === "En attente"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {demande.statut}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <NavLink to={"demandes/nouvelle"}>
                <Button variant="outline">Nouvelle demande</Button>
              </NavLink>
              <NavLink to={"demandes"}>
                <Button variant="ghost">Voir tout l'historique</Button>
              </NavLink>
            </CardFooter>
          </Card>

          {/* Actions rapides */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <NavLink to={"demandes/nouvelle"}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Demande de congés</CardTitle>
                  <CardDescription>
                    Envoyer une nouvelle demande
                  </CardDescription>
                </CardHeader>
              </Card>
            </NavLink>
            <NavLink to={"demandes/nouvelle"}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Signalisation d'absence
                  </CardTitle>
                  <CardDescription>Signalisez une absence</CardDescription>
                </CardHeader>
              </Card>
            </NavLink>
          </div>
        </div>
      </div>
      <Passeword setshowPasswordDialog={setShowPasswordDialog} showPasswordDialog={showPasswordDialog}/>
    </div>
  );
}
