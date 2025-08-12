import React, { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";

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
import { FileDown, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const logoSrc = "/Logodcat.jpg";

// Fonction utilitaire pour charger l'image en base64
const loadImageAsBase64 = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");
        resolve(dataUrl);
      } else {
        reject(new Error("Impossible de créer le contexte canvas"));
      }
    };
    img.onerror = () => {
      reject(new Error("Erreur lors du chargement de l'image"));
    };
    img.src = src;
  });
};

interface MonthlyReportProps {
  onViewIntervention?: (intervention: Intervention) => void;
}

export const MonthlyReport: React.FC<MonthlyReportProps> = () => {
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState("");

  useEffect(() => {
    // Charger l'image en base64 au chargement du composant
    loadImageAsBase64(logoSrc)
      .then((dataUrl) => {
        setLogoDataUrl(dataUrl);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement du logo:", error);
        setLogoDataUrl("");
      });
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


  const generateExcelContent = () => {
    // Créer le contenu CSV avec la nouvelle structure
    const headers = ["Date", "Problème signalé", "Cause", "Mode d'intervention", "Action menée", "Recommandation", "Durée"];
    const rows = interventions.map((intervention) => [
      (() => {
        const date = new Date(intervention.date_intervention);
        return isNaN(date.getTime()) ? '-' : format(date, "dd/MM/yyyy");
      })(),
      intervention.probleme_signale || "",
      intervention.cause_defaillance || "",
      intervention.mode_intervention || "",
      intervention.rapport_intervention || "",
      intervention.recommandation || "",
      intervention.duree || "",
    ]);

    // Ajouter la ligne de durée totale
    const totalDurationRow = [
      "",
      "",
      "",
      "",
      "",
      "DURÉE TOTALE",
      calculateTotalDuration(),
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      totalDurationRow.map((cell) => `"${cell}"`).join(","),
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
      (() => {
        const date = new Date(intervention.date_intervention);
        return isNaN(date.getTime()) ? '-' : format(date, "dd/MM/yyyy");
      })(),
      intervention.probleme_signale || "",
      intervention.cause_defaillance || "",
      intervention.mode_intervention || "",
      intervention.rapport_intervention || "",
      intervention.recommandation || "",
      intervention.duree || "",
    ]);

    // Créer le contenu PDF avec des styles améliorés et le logo
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>TABLEAU RÉCAPITULATIF DES INTERVENTIONS MENSUELLES - ${monthName}</title>
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
          th { background-color: #2563eb; color: white; padding: 10px; font-size: 11px; }
          td { padding: 8px; border: 1px solid #ddd; font-size: 10px; }
          tr:nth-child(even) { background-color: #f8f9fa; }
          .total-row { 
            background-color: #2563eb !important; 
            color: white; 
            font-weight: bold; 
            font-size: 11px;
          }
          .total-row td { 
            border: 1px solid #1d4ed8; 
            color: white; 
          }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="logo-container">
          ${logoDataUrl ? `
          <img 
            src="${logoDataUrl}"
            alt="Logo DCAT"
            class="logo"
            style="display: block !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;"
          />
          ` : `
          <div class="logo-placeholder" style="width: 150px; height: 60px; background-color: #2563eb; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 8px; margin: 0 auto;">
            DCAT
          </div>
          `}
        </div>
        <div class="header">
          <h1>Rapport Mensuel des Interventions</h1>
          <p style="text-align: center;">Période : ${monthName}</p>
        </div>
        
        

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Problème signalé</th>
              <th>Cause</th>
              <th>Mode d'intervention</th>
              <th>Action menée</th>
              <th>Recommandation</th>
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
            <tr class="total-row">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td><strong>DURÉE TOTALE</strong></td>
              <td><strong>${calculateTotalDuration()}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="stats">
          <p><strong>Nombre total d'interventions :</strong> ${interventions.length} | <strong>Durée totale :</strong> ${calculateTotalDuration()} | <strong>Date de génération :</strong> ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: fr })}</p>
        </div>

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
          }, 2000); // Augmenté à 2 secondes pour s'assurer que l'image est chargée
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
                      <TableHead>Problème signalé</TableHead>
                      <TableHead>Cause</TableHead>
                      <TableHead>Mode d'intervention</TableHead>
                      <TableHead>Action menée</TableHead>
                      <TableHead>Recommandation</TableHead>
                      <TableHead>Durée</TableHead>
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
                          <TableCell className="max-w-xs truncate">
                            {intervention.probleme_signale}
                          </TableCell>
                          <TableCell>
                            {intervention.cause_defaillance}
                          </TableCell>
                          <TableCell>
                            {intervention.mode_intervention}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {intervention.rapport_intervention}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {intervention.recommandation}
                          </TableCell>
                          <TableCell>{intervention.duree}</TableCell>
                        </TableRow>
                      ))
                    )}
                    {/* Ligne de durée totale */}
                    {interventions.length > 0 && (
                      <TableRow className="bg-blue-50 font-semibold">
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-blue-600">DURÉE TOTALE</TableCell>
                        <TableCell className="text-blue-600 font-bold">
                          {calculateTotalDuration()}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
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
