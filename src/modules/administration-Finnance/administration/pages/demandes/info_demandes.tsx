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
import { useParams, useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  FileText,
  User,
  Pencil,
  XCircle,
  CheckCircle,
  ClockIcon,
  Paperclip,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { employes, naturesDocuments, demandes } from "./data";
import { Employe, Demande } from "../../types/interfaces";

// Définir une structure simple pour l'historique sans créer de nouveau type
const historique = [
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

const DemandeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Trouver la demande et l'employé correspondant à l'id de la demande
  const demande: Demande | undefined = demandes.find(
    (d) => d.Id_demandes.toString() === id
  );

  const employe: Employe | undefined = employes.find(
    (e) => e.id_employe === demande?.id_employe
  );

  if (!demande || !employe) {
    return <div>Demande ou employé non trouvé.</div>;
  }

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

  // Fonction pour naviguer vers la page de modification
  const handleEdit = () => {
    navigate(`/administration/demandes/${id}/editer`);
  };

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
                  {format(historique[0].date, "dd/MM/yyyy", { locale: fr })}
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
                    <div className="text-base">{demande.duree} jours</div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      Date de début
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span>
                        {format(demande.date_debut, "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      Date de fin
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span>
                        {format(demande.date_fin, "dd MMMM yyyy", { locale: fr })}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      Date d'absence
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span>
                        {format(demande.date_absence, "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      Date de retour
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span>
                        {format(demande.date_retour, "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </span>
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

                {/* Section pour les documents joints */}
                {demande.documents.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">
                        Documents joints
                      </div>
                      <div className="space-y-2">
                        {demande.documents.map((document) => (
                          <div
                            key={document.id_document}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                          >
                            <div className="flex items-center space-x-3">
                              <Paperclip className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="font-medium">
                                  {document.libele_document}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {document.id_nature_document && (
                                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                      {naturesDocuments.find(
                                        (n) =>
                                          n.id_nature_document ===
                                          document.id_nature_document
                                      )?.libelle_td || "Non défini"}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            >
                              Télécharger
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      {employe.prenom_employes} {employe.nom_employes}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Employé #{employe.id_employe}
                    </p>
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
              <Button onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Carte latérale avec résumé et historique */}
        <div className="md:col-span-1 space-y-6">
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
                  {employe.prenom_employes} {employe.nom_employes}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Durée</span>
                <span>{demande.duree} jours</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Période
                </span>
                <span className="text-sm">
                  {format(demande.date_debut, "dd/MM", { locale: fr })} -{" "}
                  {format(demande.date_fin, "dd/MM/yyyy", { locale: fr })}
                </span>
              </div>
            </CardContent>

            {demande.documents.length > 0 && (
              <CardFooter className="flex flex-col space-y-2 border-t pt-4">
                <Button variant="outline" className="w-full">
                  Télécharger le fichier joint
                </Button>
                <Button variant="outline" className="w-full">
                  Aperçu du fichier
                </Button>
              </CardFooter>
            )}
          </Card>

          {/* Carte d'historique */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {historique.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.action}</span>
                    <span className="text-xs text-gray-500">
                      {format(item.date, "dd/MM/yyyy HH:mm", { locale: fr })}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Par {item.utilisateur}
                  </div>
                  <div className="text-sm">{item.commentaire}</div>
                  {index < historique.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DemandeDetailPage;
