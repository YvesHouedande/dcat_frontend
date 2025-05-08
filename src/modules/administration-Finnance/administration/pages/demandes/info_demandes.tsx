import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import {
  CalendarIcon,
  FileText,
  User,
  Pencil,
  XCircle,
  CheckCircle,
  ClockIcon,
} from "lucide-react";
import { format } from "date-fns";

// Définition du type Demande
interface Demande {
  Id_demandes: number;
  date_debut: Date;
  status: string;
  date_fin: Date;
  motif: string;
  type_demande: string;
  Id_employes: number;
}

// Informations supplémentaires sur l'employé
interface EmployeInfo {
  Id_employes: number;
  nom: string;
  prenom: string;
  departement: string;
  poste: string;
  email: string;
}

// Informations d'historique
interface HistoriqueItem {
  date: Date;
  action: string;
  utilisateur: string;
  commentaire: string;
}

// Données d'exemple
const demande: Demande = {
  Id_demandes: 2,
  date_debut: new Date("2025-04-10"),
  status: "Approuvé",
  date_fin: new Date("2025-04-15"),
  motif: "Formation professionnelle en développement web avancé",
  type_demande: "Formation",
  Id_employes: 102,
};

const employe: EmployeInfo = {
  Id_employes: 102,
  nom: "Dupont",
  prenom: "Marie",
  departement: "Informatique",
  poste: "Développeuse Full-Stack",
  email: "marie.dupont@entreprise.com",
};

const historique: HistoriqueItem[] = [
  {
    date: new Date("2025-04-01T09:15:00"),
    action: "Création",
    utilisateur: "Marie Dupont",
    commentaire: "Demande initiale de formation",
  },
  {
    date: new Date("2025-04-02T14:30:00"),
    action: "Modification",
    utilisateur: "Marie Dupont",
    commentaire: "Ajout de détails sur le type de formation",
  },
  {
    date: new Date("2025-04-03T11:20:00"),
    action: "Validation N1",
    utilisateur: "Jean Martin",
    commentaire: "Approuvé par le responsable d'équipe",
  },
  {
    date: new Date("2025-04-05T16:45:00"),
    action: "Approbation",
    utilisateur: "Sophie Leroy",
    commentaire: "Demande validée par la direction des ressources humaines",
  },
];

// Fonction pour calculer la durée en jours
const calculerDuree = (dateDebut: Date, dateFin: Date): number => {
  const differenceMs = dateFin.getTime() - dateDebut.getTime();
  return Math.ceil(differenceMs / (1000 * 60 * 60 * 24)) + 1; // +1 pour inclure le jour de fin
};

const DemandeDetailPage: React.FC = () => {
  // État pour gérer l'onglet actif
  const { id } = useParams();

  // Fonction pour obtenir la couleur et l'icône du badge selon le statut
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Approuvé":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
        };
      case "Refusé":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="h-4 w-4 mr-1" />,
        };
      case "En attente":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <ClockIcon className="h-4 w-4 mr-1" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <FileText className="h-4 w-4 mr-1" />,
        };
    }
  };

  const statusInfo = getStatusInfo(demande.status);
  const duree = calculerDuree(demande.date_debut, demande.date_fin);

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte principale avec les détails de la demande */}
        <div className="md:col-span-2">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Demande #{id}
                </CardTitle>
                <CardDescription className="mt-1">
                  {demande.type_demande} - Créée le{" "}
                  {format(historique[0].date, "dd/MM/yyyy")}
                </CardDescription>
              </div>
              <Badge className={`flex items-center ${statusInfo.color}`}>
                {statusInfo.icon}
                {demande.status}
              </Badge>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      Type de demande
                    </div>
                    <div className="text-base">{demande.type_demande}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      Durée
                    </div>
                    <div className="text-base">{duree} jours</div>
                  </div>
                </div>

                <Separator />

                <div className=" grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      Date de début
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{format(demande.date_debut, "dd MMMM yyyy")}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      Date de fin
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{format(demande.date_fin, "dd MMMM yyyy")}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Motif</div>
                  <div className="text-base p-3 bg-gray-50 rounded-md">
                    {demande.motif}
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      {employe.prenom} {employe.nom}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {employe.poste} - {employe.departement}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      ID Employé
                    </div>
                    <div className="text-base">{employe.Id_employes}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      Email
                    </div>
                    <div className="text-base">{employe.email}</div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2 border-t pt-4">
              {demande.status === "En attente" && (
                <>
                  <Button variant="outline" className="bg-red-50 text-red-600">
                    <XCircle className="mr-2 h-4 w-4" />
                    Refuser
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-green-50 text-green-600"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approuver
                  </Button>
                </>
              )}
              <Button>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Carte latérale avec résumé et actions rapides */}
        <div className="md:col-span-1">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Récapitulatif
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Statut
                </span>
                <Badge className={statusInfo.color}>
                  {statusInfo.icon}
                  {demande.status}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Type</span>
                <span>{demande.type_demande}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Employé
                </span>
                <span>
                  {employe.prenom} {employe.nom}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Durée</span>
                <span>{duree} jours</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Période
                </span>
                <span className="text-sm">
                  {format(demande.date_debut, "dd/MM")} -{" "}
                  {format(demande.date_fin, "dd/MM/yyyy")}
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2 border-t pt-4">
              <Button variant="outline" className="w-full">
                Télécharger le fichier joint
              </Button>
              <Button variant="outline" className="w-full">
                Aperçu du fichier
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DemandeDetailPage;
