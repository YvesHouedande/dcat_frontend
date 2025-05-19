import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckCircle,
  XCircle,
  User,
  AlertTriangle,
  CalendarRange,
  FileText,
  Clock,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

interface Employe {
  id_employe: number;
  nom: string;
  prenom: string;
  departement: string;
  avatar?: string;
}

interface Demande {
  id_demande: number;
  date_debut: string;
  status: "En attente" | "Approuvée" | "Refusée" | "En cours" | "Terminée";
  date_fin: string;
  motif: string;
  type_demande:
    | "Congé"
    | "Formation"
    | "Matériel"
    | "Autre"
    | "Télétravail"
    | "Remboursement";
  id_employe: number;
  employe: Employe;
}

const DemandesAnnuaire: React.FC = () => {
  // Données d'exemple pour les employés
  const employes: Employe[] = [
    {
      id_employe: 1,
      nom: "Dupont",
      prenom: "Marie",
      departement: "Ressources Humaines",
    },
    {
      id_employe: 2,
      nom: "Martin",
      prenom: "Thomas",
      departement: "Informatique",
    },
    { id_employe: 3, nom: "Leroy", prenom: "Julie", departement: "Marketing" },
    { id_employe: 4, nom: "Petit", prenom: "Lucas", departement: "Finance" },
    {
      id_employe: 5,
      nom: "Robert",
      prenom: "Sophie",
      departement: "Développement",
    },
    {
      id_employe: 6,
      nom: "Moreau",
      prenom: "Alexandre",
      departement: "Commercial",
    },
  ];

  // Données d'exemple pour les demandes
  const demandes: Demande[] = [
    {
      id_demande: 1,
      date_debut: "2025-04-15T09:00:00",
      status: "En attente",
      date_fin: "2025-04-20T18:00:00",
      motif: "Vacances annuelles",
      type_demande: "Congé",
      id_employe: 1,
      employe: employes[0],
    },
    {
      id_demande: 2,
      date_debut: "2025-04-10T09:00:00",
      status: "Approuvée",
      date_fin: "2025-04-12T18:00:00",
      motif: "Formation Excel avancé",
      type_demande: "Formation",
      id_employe: 2,
      employe: employes[1],
    },
    {
      id_demande: 3,
      date_debut: "2025-04-05T09:00:00",
      status: "Refusée",
      date_fin: "2025-04-07T18:00:00",
      motif: "Urgence familiale",
      type_demande: "Congé",
      id_employe: 3,
      employe: employes[2],
    },
    {
      id_demande: 4,
      date_debut: "2025-04-12T09:00:00",
      status: "En cours",
      date_fin: "2025-05-12T18:00:00",
      motif: "Achat d'un nouvel ordinateur",
      type_demande: "Matériel",
      id_employe: 4,
      employe: employes[3],
    },
    {
      id_demande: 5,
      date_debut: "2025-04-18T09:00:00",
      status: "En attente",
      date_fin: "2025-04-22T18:00:00",
      motif: "Congé parental",
      type_demande: "Congé",
      id_employe: 5,
      employe: employes[4],
    },
    {
      id_demande: 6,
      date_debut: "2025-04-08T09:00:00",
      status: "Terminée",
      date_fin: "2025-04-10T18:00:00",
      motif: "Remboursement frais de déplacement",
      type_demande: "Remboursement",
      id_employe: 6,
      employe: employes[5],
    },
    {
      id_demande: 7,
      date_debut: "2025-04-16T09:00:00",
      status: "Approuvée",
      date_fin: "2025-04-23T18:00:00",
      motif: "Raison personnelle",
      type_demande: "Congé",
      id_employe: 1,
      employe: employes[0],
    },
    {
      id_demande: 8,
      date_debut: "2025-04-22T09:00:00",
      status: "En attente",
      date_fin: "2025-04-29T18:00:00",
      motif: "Travail à distance",
      type_demande: "Télétravail",
      id_employe: 2,
      employe: employes[1],
    },
  ];

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM", { locale: fr });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = differenceInDays(end, start) + 1;
    return days === 1 ? "1 jour" : `${days} jours`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En attente":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "Approuvée":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Refusée":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "En cours":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Terminée":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Congé":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Formation":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Matériel":
        return "bg-teal-100 text-teal-800 hover:bg-teal-100";
      case "Télétravail":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100";
      case "Remboursement":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
      case "Autre":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "En attente":
        return <Clock size={16} className="text-amber-500" />;
      case "Approuvée":
        return <CheckCircle size={16} className="text-green-500" />;
      case "Refusée":
        return <XCircle size={16} className="text-red-500" />;
      case "En cours":
        return <AlertTriangle size={16} className="text-blue-500" />;
      case "Terminée":
        return <FileText size={16} className="text-gray-500" />;
      default:
        return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Congé":
        return <Calendar size={16} className="text-purple-500" />;
      case "Formation":
        return <FileText size={16} className="text-blue-500" />;
      case "Matériel":
        return <FileText size={16} className="text-teal-500" />;
      case "Télétravail":
        return <User size={16} className="text-indigo-500" />;
      case "Remboursement":
        return <FileText size={16} className="text-emerald-500" />;
      case "Autre":
        return <FileText size={16} className="text-gray-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {demandes.map((demande) => (
            <Card
              key={demande.id_demande}
              className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
              // onClick={() => handleViewDemande(demande.id_demande)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge className={`${getStatusColor(demande.status)}`}>
                    <div className="flex items-center">
                      {getStatusIcon(demande.status)}
                      <span className="ml-1 text-xs">{demande.status}</span>
                    </div>
                  </Badge>
                  <Badge className={`${getTypeColor(demande.type_demande)}`}>
                    <div className="flex items-center">
                      {getTypeIcon(demande.type_demande)}
                      <span className="ml-1 text-xs">
                        {demande.type_demande}
                      </span>
                    </div>
                  </Badge>
                </div>

                <h3 className="font-medium text-gray-800 line-clamp-2 mb-3 text-sm">
                  {demande.motif}
                </h3>

                <div className="border-t pt-2 text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CalendarRange size={14} className="mr-1" />
                      <span>
                        {formatShortDate(demande.date_debut)} -{" "}
                        {formatShortDate(demande.date_fin)}
                      </span>
                    </div>
                    <span>
                      {calculateDuration(demande.date_debut, demande.date_fin)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemandesAnnuaire;
