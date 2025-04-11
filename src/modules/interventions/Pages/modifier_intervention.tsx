"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  X,
  Save,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Link, useParams } from "react-router-dom";

// Ajout des imports pour Zod et React Hook Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Définition du schéma de validation avec Zod
const ficheInterventionSchema = z
  .object({
    date: z.date({
      required_error: "La date est requise",
    }),
    client: z
      .string({
        required_error: "Le client est requis",
      })
      .min(1, "Le client est requis"),
    intervenants: z
      .array(z.string())
      .min(1, "Au moins un intervenant est requis"),
    problemeSignale: z
      .string({
        required_error: "La description du problème est requise",
      })
      .min(10, "La description doit contenir au moins 10 caractères"),
    typeMaintenance: z.string({
      required_error: "Le type de maintenance est requis",
    }),
    typeDefaillance: z.string({
      required_error: "Le type de défaillance est requis",
    }),
    causeDefaillance: z.string({
      required_error: "La cause de défaillance est requise",
    }),
    descriptionCause: z
      .string({
        required_error: "La description de la cause est requise",
      })
      .min(10, "La description doit contenir au moins 10 caractères"),
    rapportIntervention: z
      .string({
        required_error: "Le rapport d'intervention est requis",
      })
      .min(10, "Le rapport doit contenir au moins 10 caractères"),
    duree: z
      .string({
        required_error: "La durée est requise",
      })
      .min(1, "La durée est requise"),
    piecesRechange: z
      .array(
        z.object({
          id: z.string(),
          quantity: z.number().int().positive(),
        })
      )
      .optional(),
    superviseur: z
      .string({
        required_error: "Le superviseur est requis",
      })
      .min(1, "Le superviseur est requis"),
  })
  .refine(
    (data) => {
      // Vérifier qu'au moins une option est sélectionnée parmi les trois
      const optionsCount = [
        !!data.typeMaintenance,
        !!data.typeDefaillance,
        !!data.causeDefaillance,
      ].filter(Boolean).length;

      return optionsCount >= 1;
    },
    {
      message:
        "Au moins un type de maintenance, défaillance ou cause doit être sélectionné",
      path: ["typeMaintenance"], // Le chemin où l'erreur apparaîtra
    }
  );
type FicheInterventionFormValues = z.infer<typeof ficheInterventionSchema>;
// Interface pour les données du formulaire
interface FormData {
  date?: Date;
  client: string;
  intervenants: string[];
  probleme: string;
  typeMaintenance: string | null;
  typeDefaillance: string | null;
  causeDefaillance: string | null;
  causeLiee: string;
  rapport: string;
  duree: string;
  produits: {
    id: string;
    quantity: number;
  }[];
  superviseur: string;
}

