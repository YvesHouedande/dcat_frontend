import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Pencil } from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  User,
  Users,
  AlertTriangle,
  Activity,
  FileText,
  Clock,
  Package,
  Clipboard,
  CheckSquare,
} from "lucide-react";

const NavComponent = () => {
  const { id } = useParams();

  return (
    <div className="flex space-x-4">
      <Link
        className="flex items-center space-x-2"
        to={`/interventions/modifier_intervention/${id}`}
        aria-label="Modify intervention"
      >
        <Button
          className="cursor-pointer transition ease-in-out duration-300 active:scale-95"
          variant="outline"
          aria-label="Modify intervention link"
        >
          <span>Modifier </span>
          <Pencil />
        </Button>
      </Link>
    </div>
  );
};

function Information_fiche() {
  const selectedProductsData: {
    id: string;
    designation: string;
    marque: string;
    reference: string;
  }[] = [];
  const { id } = useParams();
  return (
    <Layout autre={NavComponent}>
      <div className="flex w-full flex-col justify-center items-center uppercase font-bold text-xl mt-4 text-blue-700">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6" />
          INFORMATION DE L'INTERVENTION N° {id}
        </div>
        <div className="w-32 h-1.5 bg-blue-600 mt-1 rounded-full"></div>
      </div>

      <div className="w-full mt-6 p-4 border border-dotted rounded-md bg-gray-50 shadow-sm">
        <p className="w-full text-center mb-4 uppercase font-semibold text-blue-700 flex items-center justify-center gap-2">
          <Clipboard className="w-5 h-5" />
          COMPTE-RENDU
        </p>
        <div className="w-full flex items-start justify-between max-lg:flex-col max-lg:space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5 bg-white p-3 rounded-md shadow-sm">
            <Label
              htmlFor="date"
              className="flex items-center gap-2 text-blue-700"
            >
              <Calendar className="w-4 h-4" />
              Date
            </Label>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 bg-white p-3 rounded-md shadow-sm">
            <Label
              htmlFor="client"
              className="flex items-center gap-2 text-blue-700"
            >
              <User className="w-4 h-4" />
              Client
            </Label>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 p-3 rounded-md bg-white shadow-sm">
            <Label
              htmlFor="Intervenant"
              className="flex items-center gap-2 text-blue-700"
            >
              <Users className="w-4 h-4" />
              Intervenants
            </Label>
            <div className="flex w-full items-center mt-2 hover:bg-gray-50 p-2 rounded-md transition-colors">
              <Avatar className="border-2 border-blue-200">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>DCAT</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="text-base font-medium">Nom de l'utilisateur</p>
                <p className="text-sm text-gray-500">Poste de l'utilisateur</p>
              </div>
            </div>
            <div className="flex w-full items-center mt-1 hover:bg-gray-50 p-2 rounded-md transition-colors">
              <Avatar className="border-2 border-blue-200">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>DCAT</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="text-base font-medium">Nom de l'utilisateur</p>
                <p className="text-sm text-gray-500">Poste de l'utilisateur</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-6 p-4 border border-dotted rounded-md bg-gray-50 shadow-sm">
        <p className="w-full text-center mb-4 uppercase font-semibold text-red-600 flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Problème Signalé
        </p>
      </div>

      <div className="w-full mt-6 p-4 border border-dotted rounded-md bg-gray-50 shadow-sm">
        <div className="w-full flex items-start justify-between max-lg:flex-col max-lg:space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5 bg-white p-3 rounded-md shadow-sm">
            <Label
              className="uppercase flex items-center gap-2 text-blue-700"
              htmlFor="date"
            >
              Type de Maintenance
            </Label>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 bg-white p-3 rounded-md shadow-sm">
            <Label
              className="uppercase flex items-center gap-2 text-red-600"
              htmlFor="client"
            >
              <AlertTriangle className="w-4 h-4" />
              Type de Défaillance
            </Label>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 p-3 rounded-md bg-white shadow-sm">
            <Label
              className="uppercase flex items-center gap-2 text-amber-600"
              htmlFor="Intervenant"
            >
              <Activity className="w-4 h-4" />
              Cause de Défaillance
            </Label>
          </div>
        </div>
      </div>

      <div className="w-full mt-6 p-4 border border-dotted rounded-md bg-gray-50 shadow-sm">
        <p className="w-full text-center mb-4 uppercase font-semibold text-amber-600 flex items-center justify-center gap-2">
          <Activity className="w-5 h-5" />
          Cause liée à la défaillance
        </p>
      </div>

      <div className="w-full mt-6 p-4 border border-dotted rounded-md bg-gray-50 shadow-sm">
        <p className="w-full text-center mb-4 uppercase font-semibold text-green-600 flex items-center justify-center gap-2">
          <FileText className="w-5 h-5" />
          Rapport d'intervention / recommandation
        </p>
        <div className="flex max-lg:flex-col max-lg:space-y-4">
          <p className="w-full"></p>
          <div className="border-l ml-2 p-2 border-green-300">
            <Label
              className="mb-1 flex items-center gap-2 text-green-600"
              htmlFor="durée"
            >
              <Clock className="w-4 h-4" />
              Durée
            </Label>
            <p className="w-24"></p>
          </div>
        </div>
      </div>

      <div className="w-full mt-6 p-4 border border-dotted rounded-md bg-gray-50 shadow-sm">
        <p className="w-full text-center mb-4 uppercase font-semibold text-purple-600 flex items-center justify-center gap-2">
          <Package className="w-5 h-5" />
          Pièces de rechange
        </p>
        <div className="w-full space-y-4">
          <div className="border rounded-md overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-purple-50">
                <TableRow>
                  <TableHead className="font-semibold">Désignation</TableHead>
                  <TableHead className="font-semibold">Marque</TableHead>
                  <TableHead className="font-semibold">Référence</TableHead>
                  <TableHead className="font-semibold">Quantité</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProductsData.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-purple-50 transition-colors"
                  >
                    <TableCell>{product.designation}</TableCell>
                    <TableCell>{product.marque}</TableCell>
                    <TableCell>{product.reference}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <p></p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="w-full mt-6 mb-6 p-4 border border-dotted rounded-md bg-gray-50 shadow-sm">
        <p className="w-full text-center mb-4 uppercase font-semibold text-blue-700 flex items-center justify-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Visa
        </p>
        <div className="flex max-lg:flex-col max-lg:space-y-4">
          <div className="ml-2 p-3 w-full bg-white rounded-md shadow-sm">
            <Label
              className="mb-1 flex items-center gap-2 text-blue-700"
              htmlFor="durée"
            >
              <User className="w-4 h-4" />
              Superviseur (Nom-signature-cachet)
            </Label>
          </div>
          <div className="border-l border-blue-300 w-full ml-2 p-3 bg-white rounded-md shadow-sm">
            <Label
              className="mb-2 flex items-center gap-2 text-blue-700"
              htmlFor="Intervenant"
            >
              <Users className="w-4 h-4" />
              Intervenants DCAT
            </Label>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Information_fiche;
