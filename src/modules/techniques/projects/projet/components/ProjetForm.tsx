import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Save, X, Plus, Home, FileText } from "lucide-react";
import { format, addMonths, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Layout from "@/components/Layout";
import { Projet, Partenaire, Famille, Employe, Nature, CreateDocumentTextPayload } from "../../types/types";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ProjetFormProps {
  initialData?: Projet;
  onSave: (projet: Projet) => void;
  onCancel: () => void;
  partenairesDisponibles: Partenaire[];
  famillesDisponibles: Famille[];
  employesDisponibles: Employe[];
  onSaveDocument?: (projectId: number, documentFile: File, textPayload: CreateDocumentTextPayload) => Promise<void>;
  natureDocumentsDisponibles: Nature[];
}

const ProjetForm: React.FC<ProjetFormProps> = ({
  initialData,
  onSave,
  onCancel,
  partenairesDisponibles,
  famillesDisponibles,
  employesDisponibles,
  onSaveDocument,
  natureDocumentsDisponibles,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDocumentSheet, setShowDocumentSheet] = useState(false);

  const navigate = useNavigate();

  const dateToString = (date: string | Date | null): string => {
    if (!date) return "";
    if (typeof date === "string") return date;
    return format(date, "yyyy-MM-dd");
  };

  const [formData, setFormData] = useState<Projet>(initialData || {
    id_projet: 0,
    nom_projet: "",
    type_projet: "",
    devis_estimatif: 0,
    date_debut: "",
    date_fin: "",
    duree_prevu_projet: "",
    description_projet: "",
    etat: "planifié",
    lieu: "",
    responsable: "",
    site: "",
    id_famille: 0,
    id_partenaire: []
  });

  const [selectedPartenaireIdString, setSelectedPartenaireIdString] = useState<string>("");

  const [documentFormData, setDocumentFormData] = useState<CreateDocumentTextPayload & { file: File | null }>({
    libelle_document: "",
    classification_document: "",
    date_document: "",
    id_nature_document: 0,
    file: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date_debut: dateToString(initialData.date_debut),
        date_fin: dateToString(initialData.date_fin),
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? 0 : parseFloat(value),
    });
  };

  const handleFamilleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      id_famille: Number(value),
    });
  };

  const handleResponsableSelectChange = (value: string) => {
    setFormData({
      ...formData,
      responsable: value,
    });
  };

  const handleAddPartenaire = () => {
    const newPartenaireId = Number(selectedPartenaireIdString);
    if (!isNaN(newPartenaireId) && newPartenaireId !== 0 && !formData.id_partenaire.includes(newPartenaireId)) {
      setFormData({
        ...formData,
        id_partenaire: [...formData.id_partenaire, newPartenaireId],
      });
      setSelectedPartenaireIdString("");
    }
  };

  const handleRemovePartenaire = (idToRemove: number) => {
    setFormData({
      ...formData,
      id_partenaire: formData.id_partenaire.filter((id) => id !== idToRemove),
    });
  };

  const getPartenaireName = (id: number) => {
    return partenairesDisponibles.find(p => p.id_partenaire === id)?.nom_partenaire || "Inconnu";
  };
  
  useEffect(() => {
    const dateDebutStr = typeof formData.date_debut === 'string' ? formData.date_debut : dateToString(formData.date_debut);
    
    if (dateDebutStr && formData.duree_prevu_projet) {
      const durationMonths = parseFloat(formData.duree_prevu_projet);
      if (!isNaN(durationMonths)) {
        try {
          const startDate = parseISO(dateDebutStr);
          if (!isNaN(startDate.getTime())) {
            const endDate = addMonths(startDate, durationMonths);
            setFormData(prev => ({
              ...prev,
              date_fin: format(endDate, "yyyy-MM-dd")
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              date_fin: ""
            }));
          }
        } catch {
          setFormData(prev => ({
            ...prev,
            date_fin: ""
          }));
        }
      } else {
        setFormData(prev => ({
          ...prev,
          date_fin: ""
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        date_fin: ""
      }));
    }
  }, [formData.date_debut, formData.duree_prevu_projet]);

  const formatDateForBackend = (dateValue: string | Date | null): string | null => {
    if (!dateValue) return null;
    
    try {
      if (typeof dateValue === 'string') {
        if (dateValue.trim() === '') return null;
        const parsed = new Date(dateValue);
        return isNaN(parsed.getTime()) ? null : parsed.toISOString();
      } else {
        return isNaN(dateValue.getTime()) ? null : dateValue.toISOString();
      }
    } catch {
      return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!formData.nom_projet) {
      toast.error("Veuillez entrer le nom du projet.");
      setIsSubmitting(false);
      return;
    }
  
    if (!formData.type_projet) {
      toast.error("Veuillez entrer le type du projet.");
      setIsSubmitting(false);
      return;
    }
  
    // Validation du devis estimatif
    const devisValue = Number(formData.devis_estimatif);
    if (devisValue > 99999999) { // Limite à 99,999,999
      toast.error("Le devis estimatif ne peut pas dépasser 99,999,999 FCFA.");
      setIsSubmitting(false);
      return;
    }
  
    const projetToSave: Projet = {
      id_projet: formData.id_projet,
      nom_projet: formData.nom_projet,
      type_projet: formData.type_projet,
      devis_estimatif: devisValue,
      date_debut: formatDateForBackend(formData.date_debut) || "",
      date_fin: formatDateForBackend(formData.date_fin) || "",
      duree_prevu_projet: formData.duree_prevu_projet,
      description_projet: formData.description_projet,
      etat: formData.etat,
      lieu: formData.lieu,
      responsable: formData.responsable,
      site: formData.site,
      id_famille: formData.id_famille,
      id_partenaire: formData.id_partenaire || []
    };
  
    console.log('Données envoyées au backend:', projetToSave);
  
    onSave(projetToSave);
    setIsSubmitting(false);
  };

  const getDateForDisplay = (dateValue: string | Date | null) => {
    if (!dateValue) return undefined;
    
    try {
      if (typeof dateValue === 'string') {
        if (dateValue.trim() === '') return undefined;
        const parsed = parseISO(dateValue);
        return !isNaN(parsed.getTime()) ? parsed : undefined;
      } else {
        return !isNaN(dateValue.getTime()) ? dateValue : undefined;
      }
    } catch {
      return undefined;
    }
  };

  const parsedDateDebut = getDateForDisplay(formData.date_debut);
  const parsedDateFin = getDateForDisplay(formData.date_fin);

  const handleDocumentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDocumentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDocumentSelectChange = (name: keyof CreateDocumentTextPayload, value: string) => {
    let newValue: string | number = value;
    if (name === "id_nature_document") {
        newValue = Number(value);
        if (isNaN(newValue)) {
            newValue = 0;
        }
    }
    setDocumentFormData((prev) => ({
      ...prev,
      [name]: newValue as string,
    }));
  };

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentFormData((prev) => ({
        ...prev,
        file: e.target.files![0],
      }));
    } else {
      setDocumentFormData((prev) => ({
        ...prev,
        file: null,
      }));
    }
  };

  const handleDocumentDateChange = (date: Date | undefined) => {
    setDocumentFormData((prev) => ({
      ...prev,
      date_document: date ? format(date, "yyyy-MM-dd") : "",
    }));
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!initialData?.id_projet) {
      toast.error("Le projet doit être enregistré avant d'ajouter des documents.");
      return;
    }

    if (!documentFormData.file) {
      toast.error("Veuillez sélectionner un fichier à télécharger.");
      return;
    }
    if (!documentFormData.libelle_document.trim()) {
      toast.error("Veuillez entrer le libellé du document.");
      return;
    }
    if (documentFormData.id_nature_document === 0) {
      toast.error("Veuillez sélectionner la nature du document.");
      return;
    }
    
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (documentFormData.file.size > MAX_FILE_SIZE) {
      toast.error("La taille du fichier ne doit pas dépasser 5 Mo.");
      return;
    }

    if (onSaveDocument) {
      try {
        await onSaveDocument(
          initialData.id_projet,
          documentFormData.file,
          {
            libelle_document: documentFormData.libelle_document,
            classification_document: documentFormData.classification_document,
            date_document: documentFormData.date_document,
            id_nature_document: documentFormData.id_nature_document,
          }
        );
        toast.success("Document ajouté avec succès !");
        setShowDocumentSheet(false);
        setDocumentFormData({
          libelle_document: "",
          classification_document: "",
          date_document: "",
          id_nature_document: 0,
          file: null,
        });
      } catch (error) {
        console.error("Erreur lors de l'ajout du document:", error);
        toast.error("Échec de l'ajout du document.");
      }
    } else {
      toast.error("La fonction d'enregistrement du document n'est pas disponible.");
    }
  };

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {initialData ? "Modifier le projet" : "Ajouter un nouveau projet"}
              </h1>
                <p className="text-muted-foreground mt-2">
                  {initialData ? `Projet #${initialData.id_projet}` : "Créez un nouveau projet"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/technique/projets')}>
                  <Home className="mr-2 h-4 w-4" />
                  Tableau de bord
                </Button>
                <Button variant="outline" onClick={() => navigate('/technique/projets/liste')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Voir tous les projets
                </Button>
                {/* Bouton de rapports temporairement désactivé */}
                {/* <Button variant="outline" onClick={() => navigate('/technique/projets/rapports')}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Rapports
                </Button> */}
              {initialData && ( 
                <Sheet open={showDocumentSheet} onOpenChange={setShowDocumentSheet}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Associer un document
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Associer un Document</SheetTitle>
                      <SheetDescription>
                        Téléchargez un document et associez-le à ce projet.
                      </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleDocumentSubmit} className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="documentFile">Fichier du document <span className="text-red-500">*</span></Label>
                        <Input
                          id="documentFile"
                          type="file"
                          onChange={handleDocumentFileChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="libelle_document">Libellé du document <span className="text-red-500">*</span></Label>
                        <Input
                          id="libelle_document"
                          name="libelle_document"
                          value={documentFormData.libelle_document}
                          onChange={handleDocumentInputChange}
                          placeholder="Entrez le libellé du document"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="classification_document">Classification</Label>
                        <Input
                          id="classification_document"
                          name="classification_document"
                          value={documentFormData.classification_document || ""}
                          onChange={handleDocumentInputChange}
                          placeholder="Ex: Confidentiel, Public"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date_document">Date du document</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {documentFormData.date_document ? (
                                format(parseISO(documentFormData.date_document), "dd MMMMyyyy", {
                                  locale: fr,
                                })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={documentFormData.date_document ? parseISO(documentFormData.date_document) : undefined}
                              onSelect={handleDocumentDateChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="id_nature_document">Nature du document <span className="text-red-500">*</span></Label>
                        <Select
                          onValueChange={(value) =>
                            handleDocumentSelectChange("id_nature_document", value)
                          }
                          value={documentFormData.id_nature_document ? String(documentFormData.id_nature_document) : ""}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une nature" />
                          </SelectTrigger>
                          <SelectContent>
                            {natureDocumentsDisponibles.map((nature) => (
                              <SelectItem key={nature.id_nature_document} value={String(nature.id_nature_document)}>
                                {nature.libelle}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <SheetFooter>
                        <Button type="submit" disabled={isSubmitting}>
                          <Save className="mr-2 h-4 w-4" /> Enregistrer Document
                        </Button>
                      </SheetFooter>
                    </form>
                  </SheetContent>
                </Sheet>
              )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Informations générales
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom_projet">
                        Nom du projet <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nom_projet"
                        name="nom_projet"
                        placeholder="Entrez le nom du projet"
                        value={formData.nom_projet}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="type_projet">
                        Type de projet <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) => handleInputChange({ target: { name: "type_projet", value } } as React.ChangeEvent<HTMLInputElement>)}
                        value={formData.type_projet}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type de projet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mission">Mission</SelectItem>
                          <SelectItem value="interne">Interne</SelectItem>
                          <SelectItem value="externe">Externe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="devis_estimatif">
                        Devis estimatif
                      </Label>
                      <Input
                        id="devis_estimatif"
                        name="devis_estimatif"
                        type="number"
                        min="0"
                        max="99999999"
                        placeholder="Entrez le devis estimatif"
                        value={formData.devis_estimatif === 0 ? "" : formData.devis_estimatif}
                        onChange={handleNumberChange}
                      />
                      <p className="text-xs text-gray-500">
                        Maximum autorisé : 99,999,999 FCFA
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date_debut">
                        Date de début
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {parsedDateDebut ? (
                              format(parsedDateDebut, "dd MMMMyyyy", {
                                locale: fr,
                              })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={parsedDateDebut}
                            onSelect={(date) => {
                              if (date) {
                                setFormData({
                                  ...formData,
                                  date_debut: format(date, "yyyy-MM-dd"),
                                });
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  date_debut: ""
                                }));
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_fin">Date de fin</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            disabled
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {parsedDateFin ? (
                              format(parsedDateFin, "dd MMMMyyyy", {
                                locale: fr,
                              })
                            ) : (
                              <span>Calculée automatiquement</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                      </Popover>
                      <p className="text-xs text-gray-500 italic">
                        La date de fin est calculée à partir de la date de début et de la durée
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="duree_prevu_projet">
                        Durée prévue (mois)
                      </Label>
                      <Input
                        id="duree_prevu_projet"
                        name="duree_prevu_projet"
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="Durée en mois"
                        value={formData.duree_prevu_projet === "" || parseFloat(formData.duree_prevu_projet) === 0 ? "" : formData.duree_prevu_projet}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="etat">
                        État
                      </Label>
                      <Select
                        onValueChange={(value) => handleInputChange({ target: { name: "etat", value } } as React.ChangeEvent<HTMLInputElement>)}
                        value={formData.etat}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un état" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planifié">Planifié</SelectItem>
                          <SelectItem value="en_cours">En cours</SelectItem>
                          <SelectItem value="terminé">Terminé</SelectItem>
                          <SelectItem value="annulé">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                    Informations complémentaires
                  </h2>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="lieu">Lieu</Label>
                      <Input
                        id="lieu"
                        name="lieu"
                        placeholder="Entrez le lieu"
                        value={formData.lieu}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="responsable">Responsable</Label>
                      <Select
                        onValueChange={(value) => {
                          const fullName = value.split('|')[1];
                          handleResponsableSelectChange(fullName);
                        }}
                        value={formData.responsable ?
                          (() => {
                            const employe = employesDisponibles.find(e =>
                              `${e.prenom_employes} ${e.nom_employes}` === formData.responsable
                            );
                            return employe ? `${employe.id_employes}|${formData.responsable}` : "";
                          })()
                          : ""
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un responsable" />
                        </SelectTrigger>
                        <SelectContent>
                          {employesDisponibles
                            .filter(employe =>
                              employe.nom_employes &&
                              employe.nom_employes.trim() !== '' &&
                              employe.prenom_employes &&
                              employe.prenom_employes.trim() !== ''
                            )
                            .map((employe) => {
                              const fullName = `${employe.prenom_employes} ${employe.nom_employes}`;
                              return (
                                <SelectItem
                                  key={`employe-${employe.id_employes}`}
                                  value={`${employe.id_employes}|${fullName}`}
                                >
                                  {fullName} - {employe.email_employes}
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="site">Site</Label>
                      <Input
                        id="site"
                        name="site"
                        placeholder="Entrez le site"
                        value={formData.site}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="id_famille">
                        Famille
                      </Label>
                      <Select
                        onValueChange={handleFamilleSelectChange}
                        value={formData.id_famille ? String(formData.id_famille) : ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une famille" />
                        </SelectTrigger>
                        <SelectContent>
                          {famillesDisponibles.map((famille) => (
                            <SelectItem key={famille.id_famille} value={String(famille.id_famille)}>
                              {famille.libelle_famille}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Partenaires</Label>
                    <div className="flex gap-2 items-center">
                      <Select
                        value={selectedPartenaireIdString}
                        onValueChange={setSelectedPartenaireIdString}
                      >
                        <SelectTrigger className="flex-grow">
                          <SelectValue placeholder="Sélectionnez un partenaire" />
                        </SelectTrigger>
                        <SelectContent>
                          {partenairesDisponibles
                            .filter(p => !(formData.id_partenaire || []).includes(p.id_partenaire))
                            .map((partenaire) => (
                              <SelectItem key={partenaire.id_partenaire} value={partenaire.id_partenaire.toString()}>
                                {partenaire.nom_partenaire}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        onClick={handleAddPartenaire}
                        disabled={!selectedPartenaireIdString || (formData.id_partenaire || []).includes(Number(selectedPartenaireIdString))}
                      >
                        Ajouter
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(formData.id_partenaire || []).map((id) => (
                        <Badge key={id} variant="outline" className="flex items-center gap-1">
                          {getPartenaireName(id)}
                          <button
                            type="button"
                            onClick={() => handleRemovePartenaire(id)}
                            className="rounded-full p-0.5 hover:bg-gray-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {(formData.id_partenaire || []).length === 0 && (
                        <p className="text-sm text-gray-500">Aucun partenaire sélectionné.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description_projet">Description</Label>
                    <Textarea
                      id="description_projet"
                      name="description_projet"
                      placeholder="Description du projet..."
                      rows={4}
                      value={formData.description_projet}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            
            <div className="mt-6 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ProjetForm;