const Modifier_intervention = () => {
  // Données initiales du formulaire
  const { id } = useParams();
  const initialData = React.useMemo(
    () => ({
      date: undefined,
      client: "",
      intervenants: [],
      probleme: "",
      typeMaintenance: null,
      typeDefaillance: null,
      causeDefaillance: null,
      causeLiee: "",
      rapport: "",
      duree: "",
      produits: [],
      superviseur: "",
    }),
    []
  );

  // États du formulaire
  const [formData, setFormData] = React.useState<FormData>(initialData);
  const [hasChanges, setHasChanges] = React.useState(false);

  // États pour les champs contrôlés
  const [date, setDate] = React.useState<Date>();
  const [value, setValue] = React.useState("");
  const [selectedIntervenants, setSelectedIntervenants] = React.useState<
    string[]
  >([]);
  const [openIntervenants, setOpenIntervenants] = React.useState(false);
  const [probleme, setProbleme] = React.useState("");
  const [typeMaintenance, setTypeMaintenance] = React.useState<string | null>(
    null
  );
  const [typeDefaillance, setTypeDefaillance] = React.useState<string | null>(
    null
  );
  const [causeDefaillance, setCauseDefaillance] = React.useState<string | null>(
    null
  );
  const [causeLiee, setCauseLiee] = React.useState("");
  const [rapport, setRapport] = React.useState("");
  const [duree, setDuree] = React.useState("");
  const [openProduit, setOpenProduit] = React.useState(false);
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [quantities, setQuantities] = React.useState<{ [key: string]: number }>(
    {}
  );
  const [superviseur, setSuperviseur] = React.useState("");

  // Données des listes déroulantes
  const intervenants = [
    { value: "kouame", label: "Kouamé Koffi" },
    { value: "aya", label: "Aya Kouassi" },
    { value: "adama", label: "Adama Koné" },
    { value: "yao", label: "Yao N'Guessan" },
    { value: "fatou", label: "Fatou Diallo" },
  ];

  const frameworks = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];

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

  // Gestion des sélections
  const handleSelectIntervenant = (currentValue: string) => {
    setSelectedIntervenants((prev) =>
      prev.includes(currentValue)
        ? prev.filter((val) => val !== currentValue)
        : [...prev, currentValue]
    );
  };

  const removeIntervenant = (value: string) => {
    setSelectedIntervenants((prev) => prev.filter((val) => val !== value));
  };

  const handleSelectProduit = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        const newQuantities = { ...quantities };
        delete newQuantities[productId];
        setQuantities(newQuantities);
        return prev.filter((id) => id !== productId);
      }
      setQuantities((prev) => ({ ...prev, [productId]: 1 }));
      return [...prev, productId];
    });
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    const newQuantities = { ...quantities };
    delete newQuantities[productId];
    setQuantities(newQuantities);
  };

  const handleQuantityChange = (productId: string, value: string) => {
    const newQuantity = Math.max(1, parseInt(value, 10) || 1);
    setQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
  };

  // Vérification des modifications
  React.useEffect(() => {
    const currentData = {
      date,
      client: value,
      intervenants: selectedIntervenants,
      probleme,
      typeMaintenance,
      typeDefaillance,
      causeDefaillance,
      causeLiee,
      rapport,
      duree,
      produits: selectedProducts.map((id) => ({
        id,
        quantity: quantities[id] || 1,
      })),
      superviseur,
    };

    setHasChanges(JSON.stringify(currentData) !== JSON.stringify(initialData));
  }, [
    date,
    value,
    selectedIntervenants,
    probleme,
    typeMaintenance,
    typeDefaillance,
    causeDefaillance,
    causeLiee,
    rapport,
    duree,
    selectedProducts,
    quantities,
    superviseur,
    initialData,
  ]);

  // Composant de navigation avec bouton conditionnel
  const NavComponent = () => {
    return (
      <div className="flex space-x-4">
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
        <Button
          className="cursor-pointer transition ease-in-out duration-300 active:scale-95 text-white bg-blue-600"
          variant={"outline"}
          disabled={!hasChanges}
        >
          <Save />
          <div className="hidden lg:block">Enregistrer la modification</div>
          <div className="lg:hidden">Enregistrer</div>
        </Button>
      </div>
    );
  };

  const selectedProductsData = products.filter((product) =>
    selectedProducts.includes(product.id)
  );

  return (
    <Layout autre={NavComponent}>
      <div className="flex w-full flex-col justify-center items-center uppercase font-semibold text-xl mt-4">
        FICHE D'INTERVENTION N° {id}
        <div className="w-32 h-1.5 bg-blue-600 mt-1 rounded-full"></div>
      </div>

      <div className="lg:hidden flex justify-end w-full my-4 ">
        <NavComponent />
      </div>

      {/* Sections du formulaire */}
      <div className="w-full mt-6 p-4 border border-dotted rounded-sm">
        <p className="w-full text-center mb-4">COMPTE-RENDU</p>
        <div className="w-full flex max-lg:flex-col max-lg:space-y-4 items-start justify-between">
          {/* Date */}
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
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Client */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="cient">Client</Label>
            <Popover>
              <PopoverTrigger asChild className="cursor-pointer">
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-[200px] justify-between"
                >
                  {value
                    ? frameworks.find((f) => f.value === value)?.label
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
                          onSelect={(currentValue) =>
                            setValue(currentValue === value ? "" : currentValue)
                          }
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
          </div>

          {/* Intervenants */}
          <div className="grid w-full max-w-sm items-center gap-1.5 border border-dotted p-2 rounded-sm">
            <Label htmlFor="Intervenant">Intervenants</Label>
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
            <Popover open={openIntervenants} onOpenChange={setOpenIntervenants}>
              <PopoverTrigger asChild className="cursor-pointer">
                <Button
                  variant="outline"
                  role="combobox"
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
                          onSelect={() =>
                            handleSelectIntervenant(intervenant.value)
                          }
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
          </div>
        </div>
      </div>

      {/* Problème signalé */}
      <div className="w-full mt-6 p-4 border border-dotted rounded-sm">
        <p className="w-full text-center mb-4 uppercase">problème signalé</p>
        <Textarea
          placeholder="Décrivez votre probléme ici"
          value={probleme}
          onChange={(e) => setProbleme(e.target.value)}
        />
      </div>

      {/* Types de maintenance, défaillance et cause */}
      <div className="w-full mt-6 p-4 border border-dotted rounded-sm">
        <div className="w-full flex items-start justify-between max-lg:flex-col max-lg:space-y-6">
          {/* Type de maintenance */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="date">TYPE DE MAINTENANCE</Label>
            <div className="w-full max-w-md space-y-3">
              <div className="space-y-2">
                {options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-slate-50 ${
                      typeMaintenance === option.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => setTypeMaintenance(option.id)}
                  >
                    <div className="space-y-1">
                      <Label
                        htmlFor={option.id}
                        className="font-medium cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                    <Checkbox
                      id={option.id}
                      checked={typeMaintenance === option.id}
                      onCheckedChange={() => setTypeMaintenance(option.id)}
                      className="h-5 w-5 data-[state=checked]:bg-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Type de défaillance */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="type de defaillance">TYPE DE DEFAILLANCE</Label>
            <div className="w-full max-w-md space-y-3">
              <div className="space-y-2">
                {options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-slate-50 ${
                      typeDefaillance === option.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => setTypeDefaillance(option.id)}
                  >
                    <div className="space-y-1">
                      <Label
                        htmlFor={option.id}
                        className="font-medium cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                    <Checkbox
                      id={option.id}
                      checked={typeDefaillance === option.id}
                      onCheckedChange={() => setTypeDefaillance(option.id)}
                      className="h-5 w-5 data-[state=checked]:bg-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cause de défaillance */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="cause de la défaillance">
              CAUSE DE DEFAILLANCE
            </Label>
            <div className="w-full max-w-md space-y-3">
              <div className="space-y-2">
                {options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-slate-50 ${
                      causeDefaillance === option.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => setCauseDefaillance(option.id)}
                  >
                    <div className="space-y-1">
                      <Label
                        htmlFor={option.id}
                        className="font-medium cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                    <Checkbox
                      id={option.id}
                      checked={causeDefaillance === option.id}
                      onCheckedChange={() => setCauseDefaillance(option.id)}
                      className="h-5 w-5 data-[state=checked]:bg-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cause liée à la défaillance */}
      <div className="w-full mt-6 p-4 border border-dotted rounded-sm">
        <p className="w-full text-center mb-4 uppercase">
          cause liée à la défaillance
        </p>
        <Textarea
          placeholder="Décrivez la cause ici"
          value={causeLiee}
          onChange={(e) => setCauseLiee(e.target.value)}
        />
      </div>

      {/* Rapport d'intervention */}
      <div className="w-full mt-6 p-4 border border-dotted rounded-sm">
        <p className="w-full text-center mb-4 uppercase">
          Rapport d'intervention / recommandation
        </p>
        <div className="flex max-lg:flex-col max-lg:space-y-4">
          <Textarea
            placeholder="Tapez le rapport ici"
            value={rapport}
            onChange={(e) => setRapport(e.target.value)}
          />
          <div className="lg:border-l ml-2 p-1">
            <Label className="mb-1" htmlFor="durée">
              Durée
            </Label>
            <Input value={duree} onChange={(e) => setDuree(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Pièces de rechange */}
      <div className="w-full mt-6 p-4 border border-dotted rounded-sm">
        <p className="w-full text-center mb-4 uppercase">pièces de rechange</p>
        <div className="w-full space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="products">Sélection de Produits</Label>
            <Popover open={openProduit} onOpenChange={setOpenProduit}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
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

      {/* Visa */}
      <div className="w-full mt-6 p-4 border border-dotted rounded-sm">
        <p className="w-full text-center mb-4 uppercase">Visa</p>
        <div className="flex max-lg:flex-col max-lg:space-y-4">
          <div className="ml-2 p-1 w-full">
            <Label className="mb-1" htmlFor="durée">
              Superviseur (Nom-signature-cachet)
            </Label>
            <Input
              value={superviseur}
              onChange={(e) => setSuperviseur(e.target.value)}
            />
          </div>
          <div className="border-l w-full ml-2 p-1">
            <Label className="mb-2" htmlFor="Intervenant">
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
            <Popover open={openIntervenants} onOpenChange={setOpenIntervenants}>
              <PopoverTrigger asChild className="cursor-pointer">
                <Button
                  variant="outline"
                  role="combobox"
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
                          onSelect={() =>
                            handleSelectIntervenant(intervenant.value)
                          }
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Modifier_intervention;
