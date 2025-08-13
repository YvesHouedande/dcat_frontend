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
import { Intervention, Partenaire } from "../interface/interface";
import { getInterventionsByPartenaire } from "../api/intervention";
import { usePartenaireApi } from "@/modules/administration-Finnance/services/partenaireService";
import { FileDown, ChevronDown, Building2 } from "lucide-react";
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

// Interface pour la structure de données reçue de l'API
interface InterventionData {
  intervention: Intervention;
  partenaire: Partenaire;
}

interface PartenaireReportProps {
  onViewIntervention?: (intervention: Intervention) => void;
}

export const PartenaireReport: React.FC<PartenaireReportProps> = () => {
  const [selectedPartenaireId, setSelectedPartenaireId] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  // La liste des interventions doit maintenant correspondre à la structure de données réelle
  const [interventionsData, setInterventionsData] = useState<
    InterventionData[]
  >([]);
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const { fetchPartnersWithoutInterlocuteurs } = usePartenaireApi();

  // Charger les partenaires pour la sélection
  const loadPartenaires = useCallback(async () => {
    try {
      const partenairesData = await fetchPartnersWithoutInterlocuteurs(1, 100);
      setPartenaires(partenairesData.data);
    } catch (error) {
      console.error("Erreur lors du chargement des partenaires:", error);
    }
  }, [fetchPartnersWithoutInterlocuteurs]);
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

    // Charger la liste des partenaires
    loadPartenaires();
  }, [fetchPartnersWithoutInterlocuteurs, loadPartenaires]);

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
      
      // Filtrer les interventions par mois si une période est sélectionnée
      let filteredData = response.data || [];
      if (selectedMonth && response.data) {
        const [year, month] = selectedMonth.split("-").map(Number);
        const startDate = startOfMonth(new Date(year, month - 1));
        const endDate = endOfMonth(new Date(year, month - 1));
        
        filteredData = response.data.filter((item: unknown) => {
          const intervention = (item as { date_intervention?: string; intervention?: { date_intervention?: string } });
          const interventionDate = new Date(intervention.date_intervention || intervention.intervention?.date_intervention || '');
          return interventionDate >= startDate && interventionDate <= endDate;
        });
      }
      
      // On s'assure que response.data est bien un tableau de InterventionData
      // Si ce n'est pas le cas, on transforme les données reçues
      if (Array.isArray(filteredData)) {
        // Utilise le type guard pour garantir la sécurité de typage
        const interventionsData = (filteredData as unknown[]).map((item) => {
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
  }, [selectedPartenaireId, selectedMonth]);

  useEffect(() => {
    loadInterventions();
  }, [loadInterventions]);

  // Fonction pour générer les options de mois
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Générer les options pour les 24 derniers mois
    for (let i = 0; i < 24; i++) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const value = format(date, "yyyy-MM");
      const label = format(date, "MMMM yyyy", { locale: fr });
      options.push({ value, label });
    }

    return options;
  };

  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    interventionsData.forEach((item) => {
      // Itérez sur interventionsData
      const duration = item.intervention.duree; // Accès corrigé
      if (typeof duration === "string" && duration) {
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
    return `${hours}h${minutes ? minutes.toString().padStart(2, "0") : ""}`;
  };

  const getSelectedPartenaire = () => {
    return partenaires.find(
      (p) => p.id_partenaire.toString() === selectedPartenaireId
    );
  };



  const generateExcelContent = () => {
    const selectedPartenaire = getSelectedPartenaire();
    const monthName = format(new Date(selectedMonth + "-01"), "MMMM yyyy", { locale: fr });
    const headers = ["Date", "Problème signalé", "Cause", "Mode d'intervention", "Action menée", "Recommandation", "Durée"];
    const rows = interventionsData.map((item) => [
      // Itérez sur interventionsData
      (() => {
        const date = new Date(item.intervention.date_intervention); // Accès corrigé
        return isNaN(date.getTime()) ? "-" : format(date, "dd/MM/yyyy");
      })(),
      item.intervention.probleme_signale || "",
      item.intervention.cause_defaillance || "",
      item.intervention.mode_intervention || "",
      item.intervention.rapport_intervention || "",
      item.intervention.recommandation || "",
      item.intervention.duree || "",
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
      `Rapport d'interventions - ${
        selectedPartenaire?.nom_partenaire || "Partenaire"
      } - ${monthName}`,
      `Généré le: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: fr })}`,
      "",
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
      totalDurationRow.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ].join("\n");

    return csvContent;
  };

  const generatePDFContent = () => {
    const selectedPartenaire = getSelectedPartenaire();
    const partenaireName =
      selectedPartenaire?.nom_partenaire || "Partenaire inconnu";
    const monthName = format(new Date(selectedMonth + "-01"), "MMMM yyyy", { locale: fr });

    const rows = interventionsData.map((item) => [
      // Itérez sur interventionsData
      (() => {
        const date = new Date(item.intervention.date_intervention); // Accès corrigé
        return isNaN(date.getTime()) ? "-" : format(date, "dd/MM/yyyy");
      })(),
      item.intervention.probleme_signale || "",
      item.intervention.cause_defaillance || "",
      item.intervention.mode_intervention || "",
      item.intervention.rapport_intervention || "",
      item.intervention.recommandation || "",
      item.intervention.duree || "",
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
          th { background-color: #2563eb; color: white; padding: 10px; text-align: left; font-size: 11px; }
          td { padding: 8px; border: 1px solid #ddd; vertical-align: top; font-size: 10px; }
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
           <h1>TABLEAU RÉCAPITULATIF DES INTERVENTIONS</h1>
           <p style="text-align: center;">Partenaire : ${partenaireName} | Période : ${monthName}</p>
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
            <p><strong>Nombre total d'interventions :</strong> ${
              interventionsData.length
            } | <strong>Durée totale :</strong> ${calculateTotalDuration()} | <strong>Date de génération :</strong> ${format(
              new Date(),
              "dd MMMM yyyy HH:mm",
              { locale: fr }
            )}</p>
          </div>

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
      toast.error(
        "Veuillez sélectionner un partenaire pour générer le rapport."
      );
      return;
    }
    if (interventionsData.length === 0) {
      // Vérifiez interventionsData
      toast.info(
        "Aucune intervention à exporter pour le partenaire et la période sélectionnés."
      );
      return;
    }

    setIsGeneratingReport(true);
    try {
      const selectedPartenaire = getSelectedPartenaire();
      let content, fileName, type;

      const monthName = format(new Date(selectedMonth + "-01"), "yyyy-MM", { locale: fr });
      
      if (formatType === "excel") {
        content = generateExcelContent();
        fileName = `rapport-interventions-${
          selectedPartenaire?.nom_partenaire?.replace(/\s+/g, "-") ||
          "partenaire"
        }-${monthName}.csv`;
        type = "text/csv;charset=utf-8;";
      } else {
        content = generatePDFContent();
        fileName = `rapport-interventions-${
          selectedPartenaire?.nom_partenaire?.replace(/\s+/g, "-") ||
          "partenaire"
        }-${monthName}.pdf`;
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
          }, 2000); // Augmenté à 2 secondes pour s'assurer que l'image est chargée
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

      toast.success(
        `Rapport exporté avec succès en format ${formatType.toUpperCase()}`
      );
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
              <CardTitle>Rapport d'Interventions par Partenaire et Période</CardTitle>
              <CardDescription>
                Récapitulatif des interventions pour le partenaire et la période sélectionnés
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

              <Select
                value={selectedMonth}
                onValueChange={(value) => setSelectedMonth(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sélectionner une période" />
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
              <p>Sélectionnez un partenaire et une période pour voir les interventions.</p>
            </div>
          ) : partenaires.length === 0 && !isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun partenaire n'est disponible.</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-4">
              Chargement des interventions...
            </div>
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
                  <div className="text-sm">
                    <span className="font-medium">Période :</span>{" "}
                    {format(new Date(selectedMonth + "-01"), "MMMM yyyy", { locale: fr })}
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
                      <TableHead>Problème signalé</TableHead>
                      <TableHead>Cause</TableHead>
                      <TableHead>Mode d'intervention</TableHead>
                      <TableHead>Action menée</TableHead>
                      <TableHead>Recommandation</TableHead>
                      <TableHead>Durée</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interventionsData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          Aucune intervention pour ce partenaire sur cette période
                        </TableCell>
                      </TableRow>
                    ) : (
                      interventionsData.map(
                        (
                          item // Itérez sur interventionsData
                        ) => (
                          <TableRow key={item.intervention.id_intervention}>
                            <TableCell>
                              {format(
                                new Date(item.intervention.date_intervention), // Accès corrigé
                                "dd/MM/yyyy"
                              )}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {item.intervention.probleme_signale}
                            </TableCell>
                            <TableCell>
                              {item.intervention.cause_defaillance}
                            </TableCell>
                            <TableCell>
                              {item.intervention.mode_intervention}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {item.intervention.rapport_intervention}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {item.intervention.recommandation}
                            </TableCell>
                            <TableCell>{item.intervention.duree}</TableCell>
                          </TableRow>
                        )
                      )
                    )}
                    {/* Ligne de durée totale */}
                    {interventionsData.length > 0 && (
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
