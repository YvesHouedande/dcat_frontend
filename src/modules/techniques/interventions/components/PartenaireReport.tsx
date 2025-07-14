import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Intervention, Partenaire } from "../interface/interface";
import { getInterventionsByPartenaire } from "../api/intervention";
import { fetchPartners } from "@/modules/administration-Finnance/services/partenaireService";
import { FileDown, Eye, ChevronDown, Building2 } from "lucide-react";
import { toast } from "sonner";

const logoSrc = "/dcat-logo.png";

// Interface pour la structure de données reçue de l'API
interface InterventionData {
  intervention: Intervention;
  partenaire: Partenaire;
}

interface PartenaireReportProps {
  onViewIntervention?: (intervention: Intervention) => void;
}

export const PartenaireReport: React.FC<PartenaireReportProps> = ({
  onViewIntervention = () => {},
}) => {
  const navigate = useNavigate();
  const [selectedPartenaireId, setSelectedPartenaireId] = useState<string>("");
  // La liste des interventions doit maintenant correspondre à la structure de données réelle
  const [interventionsData, setInterventionsData] = useState<InterventionData[]>([]);
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState("");

  useEffect(() => {
    // Convertir l'image en base64 au chargement du composant
    const img = new Image();
    img.src = logoSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setLogoDataUrl(dataUrl);
      }
    };

    // Charger la liste des partenaires
    loadPartenaires();
  }, []);

  const loadPartenaires = async () => {
    try {
      const partenairesData = await fetchPartners();
      setPartenaires(partenairesData);
      // Sélectionnez le premier partenaire par défaut si la liste n'est pas vide
      if (partenairesData.length > 0 && !selectedPartenaireId) {
        setSelectedPartenaireId(partenairesData[0].id_partenaire.toString());
      }
    } catch (error) {
      console.error("Erreur lors du chargement des partenaires:", error);
      toast.error("Erreur lors du chargement des partenaires");
    }
  };

  const loadInterventions = useCallback(async () => {
    if (!selectedPartenaireId) {
      setInterventionsData([]); // Utilisez la nouvelle variable d'état
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getInterventionsByPartenaire(
        parseInt(selectedPartenaireId)
      );
      // On s'assure que response.data est bien un tableau de InterventionData
      // Si ce n'est pas le cas, on transforme les données reçues
      if (Array.isArray(response.data)) {
        // Utilise le type guard pour garantir la sécurité de typage
        const interventionsData = (response.data as unknown[]).map((item) => {
          if (isInterventionData(item)) {
            return item;
          }
          return {
            intervention: item as Intervention,
            partenaire: getSelectedPartenaire()!,
          };
        });
        setInterventionsData(interventionsData);
      } else {
        setInterventionsData([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedPartenaireId]);

  useEffect(() => {
    loadInterventions();
  }, [loadInterventions]);

  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    interventionsData.forEach((item) => { // Itérez sur interventionsData
      const duration = item.intervention.duree; // Accès corrigé
      if (typeof duration === 'string' && duration) {
        const matches = duration.match(/(\d+)h(?:(\d+))?/);
        if (matches) {
          const hours = parseInt(matches[1]) || 0;
          const minutes = parseInt(matches[2]) || 0;
          totalMinutes += hours * 60 + minutes;
        }
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes ? minutes.toString().padStart(2, '0') : ""}`;
  };

  const getSelectedPartenaire = () => {
    return partenaires.find(
      (p) => p.id_partenaire.toString() === selectedPartenaireId
    );
  };

  const handleViewIntervention = (intervention: Intervention) => {
    if (onViewIntervention) {
      onViewIntervention(intervention);
    } else {
      navigate(`/technique/interventions/${intervention.id_intervention}`);
    }
  };

  const generateExcelContent = () => {
    const selectedPartenaire = getSelectedPartenaire();
    const headers = ["Date", "Type", "Problème", "Cause", "Actions", "Durée"];
    const rows = interventionsData.map((item) => [ // Itérez sur interventionsData
      (() => {
        const date = new Date(item.intervention.date_intervention); // Accès corrigé
        return isNaN(date.getTime()) ? '-' : format(date, "dd/MM/yyyy");
      })(),
      item.intervention.type_intervention ?? "",
      item.intervention.probleme_signale ?? "",
      item.intervention.cause_defaillance ?? "",
      item.intervention.rapport_intervention ?? "",
      item.intervention.duree ?? "",
    ]);

    const csvContent = [
      `Rapport d'interventions - ${selectedPartenaire?.nom_partenaire || "Partenaire"}`,
      `Généré le: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: fr })}`,
      "",
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    return csvContent;
  };

  const generatePDFContent = () => {
    const selectedPartenaire = getSelectedPartenaire();
    const partenaireName = selectedPartenaire?.nom_partenaire || "Partenaire inconnu";

    const rows = interventionsData.map((item) => [ // Itérez sur interventionsData
      (() => {
        const date = new Date(item.intervention.date_intervention); // Accès corrigé
        return isNaN(date.getTime()) ? '-' : format(date, "dd/MM/yyyy");
      })(),
      item.intervention.type_intervention ?? "",
      item.intervention.probleme_signale ?? "",
      item.intervention.cause_defaillance ?? "",
      item.intervention.rapport_intervention ?? "",
      item.intervention.duree ?? "",
    ]);

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Rapport d'Interventions - ${partenaireName}</title>
        <style>
          @page { size: A4 landscape; margin: 2cm; }
          body { 
            font-family: Arial, sans-serif;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .logo-container { 
            text-align: center; 
            margin-bottom: 20px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .logo { 
            width: 150px; 
            height: auto; 
            max-width: 100%;
            object-fit: contain;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @media print {
            .logo-container {
              display: block !important;
              page-break-inside: avoid;
            }
            .logo {
              display: block !important;
            }
            img {
              display: block !important;
              page-break-inside: avoid;
            }
          }
          h1 { color: #2563eb; text-align: center; margin-top: 10px; }
          .header { margin-bottom: 20px; }
          .partenaire-info { 
            margin-bottom: 20px; 
            background: #f3f4f6; 
            padding: 15px; 
            border-radius: 5px;
            border-left: 4px solid #2563eb;
          }
          .stats { margin-bottom: 20px; background: #f8f9fa; padding: 10px; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #2563eb; color: white; padding: 10px; text-align: left; }
          td { padding: 8px; border: 1px solid #ddd; vertical-align: top; }
          tr:nth-child(even) { background-color: #f8f9fa; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="logo-container">
          <img 
            src="${logoDataUrl}"
            alt="Logo DCAT"
            class="logo"
            style="display: block !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;"
          />
        </div>
        <div class="header">
          <h1>Rapport d'Interventions par Partenaire</h1>
          <p style="text-align: center;">Partenaire : ${partenaireName}</p>
        </div>
        
        <div class="partenaire-info">
          <h3>Informations du partenaire</h3>
          <p><strong>Nom :</strong> ${selectedPartenaire?.nom_partenaire || "N/A"}</p>
        </div>
        
        <div class="stats">
          <p><strong>Nombre total d'interventions :</strong> ${interventionsData.length}</p>
          <p><strong>Durée totale :</strong> ${calculateTotalDuration()}</p>
          <p><strong>Date de génération :</strong> ${format(
            new Date(),
            "dd MMMM yyyy HH:mm",
            { locale: fr }
          )}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Problème</th>
              <th>Cause</th>
              <th>Actions</th>
              <th>Durée</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
              <tr>
                ${row.map((cell) => `<td>${cell}</td>`).join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>Document généré automatiquement par le système de gestion des interventions</p>
        </div>
      </body>
      </html>
    `;

    return content;
  };

  const handleExport = async (formatType: "pdf" | "excel") => {
    if (!selectedPartenaireId) {
      toast.error("Veuillez sélectionner un partenaire pour générer le rapport.");
      return;
    }
    if (interventionsData.length === 0) { // Vérifiez interventionsData
        toast.info("Aucune intervention à exporter pour le partenaire sélectionné.");
        return;
    }

    setIsGeneratingReport(true);
    try {
      const selectedPartenaire = getSelectedPartenaire();
      let content, fileName, type;

      if (formatType === "excel") {
        content = generateExcelContent();
        fileName = `rapport-interventions-${
          selectedPartenaire?.nom_partenaire?.replace(/\s+/g, "-") || "partenaire"
        }.csv`;
        type = "text/csv;charset=utf-8;";
      } else {
        content = generatePDFContent();
        fileName = `rapport-interventions-${
          selectedPartenaire?.nom_partenaire?.replace(/\s+/g, "-") || "partenaire"
        }.pdf`;
        type = "text/html";
      }

      const blob = new Blob([content], { type });

      if (formatType === "pdf") {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(content);
          printWindow.document.close();
          setTimeout(() => {
            printWindow.print();
          }, 1000);
        }
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      toast.success(`Rapport exporté avec succès en format ${formatType.toUpperCase()}`);
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      toast.error(`Erreur lors de l'export en ${formatType.toUpperCase()}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Type guard pour vérifier si un objet est de type InterventionData
  function isInterventionData(obj: unknown): obj is InterventionData {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "intervention" in obj &&
      "partenaire" in obj
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Rapport d'Interventions par Partenaire</CardTitle>
              <CardDescription>
                Récapitulatif des interventions pour le partenaire sélectionné
              </CardDescription>
            </div>
            <div className="flex gap-4">
              <Select
                value={selectedPartenaireId}
                onValueChange={(value) => setSelectedPartenaireId(value)}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Sélectionner un partenaire" />
                </SelectTrigger>
                <SelectContent>
                  {partenaires.length === 0 ? (
                    <SelectItem value="no-partenaire" disabled>
                      Aucun partenaire disponible
                    </SelectItem>
                  ) : (
                    partenaires.map((partenaire) => (
                      <SelectItem
                        key={partenaire.id_partenaire}
                        value={partenaire.id_partenaire.toString()}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {partenaire.nom_partenaire}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={
                      isGeneratingReport ||
                      !selectedPartenaireId ||
                      interventionsData.length === 0 || // Utilisez interventionsData
                      partenaires.length === 0
                    }
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    {isGeneratingReport ? "Export..." : "Exporter"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport("pdf")}>
                    Exporter en PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("excel")}>
                    Exporter en Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedPartenaireId && partenaires.length > 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Sélectionnez un partenaire pour voir ses interventions.</p>
            </div>
          ) : partenaires.length === 0 && !isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
                <p>Aucun partenaire n'est disponible.</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-4">Chargement des interventions...</div>
          ) : (
            <>
              {getSelectedPartenaire() && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Informations du partenaire
                  </h3>
                  <div className="text-sm">
                    <span className="font-medium">Nom :</span>{" "}
                    {getSelectedPartenaire()?.nom_partenaire}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Nombre total d'interventions : {interventionsData.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Durée totale : {calculateTotalDuration()}
                </p>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Problème</TableHead>
                      <TableHead>Cause</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead>Recommandations</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interventionsData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          Aucune intervention pour ce partenaire
                        </TableCell>
                      </TableRow>
                    ) : (
                      interventionsData.map((item) => ( // Itérez sur interventionsData
                        <TableRow key={item.intervention.id_intervention}>
                          <TableCell>
                            {format(
                              new Date(item.intervention.date_intervention), // Accès corrigé
                              "dd/MM/yyyy"
                            )}
                          </TableCell>
                          <TableCell>{item.intervention.type_intervention}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {item.intervention.probleme_signale}
                          </TableCell>
                          <TableCell>{item.intervention.cause_defaillance}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {item.intervention.rapport_intervention}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {item.intervention.recommandation}
                          </TableCell>
                          <TableCell>{item.intervention.duree}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewIntervention(item.intervention)} // Passer l'objet intervention réel
                              className="hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="ml-2">Détails</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};