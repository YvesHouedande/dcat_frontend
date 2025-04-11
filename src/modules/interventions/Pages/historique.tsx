import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Ellipsis,
  TableOfContents,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash,
  AlertOctagon,
  UserCircle,
  Clock,
  MapPin,
  Hash,
  Settings,
  ActivitySquare,
  AlertCircle,
  Trash2,
  AlertTriangle,
  FileText,
  Calendar,
} from "lucide-react";

import Layout from "@/components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const NavComponent = () => {
  return (
    <div>
      <Button
        className="cursor-pointer transition ease-in-out duration-300 active:scale-95"
        variant={"outline"}
      >
        <Link
          className="flex items-center space-x-2"
          to={"/interventions/nouvelle_intervention"}
        >
          Nouvelle intervention <Plus />
        </Link>
      </Button>
    </div>
  );
};

// Définition du type d'Intervention
interface Intervention {
  id_intervention: string;
  date_: string;
  cause_defaillance: string;
  rapport_intervention: string;
  type_maintenance: string;
  type_defaillance: string;
  superviseur: string;
  duree: string;
  numero: string;
  lieu: string;
  id_probleme: string;
}

// Données d'exemple (à remplacer par vos vraies données)
const interventionsData: Intervention[] = [
  {
    id_intervention: "INT-008",
    date_: "2025-03-15",
    cause_defaillance: "Usure",
    rapport_intervention: "Remplacement pièce défectueuse",
    type_maintenance: "Corrective",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "2h30",
    numero: "T-456",
    lieu: "Atelier principal",
    id_probleme: "PROB-123",
  },
  {
    id_intervention: "INT-002",
    date_: "2025-03-20",
    cause_defaillance: "Surchauffe",
    rapport_intervention: "Nettoyage système refroidissement",
    type_maintenance: "Préventive",
    type_defaillance: "Thermique",
    superviseur: "Martin",
    duree: "1h45",
    numero: "T-789",
    lieu: "Secteur B",
    id_probleme: "PROB-234",
  },
  {
    id_intervention: "INT-003",
    date_: "2025-03-22",
    cause_defaillance: "Court-circuit",
    rapport_intervention: "Remplacement câblage",
    type_maintenance: "Corrective",
    type_defaillance: "Électrique",
    superviseur: "Dubois",
    duree: "3h15",
    numero: "T-101",
    lieu: "Secteur C",
    id_probleme: "PROB-345",
  },
  {
    id_intervention: "INT-004",
    date_: "2025-03-25",
    cause_defaillance: "Fuite hydraulique",
    rapport_intervention: "Remplacement joint",
    type_maintenance: "Urgence",
    type_defaillance: "Hydraulique",
    superviseur: "Leroy",
    duree: "0h45",
    numero: "T-202",
    lieu: "Secteur A",
    id_probleme: "PROB-456",
  },
  {
    id_intervention: "INT-005",
    date_: "2025-03-28",
    cause_defaillance: "Calibration incorrecte",
    rapport_intervention: "Recalibration capteurs",
    type_maintenance: "Préventive",
    type_defaillance: "Électronique",
    superviseur: "Moreau",
    duree: "1h30",
    numero: "T-303",
    lieu: "Laboratoire",
    id_probleme: "PROB-567",
  },
  // Ajout de plus d'entrées pour tester la pagination
  {
    id_intervention: "INT-006",
    date_: "2025-03-29",
    cause_defaillance: "Panne logicielle",
    rapport_intervention: "Mise à jour firmware",
    type_maintenance: "Corrective",
    type_defaillance: "Logiciel",
    superviseur: "Petit",
    duree: "1h00",
    numero: "T-404",
    lieu: "Salle de contrôle",
    id_probleme: "PROB-678",
  },
  {
    id_intervention: "INT-007",
    date_: "2025-03-30",
    cause_defaillance: "Vibration excessive",
    rapport_intervention: "Rééquilibrage rotor",
    type_maintenance: "Préventive",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "3h00",
    numero: "T-505",
    lieu: "Atelier principal",
    id_probleme: "PROB-789",
  },

  {
    id_intervention: "INT-001",
    date_: "2025-03-15",
    cause_defaillance: "Usure",
    rapport_intervention: "Remplacement pièce défectueuse",
    type_maintenance: "Corrective",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "2h30",
    numero: "T-456",
    lieu: "Atelier principal",
    id_probleme: "PROB-123",
  },
  {
    id_intervention: "INT-002",
    date_: "2025-03-20",
    cause_defaillance: "Surchauffe",
    rapport_intervention: "Nettoyage système refroidissement",
    type_maintenance: "Préventive",
    type_defaillance: "Thermique",
    superviseur: "Martin",
    duree: "1h45",
    numero: "T-789",
    lieu: "Secteur B",
    id_probleme: "PROB-234",
  },
  {
    id_intervention: "INT-003",
    date_: "2025-03-22",
    cause_defaillance: "Court-circuit",
    rapport_intervention: "Remplacement câblage",
    type_maintenance: "Corrective",
    type_defaillance: "Électrique",
    superviseur: "Dubois",
    duree: "3h15",
    numero: "T-101",
    lieu: "Secteur C",
    id_probleme: "PROB-345",
  },
  {
    id_intervention: "INT-004",
    date_: "2025-03-25",
    cause_defaillance: "Fuite hydraulique",
    rapport_intervention: "Remplacement joint",
    type_maintenance: "Urgence",
    type_defaillance: "Hydraulique",
    superviseur: "Leroy",
    duree: "0h45",
    numero: "T-202",
    lieu: "Secteur A",
    id_probleme: "PROB-456",
  },
  {
    id_intervention: "INT-005",
    date_: "2025-03-28",
    cause_defaillance: "Calibration incorrecte",
    rapport_intervention: "Recalibration capteurs",
    type_maintenance: "Préventive",
    type_defaillance: "Électronique",
    superviseur: "Moreau",
    duree: "1h30",
    numero: "T-303",
    lieu: "Laboratoire",
    id_probleme: "PROB-567",
  },
  // Ajout de plus d'entrées pour tester la pagination
  {
    id_intervention: "INT-006",
    date_: "2025-03-29",
    cause_defaillance: "Panne logicielle",
    rapport_intervention: "Mise à jour firmware",
    type_maintenance: "Corrective",
    type_defaillance: "Logiciel",
    superviseur: "Petit",
    duree: "1h00",
    numero: "T-404",
    lieu: "Salle de contrôle",
    id_probleme: "PROB-678",
  },
  {
    id_intervention: "INT-007",
    date_: "2025-03-30",
    cause_defaillance: "Vibration excessive",
    rapport_intervention: "Rééquilibrage rotor",
    type_maintenance: "Préventive",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "3h00",
    numero: "T-505",
    lieu: "Atelier principal",
    id_probleme: "PROB-789",
  },

  {
    id_intervention: "INT-001",
    date_: "2025-03-15",
    cause_defaillance: "Usure",
    rapport_intervention: "Remplacement pièce défectueuse",
    type_maintenance: "Corrective",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "2h30",
    numero: "T-456",
    lieu: "Atelier principal",
    id_probleme: "PROB-123",
  },
  {
    id_intervention: "INT-002",
    date_: "2025-03-20",
    cause_defaillance: "Surchauffe",
    rapport_intervention: "Nettoyage système refroidissement",
    type_maintenance: "Préventive",
    type_defaillance: "Thermique",
    superviseur: "Martin",
    duree: "1h45",
    numero: "T-789",
    lieu: "Secteur B",
    id_probleme: "PROB-234",
  },
  {
    id_intervention: "INT-003",
    date_: "2025-03-22",
    cause_defaillance: "Court-circuit",
    rapport_intervention: "Remplacement câblage",
    type_maintenance: "Corrective",
    type_defaillance: "Électrique",
    superviseur: "Dubois",
    duree: "3h15",
    numero: "T-101",
    lieu: "Secteur C",
    id_probleme: "PROB-345",
  },
  {
    id_intervention: "INT-004",
    date_: "2025-03-25",
    cause_defaillance: "Fuite hydraulique",
    rapport_intervention: "Remplacement joint",
    type_maintenance: "Urgence",
    type_defaillance: "Hydraulique",
    superviseur: "Leroy",
    duree: "0h45",
    numero: "T-202",
    lieu: "Secteur A",
    id_probleme: "PROB-456",
  },
  {
    id_intervention: "INT-005",
    date_: "2025-03-28",
    cause_defaillance: "Calibration incorrecte",
    rapport_intervention: "Recalibration capteurs",
    type_maintenance: "Préventive",
    type_defaillance: "Électronique",
    superviseur: "Moreau",
    duree: "1h30",
    numero: "T-303",
    lieu: "Laboratoire",
    id_probleme: "PROB-567",
  },
  // Ajout de plus d'entrées pour tester la pagination
  {
    id_intervention: "INT-006",
    date_: "2025-03-29",
    cause_defaillance: "Panne logicielle",
    rapport_intervention: "Mise à jour firmware",
    type_maintenance: "Corrective",
    type_defaillance: "Logiciel",
    superviseur: "Petit",
    duree: "1h00",
    numero: "T-404",
    lieu: "Salle de contrôle",
    id_probleme: "PROB-678",
  },
  {
    id_intervention: "INT-007",
    date_: "2025-03-30",
    cause_defaillance: "Vibration excessive",
    rapport_intervention: "Rééquilibrage rotor",
    type_maintenance: "Préventive",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "3h00",
    numero: "T-505",
    lieu: "Atelier principal",
    id_probleme: "PROB-789",
  },

  {
    id_intervention: "INT-001",
    date_: "2025-03-15",
    cause_defaillance: "Usure",
    rapport_intervention: "Remplacement pièce défectueuse",
    type_maintenance: "Corrective",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "2h30",
    numero: "T-456",
    lieu: "Atelier principal",
    id_probleme: "PROB-123",
  },
  {
    id_intervention: "INT-002",
    date_: "2025-03-20",
    cause_defaillance: "Surchauffe",
    rapport_intervention: "Nettoyage système refroidissement",
    type_maintenance: "Préventive",
    type_defaillance: "Thermique",
    superviseur: "Martin",
    duree: "1h45",
    numero: "T-789",
    lieu: "Secteur B",
    id_probleme: "PROB-234",
  },
  {
    id_intervention: "INT-003",
    date_: "2025-03-22",
    cause_defaillance: "Court-circuit",
    rapport_intervention: "Remplacement câblage",
    type_maintenance: "Corrective",
    type_defaillance: "Électrique",
    superviseur: "Dubois",
    duree: "3h15",
    numero: "T-101",
    lieu: "Secteur C",
    id_probleme: "PROB-345",
  },
  {
    id_intervention: "INT-004",
    date_: "2025-03-25",
    cause_defaillance: "Fuite hydraulique",
    rapport_intervention: "Remplacement joint",
    type_maintenance: "Urgence",
    type_defaillance: "Hydraulique",
    superviseur: "Leroy",
    duree: "0h45",
    numero: "T-202",
    lieu: "Secteur A",
    id_probleme: "PROB-456",
  },
  {
    id_intervention: "INT-005",
    date_: "2025-03-28",
    cause_defaillance: "Calibration incorrecte",
    rapport_intervention: "Recalibration capteurs",
    type_maintenance: "Préventive",
    type_defaillance: "Électronique",
    superviseur: "Moreau",
    duree: "1h30",
    numero: "T-303",
    lieu: "Laboratoire",
    id_probleme: "PROB-567",
  },
  // Ajout de plus d'entrées pour tester la pagination
  {
    id_intervention: "INT-006",
    date_: "2025-03-29",
    cause_defaillance: "Panne logicielle",
    rapport_intervention: "Mise à jour firmware",
    type_maintenance: "Corrective",
    type_defaillance: "Logiciel",
    superviseur: "Petit",
    duree: "1h00",
    numero: "T-404",
    lieu: "Salle de contrôle",
    id_probleme: "PROB-678",
  },
  {
    id_intervention: "INT-007",
    date_: "2025-03-30",
    cause_defaillance: "Vibration excessive",
    rapport_intervention: "Rééquilibrage rotor",
    type_maintenance: "Préventive",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "3h00",
    numero: "T-505",
    lieu: "Atelier principal",
    id_probleme: "PROB-789",
  },

  {
    id_intervention: "INT-001",
    date_: "2025-03-15",
    cause_defaillance: "Usure",
    rapport_intervention: "Remplacement pièce défectueuse",
    type_maintenance: "Corrective",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "2h30",
    numero: "T-456",
    lieu: "Atelier principal",
    id_probleme: "PROB-123",
  },
  {
    id_intervention: "INT-002",
    date_: "2025-03-20",
    cause_defaillance: "Surchauffe",
    rapport_intervention: "Nettoyage système refroidissement",
    type_maintenance: "Préventive",
    type_defaillance: "Thermique",
    superviseur: "Martin",
    duree: "1h45",
    numero: "T-789",
    lieu: "Secteur B",
    id_probleme: "PROB-234",
  },
  {
    id_intervention: "INT-003",
    date_: "2025-03-22",
    cause_defaillance: "Court-circuit",
    rapport_intervention: "Remplacement câblage",
    type_maintenance: "Corrective",
    type_defaillance: "Électrique",
    superviseur: "Dubois",
    duree: "3h15",
    numero: "T-101",
    lieu: "Secteur C",
    id_probleme: "PROB-345",
  },
  {
    id_intervention: "INT-004",
    date_: "2025-03-25",
    cause_defaillance: "Fuite hydraulique",
    rapport_intervention: "Remplacement joint",
    type_maintenance: "Urgence",
    type_defaillance: "Hydraulique",
    superviseur: "Leroy",
    duree: "0h45",
    numero: "T-202",
    lieu: "Secteur A",
    id_probleme: "PROB-456",
  },
  {
    id_intervention: "INT-005",
    date_: "2025-03-28",
    cause_defaillance: "Calibration incorrecte",
    rapport_intervention: "Recalibration capteurs",
    type_maintenance: "Préventive",
    type_defaillance: "Électronique",
    superviseur: "Moreau",
    duree: "1h30",
    numero: "T-303",
    lieu: "Laboratoire",
    id_probleme: "PROB-567",
  },
  // Ajout de plus d'entrées pour tester la pagination
  {
    id_intervention: "INT-006",
    date_: "2025-03-29",
    cause_defaillance: "Panne logicielle",
    rapport_intervention: "Mise à jour firmware",
    type_maintenance: "Corrective",
    type_defaillance: "Logiciel",
    superviseur: "Petit",
    duree: "1h00",
    numero: "T-404",
    lieu: "Salle de contrôle",
    id_probleme: "PROB-678",
  },
  {
    id_intervention: "INT-007",
    date_: "2025-03-30",
    cause_defaillance: "Vibration excessive",
    rapport_intervention: "Rééquilibrage rotor",
    type_maintenance: "Préventive",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "3h00",
    numero: "T-505",
    lieu: "Atelier principal",
    id_probleme: "PROB-789",
  },

  {
    id_intervention: "INT-001",
    date_: "2025-03-15",
    cause_defaillance: "Usure",
    rapport_intervention: "Remplacement pièce défectueuse",
    type_maintenance: "Corrective",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "2h30",
    numero: "T-456",
    lieu: "Atelier principal",
    id_probleme: "PROB-123",
  },
  {
    id_intervention: "INT-002",
    date_: "2025-03-20",
    cause_defaillance: "Surchauffe",
    rapport_intervention: "Nettoyage système refroidissement",
    type_maintenance: "Préventive",
    type_defaillance: "Thermique",
    superviseur: "Martin",
    duree: "1h45",
    numero: "T-789",
    lieu: "Secteur B",
    id_probleme: "PROB-234",
  },
  {
    id_intervention: "INT-003",
    date_: "2025-03-22",
    cause_defaillance: "Court-circuit",
    rapport_intervention: "Remplacement câblage",
    type_maintenance: "Corrective",
    type_defaillance: "Électrique",
    superviseur: "Dubois",
    duree: "3h15",
    numero: "T-101",
    lieu: "Secteur C",
    id_probleme: "PROB-345",
  },
  {
    id_intervention: "INT-004",
    date_: "2025-03-25",
    cause_defaillance: "Fuite hydraulique",
    rapport_intervention: "Remplacement joint",
    type_maintenance: "Urgence",
    type_defaillance: "Hydraulique",
    superviseur: "Leroy",
    duree: "0h45",
    numero: "T-202",
    lieu: "Secteur A",
    id_probleme: "PROB-456",
  },
  {
    id_intervention: "INT-005",
    date_: "2025-03-28",
    cause_defaillance: "Calibration incorrecte",
    rapport_intervention: "Recalibration capteurs",
    type_maintenance: "Préventive",
    type_defaillance: "Électronique",
    superviseur: "Moreau",
    duree: "1h30",
    numero: "T-303",
    lieu: "Laboratoire",
    id_probleme: "PROB-567",
  },
  // Ajout de plus d'entrées pour tester la pagination
  {
    id_intervention: "INT-006",
    date_: "2025-03-29",
    cause_defaillance: "Panne logicielle",
    rapport_intervention: "Mise à jour firmware",
    type_maintenance: "Corrective",
    type_defaillance: "Logiciel",
    superviseur: "Petit",
    duree: "1h00",
    numero: "T-404",
    lieu: "Salle de contrôle",
    id_probleme: "PROB-678",
  },
  {
    id_intervention: "INT-007",
    date_: "2025-03-30",
    cause_defaillance: "Vibration excessive",
    rapport_intervention: "Rééquilibrage rotor",
    type_maintenance: "Préventive",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "3h00",
    numero: "T-505",
    lieu: "Atelier principal",
    id_probleme: "PROB-789",
  },

  {
    id_intervention: "INT-001",
    date_: "2025-03-15",
    cause_defaillance: "Usure",
    rapport_intervention: "Remplacement pièce défectueuse",
    type_maintenance: "Corrective",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "2h30",
    numero: "T-456",
    lieu: "Atelier principal",
    id_probleme: "PROB-123",
  },
  {
    id_intervention: "INT-002",
    date_: "2025-03-20",
    cause_defaillance: "Surchauffe",
    rapport_intervention: "Nettoyage système refroidissement",
    type_maintenance: "Préventive",
    type_defaillance: "Thermique",
    superviseur: "Martin",
    duree: "1h45",
    numero: "T-789",
    lieu: "Secteur B",
    id_probleme: "PROB-234",
  },
  {
    id_intervention: "INT-003",
    date_: "2025-03-22",
    cause_defaillance: "Court-circuit",
    rapport_intervention: "Remplacement câblage",
    type_maintenance: "Corrective",
    type_defaillance: "Électrique",
    superviseur: "Dubois",
    duree: "3h15",
    numero: "T-101",
    lieu: "Secteur C",
    id_probleme: "PROB-345",
  },
  {
    id_intervention: "INT-004",
    date_: "2025-03-25",
    cause_defaillance: "Fuite hydraulique",
    rapport_intervention: "Remplacement joint",
    type_maintenance: "Urgence",
    type_defaillance: "Hydraulique",
    superviseur: "Leroy",
    duree: "0h45",
    numero: "T-202",
    lieu: "Secteur A",
    id_probleme: "PROB-456",
  },
  {
    id_intervention: "INT-005",
    date_: "2025-03-28",
    cause_defaillance: "Calibration incorrecte",
    rapport_intervention: "Recalibration capteurs",
    type_maintenance: "Préventive",
    type_defaillance: "Électronique",
    superviseur: "Moreau",
    duree: "1h30",
    numero: "T-303",
    lieu: "Laboratoire",
    id_probleme: "PROB-567",
  },
  // Ajout de plus d'entrées pour tester la pagination
  {
    id_intervention: "INT-006",
    date_: "2025-03-29",
    cause_defaillance: "Panne logicielle",
    rapport_intervention: "Mise à jour firmware",
    type_maintenance: "Corrective",
    type_defaillance: "Logiciel",
    superviseur: "Petit",
    duree: "1h00",
    numero: "T-404",
    lieu: "Salle de contrôle",
    id_probleme: "PROB-678",
  },
  {
    id_intervention: "INT-007",
    date_: "2025-03-30",
    cause_defaillance: "Vibration excessive",
    rapport_intervention: "Rééquilibrage rotor",
    type_maintenance: "Préventive",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "3h00",
    numero: "T-505",
    lieu: "Atelier principal",
    id_probleme: "PROB-789",
  },

  {
    id_intervention: "INT-001",
    date_: "2025-03-15",
    cause_defaillance: "Usure",
    rapport_intervention: "Remplacement pièce défectueuse",
    type_maintenance: "Corrective",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "2h30",
    numero: "T-456",
    lieu: "Atelier principal",
    id_probleme: "PROB-123",
  },
  {
    id_intervention: "INT-002",
    date_: "2025-03-20",
    cause_defaillance: "Surchauffe",
    rapport_intervention: "Nettoyage système refroidissement",
    type_maintenance: "Préventive",
    type_defaillance: "Thermique",
    superviseur: "Martin",
    duree: "1h45",
    numero: "T-789",
    lieu: "Secteur B",
    id_probleme: "PROB-234",
  },
  {
    id_intervention: "INT-003",
    date_: "2025-03-22",
    cause_defaillance: "Court-circuit",
    rapport_intervention: "Remplacement câblage",
    type_maintenance: "Corrective",
    type_defaillance: "Électrique",
    superviseur: "Dubois",
    duree: "3h15",
    numero: "T-101",
    lieu: "Secteur C",
    id_probleme: "PROB-345",
  },
  {
    id_intervention: "INT-004",
    date_: "2025-03-25",
    cause_defaillance: "Fuite hydraulique",
    rapport_intervention: "Remplacement joint",
    type_maintenance: "Urgence",
    type_defaillance: "Hydraulique",
    superviseur: "Leroy",
    duree: "0h45",
    numero: "T-202",
    lieu: "Secteur A",
    id_probleme: "PROB-456",
  },
  {
    id_intervention: "INT-005",
    date_: "2025-03-28",
    cause_defaillance: "Calibration incorrecte",
    rapport_intervention: "Recalibration capteurs",
    type_maintenance: "Préventive",
    type_defaillance: "Électronique",
    superviseur: "Moreau",
    duree: "1h30",
    numero: "T-303",
    lieu: "Laboratoire",
    id_probleme: "PROB-567",
  },
  // Ajout de plus d'entrées pour tester la pagination
  {
    id_intervention: "INT-006",
    date_: "2025-03-29",
    cause_defaillance: "Panne logicielle",
    rapport_intervention: "Mise à jour firmware",
    type_maintenance: "Corrective",
    type_defaillance: "Logiciel",
    superviseur: "Petit",
    duree: "1h00",
    numero: "T-404",
    lieu: "Salle de contrôle",
    id_probleme: "PROB-678",
  },
  {
    id_intervention: "INT-007",
    date_: "2025-03-30",
    cause_defaillance: "Vibration excessive",
    rapport_intervention: "Rééquilibrage rotor",
    type_maintenance: "Préventive",
    type_defaillance: "Mécanique",
    superviseur: "Dupont",
    duree: "3h00",
    numero: "T-505",
    lieu: "Atelier principal",
    id_probleme: "PROB-789",
  },
];

