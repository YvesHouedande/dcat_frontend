import React, { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import logoSrc from "../../../../assets/dcat-logo.jpg";
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
import { Intervention } from "../interface/interface";
import { getInterventions } from "../api/intervention";
import { FileDown, Eye, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface MonthlyReportProps {
  onViewIntervention?: (intervention: Intervention) => void;
}

export const MonthlyReport: React.FC<MonthlyReportProps> = ({
  onViewIntervention = () => {},
}) => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [interventions, setInterventions] = useState<Intervention[]>([]);
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
  }, []);

  const loadInterventions = useCallback(async () => {
    setIsLoading(true);
    try {
      const [year, month] = selectedMonth.split("-").map(Number);
      const startDate = startOfMonth(new Date(year, month - 1));
      const endDate = endOfMonth(new Date(year, month - 1));

      const response = await getInterventions();
      const monthlyInterventions = (response.data || []).filter(
        (intervention) => {
          const interventionDate = new Date(intervention.date_intervention);
          return interventionDate >= startDate && interventionDate <= endDate;
        }
      );

      setInterventions(monthlyInterventions);
    } catch (error) {
      console.error("Erreur lors du chargement des interventions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    loadInterventions();
  }, [loadInterventions]);

  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    interventions.forEach((intervention) => {
      const duration = intervention.duree;
      const matches = duration.match(/(\d+)h(?:(\d+))?/);
      if (matches) {
        const hours = parseInt(matches[1]) || 0;
        const minutes = parseInt(matches[2]) || 0;
        totalMinutes += hours * 60 + minutes;
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes ? minutes : ""}`;
  };

  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Générer les options pour les 12 derniers mois
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentDate.getMonth() - i, 1);
      const value = format(date, "yyyy-MM");
      const label = format(date, "MMMM yyyy", { locale: fr });
      options.push({ value, label });
    }

    return options;
  };

  const handleViewIntervention = (intervention: Intervention) => {
    if (onViewIntervention) {
      onViewIntervention(intervention);
    } else {
      navigate(`/technique/interventions/${intervention.id_intervention}`);
    }
  };

  const generateExcelContent = () => {
    // Créer le contenu CSV
    const headers = ["Date", "Type", "Problème", "Cause", "Actions", "Durée"];
    const rows = interventions.map((intervention) => [
      format(new Date(intervention.date_intervention), "dd/MM/yyyy"),
      intervention.type_intervention,
      intervention.probleme_signale,
      intervention.cause_defaillance,
      intervention.rapport_intervention,
      intervention.duree,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return csvContent;
  };

  const generatePDFContent = () => {
    const [year, month] = selectedMonth.split("-");
    const monthName = format(
      new Date(parseInt(year), parseInt(month) - 1),
      "MMMM yyyy",
      { locale: fr }
    );

    const rows = interventions.map((intervention) => [
      format(new Date(intervention.date_intervention), "dd/MM/yyyy"),
      intervention.type_intervention,
      intervention.probleme_signale,
      intervention.cause_defaillance,
      intervention.rapport_intervention,
      intervention.duree,
    ]);

    // Créer le contenu PDF avec des styles améliorés et le logo
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Rapport Mensuel des Interventions - ${monthName}</title>
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
          .stats { margin-bottom: 20px; background: #f3f4f6; padding: 10px; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #2563eb; color: white; padding: 10px; }
          td { padding: 8px; border: 1px solid #ddd; }
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
          <h1>Rapport Mensuel des Interventions</h1>
          <p style="text-align: center;">Période : ${monthName}</p>
        </div>
        
        <div class="stats">
          <p><strong>Nombre total d'interventions :</strong> ${
            interventions.length
          }</p>
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

  const handleExport = async (format: "pdf" | "excel") => {
    setIsGeneratingReport(true);
    try {
      let content, fileName, type;

      if (format === "excel") {
        content = generateExcelContent();
        fileName = `rapport-interventions-${selectedMonth}.csv`;
        type = "text/csv";
      } else {
        content = generatePDFContent();
        fileName = `rapport-interventions-${selectedMonth}.pdf`;
        type = "text/html";
      }

      // Créer le Blob avec le bon type MIME
      const blob = new Blob([content], { type });

      // Pour PDF, ouvrir dans un nouvel onglet pour l'impression
      if (format === "pdf") {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(content);
          printWindow.document.close();
          // Attendre que l'image soit chargée avant d'imprimer
          setTimeout(() => {
            printWindow.print();
          }, 1000);
        }
      } else {
        // Pour Excel, télécharger directement
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      toast.success(
        `Rapport exporté avec succès en format ${format.toUpperCase()}`
      );
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      toast.error(`Erreur lors de l'export en ${format.toUpperCase()}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Rapport Mensuel des Interventions</CardTitle>
              <CardDescription>
                Récapitulatif des interventions pour le mois sélectionné
              </CardDescription>
            </div>
            <div className="flex gap-4">
              <Select
                value={selectedMonth}
                onValueChange={(value) => setSelectedMonth(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {generateMonthOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isGeneratingReport || interventions.length === 0}
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
          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Nombre total d'interventions : {interventions.length}
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
                    {interventions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          Aucune intervention pour ce mois
                        </TableCell>
                      </TableRow>
                    ) : (
                      interventions.map((intervention) => (
                        <TableRow key={intervention.id_intervention}>
                          <TableCell>
                            {format(
                              new Date(intervention.date_intervention),
                              "dd/MM/yyyy"
                            )}
                          </TableCell>
                          <TableCell>
                            {intervention.type_intervention}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {intervention.probleme_signale}
                          </TableCell>
                          <TableCell>
                            {intervention.cause_defaillance}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {intervention.rapport_intervention}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {intervention.recommandation}
                          </TableCell>
                          <TableCell>{intervention.duree}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleViewIntervention(intervention)
                              }
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
