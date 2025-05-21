"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
// import { memo, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Check,
  ChevronsUpDown,
  User,
  Users,
  AlertTriangle,
  Activity,
  FileText,
  //Clock,
  Package,
  Clipboard,
  CheckSquare,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Layout from "@/components/Layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import {
  FicheInterventionFormValues,
  ficheInterventionSchema,
} from "../types/data";
// Ajout des imports pour Zod et React Hook Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { useCreateIntervention } from "../lib/queries";

export function Nouvelle_fiche() {
  // Initialisation de React Hook Form avec Zod
  const navigate = useNavigate();

  const { mutate, isLoading } = useCreateIntervention();

  const form = useForm<FicheInterventionFormValues>({
    resolver: zodResolver(ficheInterventionSchema),
    defaultValues: {
      date: undefined,
      client: "",
      intervenants: [],
      problemeSignale: "",
      typeMaintenance: "",
      typeDefaillance: "",
      causeDefaillance: "",
      descriptionCause: "",
      rapportIntervention: "",
      duree: "",
      piecesRechange: [],
      superviseur: "",
    },
  });

  // Gestion de la soumission du formulaire
  const onSubmit = (data: FicheInterventionFormValues) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const [selectedIntervenants, setSelectedIntervenants] = React.useState<
    string[]
  >([]);
  const [openIntervenants, setOpenIntervenants] = React.useState(false);
  const [date, setDate] = React.useState<Date>();

  // Données des intervenants avec des noms ivoiriens
  const intervenants = [
    { value: "kouame", label: "Kouamé Koffi" },
    { value: "aya", label: "Aya Kouassi" },
    { value: "adama", label: "Adama Koné" },
    { value: "yao", label: "Yao N'Guessan" },
    { value: "fatou", label: "Fatou Diallo" },
  ];

  const handleSelect = (currentValue: string) => {
    const newIntervenants = selectedIntervenants.includes(currentValue)
      ? selectedIntervenants.filter((val) => val !== currentValue)
      : [...selectedIntervenants, currentValue];

    setSelectedIntervenants(newIntervenants);
    form.setValue("intervenants", newIntervenants);
  };

  const removeIntervenant = (value: string) => {
    const newIntervenants = selectedIntervenants.filter((val) => val !== value);
    setSelectedIntervenants(newIntervenants);
    form.setValue("intervenants", newIntervenants);
  };

  const frameworks = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [typeMaintenance, setTypeMaintenance] = React.useState<string | null>(
    null
  );
  const [typeDefaillance, setTypeDefaillance] = React.useState<string | null>(
    null
  );
  const [causeDefaillance, setCauseDefaillance] = React.useState<string | null>(
    null
  );

  const options = [
    {
      id: "option1",
      label: "Option 1",
      description: "Description de l'option 1",
    },
    {
      id: "option2",
      label: "Option 2",
      description: "Description de l'option 2",
    },
    {
      id: "option3",
      label: "Option 3",
      description: "Description de l'option 3",
    },
    {
      id: "option4",
      label: "Option 4",
      description: "Description de l'option 4",
    },
  ];

  const handleSelectionMaintenance = (id: string) => {
    const newValue = id === typeMaintenance ? null : id;
    setTypeMaintenance(newValue);
    form.setValue("typeMaintenance", newValue || "");
  };
  const handleSelectionDefaillance = (id: string) => {
    const newValue = id === typeDefaillance ? null : id;
    setTypeDefaillance(newValue);
    form.setValue("typeDefaillance", newValue || "");
  };
  const handleSelectionCauseDefaillance = (id: string) => {
    const newValue = id === causeDefaillance ? null : id;
    setCauseDefaillance(newValue);
    form.setValue("causeDefaillance", newValue || "");
  };

  const [openProduit, setOpenProduit] = React.useState(false);
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [quantities, setQuantities] = React.useState<{ [key: string]: number }>(
    {}
  );

  // Données des produits
  const products = [
    {
      id: "p001",
      designation: "Ordinateur Portable",
      marque: "Dell",
      reference: "XPS-15-9500",
    },
    {
      id: "p002",
      designation: "Smartphone",
      marque: "Samsung",
      reference: "Galaxy-S22",
    },
    { id: "p003", designation: "Écran", marque: "LG", reference: "34WN750-B" },
    {
      id: "p004",
      designation: "Tablette",
      marque: "Apple",
      reference: "iPad-Pro-2022",
    },
    {
      id: "p005",
      designation: "Imprimante",
      marque: "HP",
      reference: "LaserJet-Pro-M404dn",
    },
    {
      id: "p006",
      designation: "Clavier",
      marque: "Logitech",
      reference: "MX-Keys",
    },
  ];

  const handleSelectProduit = (productId: string) => {
    const newProducts = selectedProducts.includes(productId)
      ? selectedProducts.filter((id) => id !== productId)
      : [...selectedProducts, productId];

    setSelectedProducts(newProducts);

    // Mise à jour des valeurs du formulaire
    form.setValue(
      "piecesRechange",
      newProducts.map((id) => ({
        id,
        quantity: quantities[id] || 1,
      }))
    );
  };

  const removeProduct = (productId: string) => {
    const newSelectedProducts = selectedProducts.filter(
      (id) => id !== productId
    );
    const newQuantities = { ...quantities };
    delete newQuantities[productId];

    setSelectedProducts(newSelectedProducts);
    setQuantities(newQuantities);

    form.setValue(
      "piecesRechange",
      newSelectedProducts.map((id) => ({
        id,
        quantity: newQuantities[id] || 1,
      }))
    );
  };

  const handleQuantityChange = (productId: string, value: string) => {
    let newQuantity = parseInt(value, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }

    const newQuantities = {
      ...quantities,
      [productId]: newQuantity,
    };

    setQuantities(newQuantities);

    form.setValue(
      "piecesRechange",
      selectedProducts.map((id) => ({
        id,
        quantity: newQuantities[id] || 1,
      }))
    );
  };

  const selectedProductsData = products.filter((product) =>
    selectedProducts.includes(product.id)
  );

  // Fonction de gestion des erreurs lors de la soumission
  const onError = () => {
    toast.error("Erreur lors de l'enregistrement", {
      description: "Veuillez corriger les erreurs dans le formulaire",
    });
  };
  const NavComponent = () => {
    return (
      <div className="flex space-x-4">
        <Button
          className="cursor-pointer transition ease-in-out duration-300 active:scale-95"
          variant="outline"
          aria-label="Enregistrer l'intervention"
          onClick={form.handleSubmit(onSubmit, onError)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loader"></span>
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Enregistrer
            </>
          )}
        </Button>
      </div>
    );
  };

  const BoutonAction = React.memo(() => (
    <div className="flex justify-end gap-4 mt-6 lg:hidden">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
      >
        <X className="w-4 h-4" />
        Annuler
      </Button>
      <Button
        variant={"outline"}
        type="submit"
        className="flex items-center gap-2 text-white bg-blue-600"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="loader"></span>
            Enregistrement...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Enregistrer
          </>
        )}
      </Button>
    </div>
  ));

  return (
    <Layout autre={NavComponent}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className="flex w-full flex-col justify-center items-center uppercase font-semibold text-xl mt-4">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            FICHE D'INTERVENTION N°
          </div>
          <div className="w-32 h-1.5 bg-blue-600 mt-1 rounded-full"></div>
        </div>

        <div className="w-full mt-6 p-4 border border-dotted rounded-sm">
          <p className="w-full text-center mb-4 uppercase font-semibold flex items-center justify-center gap-2">
            <Clipboard className="w-5 h-5" />
            COMPTE-RENDU
          </p>
          <div className="w-full flex max-lg:flex-col max-lg:space-y-4 items-start justify-between">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild className="cursor-pointer">
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {date ? (
                      format(date, "PPP")
                    ) : (
                      <span>Choisissez une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      if (selectedDate) {
                        form.setValue("date", selectedDate);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.date && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 p-3 rounded-md">
              <Label htmlFor="client" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Client
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild className="cursor-pointer">
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {value
                      ? frameworks.find(
                          (framework) => framework.value === value
                        )?.label
                      : "Select framework..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search framework..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {frameworks.map((framework) => (
                          <CommandItem
                            key={framework.value}
                            value={framework.value}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              form.setValue(
                                "client",
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            {framework.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                value === framework.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {form.formState.errors.client && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.client.message}
                </p>
              )}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 p-3 rounded-md shadow-sm">
              <Label htmlFor="Intervenant" className="flex items-center gap-2">
                <Users className="w-4 h-4" /> Intervenants
              </Label>

              {selectedIntervenants.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedIntervenants.map((value) => {
                    const intervenant = intervenants.find(
                      (i) => i.value === value
                    );
                    return (
                      <div
                        key={value}
                        className="bg-slate-100 px-2 py-1 rounded-md flex items-center group relative"
                      >
                        {intervenant?.label}
                        <button
                          onClick={() => removeIntervenant(value)}
                          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} className="text-red-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <Popover
                open={openIntervenants}
                onOpenChange={setOpenIntervenants}
              >
                <PopoverTrigger asChild className="cursor-pointer">
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedIntervenants.length > 0
                      ? `${selectedIntervenants.length} intervenant(s) sélectionné(s)`
                      : "Sélectionner des intervenants..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher un intervenant..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Aucun intervenant trouvé.</CommandEmpty>
                      <CommandGroup>
                        {intervenants.map((intervenant) => (
                          <CommandItem
                            key={intervenant.value}
                            value={intervenant.value}
                            onSelect={handleSelect}
                          >
                            {intervenant.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                selectedIntervenants.includes(intervenant.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {form.formState.errors.intervenants && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.intervenants.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full mt-6 p-4 border border-dotted rounded-md shadow-sm">
          <p className="w-full text-center mb-4 uppercase font-semibold flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Problème Signalé
          </p>
          <Textarea
            placeholder="Décrivez votre probléme ici"
            {...form.register("problemeSignale")}
          />
          {form.formState.errors.problemeSignale && (
            <p className="text-sm text-red-500">
              {form.formState.errors.problemeSignale.message}
            </p>
          )}
        </div>
        <div className="w-full mt-6 p-4 border border-dotted rounded-md">
          <div className="w-full flex items-start justify-between max-lg:flex-col max-lg:space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5 p-3 rounded-md shadow-sm">
              <Label
                className="uppercase flex items-center gap-2 text-blue-700"
                htmlFor="date"
              >
                Type de Maintenance
              </Label>
              <div className="w-full max-w-md space-y-3">
                <h3 className="text-lg font-medium mb-2">
                  Sélectionnez une option
                </h3>
                <div className="space-y-2">
                  {options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center justify-between p-3 border rounded-md  hover:bg-slate-50 hover:dark:bg-gray-900 ${
                        typeMaintenance === option.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 dark:bg-gray-600"
                      }`}
                    >
                      <div className="space-y-1">
                        <Label htmlFor={option.id} className="font-medium">
                          {option.label}
                        </Label>
                      </div>
                      <Checkbox
                        id={option.id}
                        checked={typeMaintenance === option.id}
                        className="h-5 w-5 data-[state=checked]:bg-primary cursor-pointer"
                        onClick={() => {
                          handleSelectionMaintenance(option.id);
                        }}
                      />
                    </div>
                  ))}
                </div>
                {form.formState.errors.typeMaintenance && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.typeMaintenance.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 bg-white p-3 rounded-md shadow-sm">
              <Label
                className="uppercase flex items-center gap-2 text-red-600"
                htmlFor="client"
              >
                <AlertTriangle className="w-4 h-4" />
                Type de Défaillance
              </Label>
              <div className="w-full max-w-md space-y-3">
                <h3 className="text-lg font-medium mb-2">
                  Sélectionnez une option
                </h3>
                <div className="space-y-2">
                  {options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center justify-between p-3 border rounded-md  hover:bg-slate-50 hover:dark:bg-gray-900 ${
                        typeDefaillance === option.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 dark:bg-gray-600"
                      }`}
                    >
                      <div className="space-y-1">
                        <Label htmlFor={option.id} className="font-medium">
                          {option.label}
                        </Label>
                      </div>
                      <Checkbox
                        id={option.id}
                        checked={typeDefaillance === option.id}
                        className="h-5 w-5 data-[state=checked]:bg-primary cursor-pointer"
                        onClick={() => {
                          handleSelectionDefaillance(option.id);
                        }}
                      />
                    </div>
                  ))}
                </div>
                {form.formState.errors.typeMaintenance && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.typeMaintenance.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 p-3 rounded-md bg-white shadow-sm">
              <Label
                className="uppercase flex items-center gap-2 text-amber-600"
                htmlFor="Intervenant"
              >
                <Activity className="w-4 h-4" />
                Cause de Défaillance
              </Label>
              <div className="w-full max-w-md space-y-3">
                <h3 className="text-lg font-medium mb-2">
                  Sélectionnez une option
                </h3>
                <div className="space-y-2">
                  {options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center justify-between p-3 border rounded-md  hover:bg-slate-50 hover:dark:bg-gray-900 ${
                        causeDefaillance === option.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 dark:bg-gray-600"
                      }`}
                    >
                      <div className="space-y-1">
                        <Label htmlFor={option.id} className="font-medium">
                          {option.label}
                        </Label>
                      </div>
                      <Checkbox
                        id={option.id}
                        checked={causeDefaillance === option.id}
                        className="h-5 w-5 data-[state=checked]:bg-primary cursor-pointer"
                        onClick={() => {
                          handleSelectionCauseDefaillance(option.id);
                        }}
                      />
                    </div>
                  ))}
                </div>
                {form.formState.errors.typeMaintenance && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.typeMaintenance.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mt-6 p-4 border border-dotted rounded-md">
          <p className="w-full text-center mb-4 uppercase font-semibold flex items-center justify-center gap-2">
            <Activity className="w-5 h-5" />
            Cause liée à la défaillance
          </p>
          <Textarea
            placeholder="Décrivez la cause ici"
            {...form.register("descriptionCause")}
          />
          {form.formState.errors.descriptionCause && (
            <p className="text-sm text-red-500">
              {form.formState.errors.descriptionCause.message}
            </p>
          )}
        </div>
        <div className="w-full mt-6 p-4 border border-dotted rounded-md shadow-sm">
          <p className="w-full text-center mb-4 uppercase font-semibold flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            Rapport d'intervention / recommandation
          </p>
          <div className="flex max-lg:flex-col max-lg:space-y-4">
            <div className="w-full">
              <Textarea
                placeholder="Tapez le rapport ici"
                {...form.register("rapportIntervention")}
              />
              {form.formState.errors.rapportIntervention && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.rapportIntervention.message}
                </p>
              )}
            </div>

            <div className="lg:border-l ml-2 p-1">
              <Label className="mb-1" htmlFor="durée">
                Durée
              </Label>
              <Input {...form.register("duree")} />
              {form.formState.errors.duree && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.duree.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section Produits avec validation */}
        <div className="w-full mt-6 p-4 border border-dotted rounded-md">
          <p className="w-full text-center mb-4 uppercase font-semibold flex items-center justify-center gap-2">
            <Package className="w-5 h-5" />
            Pièces de rechange
          </p>
          <div className="w-full space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="products">Sélection de Produits</Label>
              <Popover open={openProduit} onOpenChange={setOpenProduit}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedProducts.length > 0
                      ? `${selectedProducts.length} produit(s) sélectionné(s)`
                      : "Sélectionner des produits..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher un produit..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
                      <CommandGroup>
                        {products.map((product) => (
                          <CommandItem
                            key={product.id}
                            value={product.id}
                            onSelect={() => handleSelectProduit(product.id)}
                          >
                            <div className="flex flex-col">
                              <span>{product.designation}</span>
                              <span className="text-sm text-gray-500">
                                {product.marque} - {product.reference}
                              </span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedProducts.includes(product.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {selectedProductsData.length > 0 && (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Désignation</TableHead>
                      <TableHead>Marque</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProductsData.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.designation}</TableCell>
                        <TableCell>{product.marque}</TableCell>
                        <TableCell>{product.reference}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Input
                              type="number"
                              min="1"
                              value={quantities[product.id] || 1}
                              onChange={(e) =>
                                handleQuantityChange(product.id, e.target.value)
                              }
                              className="h-8 w-16 text-center"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProduct(product.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        <div className="w-full mt-6 mb-6 p-4 border border-dotted rounded-md shadow-sm">
          <p className="w-full text-center mb-4 uppercase font-semibold flex items-center justify-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Visa
          </p>

          <div className="flex max-lg:flex-col max-lg:space-y-4">
            <div className="ml-2 p-1 w-full">
              <Label className="mb-1 flex items-center gap-2" htmlFor="durée">
                <User className="w-4 h-4" />
                Superviseur (Nom-signature-cachet)
              </Label>
              <Input {...form.register("superviseur")} />
              {form.formState.errors.superviseur && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.superviseur.message}
                </p>
              )}
            </div>

            <div className="border-l w-full ml-2 p-1">
              <Label
                className="mb-2 flex items-center gap-2"
                htmlFor="Intervenant"
              >
                <Users className="w-4 h-4" />
                Intervenants DCAT
              </Label>
              {selectedIntervenants.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedIntervenants.map((value) => {
                    const intervenant = intervenants.find(
                      (i) => i.value === value
                    );
                    return (
                      <div
                        key={value}
                        className="bg-slate-100 px-2 py-1 rounded-md flex items-center group relative"
                      >
                        {intervenant?.label}
                        <button
                          onClick={() => removeIntervenant(value)}
                          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} className="text-red-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <BoutonAction />
      </form>
    </Layout>
  );
}

export default Nouvelle_fiche;