const InterventionsTable = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const navigate = useNavigate(); // ou useRouter() avec Next.js

  // Définition des colonnes
  const columns: ColumnDef<Intervention>[] = [
    {
      accessorKey: "numero",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>Numéro</span>
        </div>
      ),
      cell: ({ row }) => {
        const numero = row.getValue("numero") as string;
        return (
          <Button
            variant="link"
            className="p-0 h-auto cursor-pointer hover:underline font-medium text-primary"
            onClick={() => navigateToDetail(numero)}
          >
            {numero}
          </Button>
        );
      },
    },
    {
      accessorKey: "date_",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Date</span>
        </div>
      ),
      cell: ({ row }) => {
        const date = row.getValue("date_") as string;
        // Formatage de date si nécessaire
        return <div>{date}</div>;
      },
    },
    {
      accessorKey: "cause_defaillance",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <span>Cause défaillance</span>
        </div>
      ),
    },
    {
      accessorKey: "rapport_intervention",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>Rapport</span>
        </div>
      ),
    },
    {
      accessorKey: "type_maintenance",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span>Type maintenance</span>
        </div>
      ),
      cell: ({ row }) => {
        const type = row.getValue("type_maintenance") as string;
        // Couleur conditionnelle selon le type de maintenance
        const getTypeColor = (type: string) => {
          switch (type.toLowerCase()) {
            case "préventive":
              return "bg-blue-100 text-blue-800";
            case "corrective":
              return "bg-amber-100 text-amber-800";
            case "prédictive":
              return "bg-green-100 text-green-800";
            default:
              return "bg-gray-100 text-gray-800";
          }
        };

        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${getTypeColor(
              type
            )}`}
          >
            {type}
          </div>
        );
      },
    },
    {
      accessorKey: "type_defaillance",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-muted-foreground" />
          <span>Type défaillance</span>
        </div>
      ),
    },
    {
      accessorKey: "superviseur",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <UserCircle className="h-4 w-4 text-muted-foreground" />
          <span>Superviseur</span>
        </div>
      ),
    },
    {
      accessorKey: "duree",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>Durée</span>
        </div>
      ),
    },
    {
      accessorKey: "lieu",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>Lieu</span>
        </div>
      ),
    },
    {
      accessorKey: "id_probleme",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span>ID problème</span>
        </div>
      ),
      cell: ({ row }) => {
        const id = row.getValue("id_probleme") as string | number;
        return id ? (
          <Badge variant="outline" className="font-mono">
            {id}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        );
      },
    },
    {
      id: "actions",
      header: ({ column }) => (
        <div className="flex items-center gap-2 justify-end">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span>Actions</span>
        </div>
      ),
      cell: ({ row }) => {
        const intervention = row.original;
        const [showDeleteDialog, setShowDeleteDialog] = useState(false);

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Ouvrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ActivitySquare className="h-4 w-4" />
                  <span>Actions sur l'intervention</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 p-2 cursor-pointer"
                  onClick={() => handleConsulter(intervention.id_intervention)}
                >
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span>Consulter les détails</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 p-2 cursor-pointer"
                  onClick={() => handleModifier(intervention.id_intervention)}
                >
                  <Pencil className="h-4 w-4 text-amber-500" />
                  <span>Modifier l'intervention</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 p-2 text-red-500 cursor-pointer"
                  // Utilisation d'une fonction pour éviter la fermeture automatique du menu
                  onSelect={(event) => {
                    // Empêcher la fermeture du menu
                    event.preventDefault();
                    // Ouvrir la boîte de dialogue
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash className="h-4 w-4" />
                  <span>Supprimer l'intervention</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* AlertDialog séparé du DropdownMenu */}
            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Confirmer la suppression
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer l'intervention{" "}
                    {intervention.numero} ? Cette action est irréversible et
                    supprimera définitivement toutes les données associées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      handleSupprimer(intervention.id_intervention);
                      setShowDeleteDialog(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  ];

  // Fonctions de gestion des actions
  const handleConsulter = (id: string | number) => {
    navigate(`/interventions/${id}`);
    // Ajoutez ici la logique pour consulter l'intervention
  };

  const handleModifier = (id: string | number) => {
    navigate(`/interventions/${id}/editer`);
    // Ajoutez ici la logique pour modifier l'intervention
  };

  const handleSupprimer = (id: string | number) => {
    console.log(`Suppression de l'intervention ${id}`);
    // Ajoutez ici la logique pour supprimer l'intervention
    // Idéalement avec une confirmation avant suppression
  };

  // Navigation vers la page de détails de l'intervention
  const navigateToDetail = (numero: string) => {
    // Adaptez le chemin selon votre structure de routes${numero}
    navigate(`/interventions/${numero}`);
    // Pour Next.js: router.push(`/interventions/${numero}`);
  };

  // Initialisation de la table
  const table = useReactTable({
    data: interventionsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      globalFilter,
      rowSelection,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <Layout autre={NavComponent}>
      <div className="space-y-4 flex flex-col p-4 w-full">
        {/* Contrôles de filtre et de colonnes */}
        <div className="flex gap-4 justify-between items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Rechercher une intervention..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 w-96"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {" "}
                <TableOfContents /> Colonnes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id.replace(/_/g, " ")}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border flex-1 overflow-hidden relative h-full max-h-[calc(100vh-300px)] flex flex-col  lg:max-w-[calc(100vw-320px)] ">
          {/* Conteneur scrollable */}
          <ScrollArea className="h-full w-full" type="always">
            <div className=" h-[calc(100vh-300px)] ">
              <Table className="min-w-full">
                <TableHeader className="sticky top-0 bg-background z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        Aucun résultat.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} sur{" "}
            {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Lignes par page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} sur{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Aller à la première page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Aller à la page précédente</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Aller à la page suivante</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Aller à la dernière page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default InterventionsTable;