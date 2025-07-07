import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
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
import { Intervention, Partenaire } from "../interface/interface";
import { getInterventionsByPartenaire } from "../api/intervention";
import { fetchPartners } from "@/modules/administration-Finnance/services/partenaireService";
import { FileDown, Eye, ChevronDown, Building2 } from "lucide-react";
import { toast } from "sonner";

// Interface pour la réponse de l'API partenaire (non utilisée pour le moment)
// interface InterventionWithDetails {
//   intervention: Intervention;
//   partenaire: Partenaire;
//   contrat: Contrat;
//   employes: Employe[];
// }

interface PartenaireReportProps {
  onViewIntervention?: (intervention: Intervention) => void;
}

export const PartenaireReport: React.FC<PartenaireReportProps> = ({
  onViewIntervention = () => {},
}) => {
  const navigate = useNavigate();
  const [selectedPartenaireId, setSelectedPartenaireId] = useState<string>("");
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
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

    // Charger la liste des partenaires
    loadPartenaires();
  }, []);

  const loadPartenaires = async () => {
    try {
      const partenairesData = await fetchPartners();
      // Adapter les données selon l'interface Partenaire de interface.ts
      const adaptedPartenaires: Partenaire[] = partenairesData.map(
        (p: Partenaire) => ({
          id_partenaire: p.id_partenaire,
          nom_partenaire: p.nom_partenaire,
        })
      );
      setPartenaires(adaptedPartenaires);
    } catch (error) {
      console.error("Erreur lors du chargement des partenaires:", error);
      toast.error("Erreur lors du chargement des partenaires");
    }
  };

  const loadInterventions = useCallback(async () => {
    if (!selectedPartenaireId) return;
  
    setIsLoading(true);
    try {
      const response = await getInterventionsByPartenaire(
        parseInt(selectedPartenaireId)
      );
      setInterventions(response.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des interventions:", error);
      toast.error("Erreur lors du chargement des interventions");
    } finally {
      setIsLoading(false);
    }
  }, [selectedPartenaireId]); // dépend de selectedPartenaireId
  
  useEffect(() => {
    if (selectedPartenaireId) {
      loadInterventions();
    }
  }, [selectedPartenaireId, loadInterventions]);

  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    interventions.forEach((item) => {
      const duration = item.duree;
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
    const headers = [
      "Date",
      "Type",
      "Problème",
      "Cause",
      "Actions",
      "Durée",
      "Lieu",
      "Statut",
    ];
    const rows = interventions.map((item) => [
      format(new Date(item.date_intervention), "dd/MM/yyyy"),
      item.type_intervention,
      item.probleme_signale,
      item.cause_defaillance,
      item.rapport_intervention,
      item.duree,
      item.lieu,
      item.statut_intervention,
    ]);

    const csvContent = [
      `Rapport d'interventions - ${
        selectedPartenaire?.nom_partenaire || "Partenaire"
      }`,
      `Généré le: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: fr })}`,
      "",
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return csvContent;
  };

  const generatePDFContent = () => {
    const selectedPartenaire = getSelectedPartenaire();
    const partenaireName =
      selectedPartenaire?.nom_partenaire || "Partenaire inconnu";

    const rows = interventions.map((item) => [
      format(new Date(item.date_intervention), "dd/MM/yyyy"),
      item.type_intervention,
      item.probleme_signale,
      item.cause_defaillance,
      item.rapport_intervention,
      item.duree,
      item.lieu,
      item.statut_intervention,
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
          <h1>Rapport d'Interventions par Partenaire</h1>
          <p style="text-align: center;">Partenaire : ${partenaireName}</p>
        </div>
        
        <div class="partenaire-info">
          <h3>Informations du partenaire</h3>
          <p><strong>Nom :</strong> ${
            selectedPartenaire?.nom_partenaire || "N/A"
          }</p>
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
              <th>Lieu</th>
              <th>Statut</th>
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
    if (!selectedPartenaireId) {
      toast.error("Veuillez sélectionner un partenaire");
      return;
    }

    setIsGeneratingReport(true);
    try {
      const selectedPartenaire = getSelectedPartenaire();
      let content, fileName, type;

      if (format === "excel") {
        content = generateExcelContent();
        fileName = `rapport-interventions-${
          selectedPartenaire?.nom_partenaire?.replace(/\s+/g, "-") ||
          "partenaire"
        }.csv`;
        type = "text/csv";
      } else {
        content = generatePDFContent();
        fileName = `rapport-interventions-${
          selectedPartenaire?.nom_partenaire?.replace(/\s+/g, "-") ||
          "partenaire"
        }.pdf`;
        type = "text/html";
      }

      const blob = new Blob([content], { type });

      if (format === "pdf") {
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
                  {partenaires.map((partenaire) => (
                    <SelectItem
                      key={partenaire.id_partenaire}
                      value={partenaire.id_partenaire.toString()}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {partenaire.nom_partenaire}
                      </div>
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
                      interventions.length === 0
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
          {!selectedPartenaireId ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Sélectionnez un partenaire pour voir ses interventions</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : (
            <>
              {getSelectedPartenaire() && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Informations du partenaire
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Nom :</span>{" "}
                      {getSelectedPartenaire()?.nom_partenaire}
                    </div>
                  </div>
                </div>
              )}

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
                      <TableHead>Lieu</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interventions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center">
                          Aucune intervention pour ce partenaire
                        </TableCell>
                      </TableRow>
                    ) : (
                      interventions.map((item) => (
                        <TableRow key={item.id_intervention}>
                          <TableCell>
                            {format(
                              new Date(item.date_intervention),
                              "dd/MM/yyyy"
                            )}
                          </TableCell>
                          <TableCell>{item.type_intervention}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {item.probleme_signale}
                          </TableCell>
                          <TableCell>{item.cause_defaillance}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {item.rapport_intervention}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {item.recommandation}
                          </TableCell>
                          <TableCell>{item.duree}</TableCell>
                          <TableCell>{item.lieu}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                item.statut_intervention === "terminé"
                                  ? "bg-green-100 text-green-800"
                                  : item.statut_intervention === "en cours"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item.statut_intervention}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewIntervention(item)}
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
