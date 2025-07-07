import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Package,
  Tag,
  ArrowDown,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommandeFormValues } from "../types/commande";
import { formCommandeSchema } from "../schemas/CommandeSchema";
import { PartenaireCombobox } from "@/components/combobox/PartenaireCombobox";
import { ProductCombobox } from "@/components/combobox/ProductCombobox";
import { useProducts } from "../../exemplaire";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  useCreateCommandeWithMarketing,
  useCreateCommande,
  useCommande,
  useUpdateCommande,
} from "../hooks/useCommandes";
import { getAxiosErrorMessage } from "@/api/api";
import { ClientCombobox } from "@/components/combobox/ClientCombobox";
import { useParams } from "react-router-dom";

const CommandeForm = () => {
  const [typeDestinataire, setTypeDestinataire] = useState("partenaire");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const createCommande = useCreateCommande();
  const createCommandeWithMarketing = useCreateCommandeWithMarketing();
  const updateCommande = useUpdateCommande();
  const { id } = useParams();
  const { data: commande, isLoading: isLoadingCommande } = useCommande(Number(id));
  const isUpdate = commande !== undefined;

  const form = useForm<CommandeFormValues>({
    resolver: zodResolver(formCommandeSchema),
    defaultValues: {
      id_client: undefined,
      partenaireId: undefined,
      lieuLivraison: "",
      modePaiement: "",
      dateLivraison: undefined,
      produitsQuantites: {},
    }
  });

  // Effet pour mettre à jour le formulaire quand la commande est chargée
  useEffect(() => {
    if (commande && !isLoadingCommande) {
      // Mise à jour des champs du formulaire
      form.reset({
        id_client: commande?.client?.id ? String(commande.client.id) : undefined,
        partenaireId: commande?.partenaire?.id_partenaire ? String(commande.partenaire.id_partenaire) : undefined,
        lieuLivraison: commande?.lieu_de_livraison || "",
        modePaiement: commande?.mode_de_paiement || "",
        dateLivraison: commande?.date_livraison || undefined,
        produitsQuantites: commande?.produits ? 
          commande.produits.reduce((acc, produit) => {
            acc[String(produit.produit.id_produit)] = produit.quantite || 1;
            return acc;
          }, {} as Record<string, number>) : {},
      });

      // Mise à jour du type de destinataire
      if (commande.client?.id) {
        setTypeDestinataire("client");
      } else if (commande.partenaire?.id_partenaire) {
        setTypeDestinataire("partenaire");
      }
    }
  }, [commande, isLoadingCommande, form]);

  const handleFormSubmit = (data: CommandeFormValues) => {
    if (isUpdate) {
      updateCommande
        .mutateAsync({
          id: Number(id),
          data: {
            date_livraison: String(data.dateLivraison),
            lieu_de_livraison: data.lieuLivraison,
            mode_de_paiement: data.modePaiement,
            id_client: data.id_client,
            id_partenaire: Number(data.partenaireId),

          },
          
        })
        .then(() => {
          toast.success("Commande mise à jour avec succès !");
        })
        .catch((error) => {
          // toast.message(JSON.stringify(newdata));
          toast.error(
            "Erreur lors de la mise à jour de la commande !" +
              getAxiosErrorMessage(error)
          );
        });
    } else {
      if (typeDestinataire == "client") {
        const produits = Object.entries(data.produitsQuantites || {}).map(
          ([id_produit, quantite]) => ({
            id_produit,
            quantite,
          })
        );

        const formatedData = {
          lieu_de_livraison: data.lieuLivraison,
          mode_de_paiement: data.modePaiement,
          date_livraison: data.dateLivraison,
          id_client: Number(data.id_client),
          produits: produits,
        };

        createCommandeWithMarketing.mutate(formatedData, {
          onSuccess: () => toast.success("Commande créée avec succès !"),
          onError: (error) =>
            toast.error(
              "Erreur lors de la création de la commande !" +
                getAxiosErrorMessage(error)
            ),
        });
      } else {
        createCommande.mutate(data, {
          onSuccess: () => toast.success("Commande créée avec succès !"),
          onError: (error) =>
            toast.error(
              "Erreur lors de la création de la commande !" +
                getAxiosErrorMessage(error)
            ),
        });
      }
    }
  };

  const onSubmit = form.handleSubmit(handleFormSubmit);

  const handleAddProduct = () => {
    if (!selectedProduct || quantity <= 0) return;
    const currentProducts = form.getValues("produitsQuantites") || {};
    form.setValue("produitsQuantites", {
      ...currentProducts,
      [selectedProduct]: quantity,
    });
    setSelectedProduct("");
    setQuantity(1);
  };

  const handleRemoveProduct = (productId: string) => {
    const current = { ...form.getValues("produitsQuantites") };
    delete current[productId];
    form.setValue("produitsQuantites", current);
  };

  const handleUpdateProductQuantity = (
    productId: string,
    newQuantity: number
  ) => {
    const currentProducts = { ...form.getValues("produitsQuantites") };

    if (newQuantity <= 0) {
      delete currentProducts[productId];
    } else {
      currentProducts[productId] = newQuantity;
    }

    form.setValue("produitsQuantites", currentProducts);
  };

  const produitsQuantites = form.watch("produitsQuantites") || {};

  const { products } = useProducts();

  const allProducts = useMemo(
    () => products.data?.pages?.flatMap((page) => page.data) || [],
    [products.data]
  );

  function findProductById(id: string) {
    const produit = allProducts.find(
      (produit) => String(produit.id_produit) === id
    );
    return produit;
  }

  const modesPaiement = [
    { value: "espèce", label: "Espèces" },
    { value: "carte bancaire", label: "Carte bancaire" },
    { value: "transfer", label: "Virement" },
    { value: "mobile", label: "Mobile Money" },
  ];

  // Calcul des items du panier basé sur produitsQuantites
  const cartItems = Object.entries(produitsQuantites)
    .map(([productId, quantity]) => {
      const product = findProductById(productId);
      return product ? { ...product, quantity } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.prix_produit) * item.quantity,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} FCFA`;
  };

  // Gestion du changement de type de destinataire
  const handleTypeDestinataireChange = (value: string) => {
    setTypeDestinataire(value);

    // Réinitialiser les champs liés au destinataire
    if (value === "client") {
      form.setValue("partenaireId", undefined);
    } else {
      form.setValue("id_client", undefined);
    }
  };

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Afficher un loader pendant le chargement de la commande
  if (isUpdate && isLoadingCommande) {
    return (
      <div className="max-w-7xl mx-auto pt-6 bg-gray-50 min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Chargement de la commande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-6 bg-gray-50 min-h-screen p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section panier */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">
                {isUpdate ? "Modifier la commande" : "Panier"} ({cartItems.length})
              </h1>
            </div>

            <div className="p-6">
              {/* Produits disponibles à ajouter */}
              <div className={isUpdate ? "hidden" : "mb-6"}>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Ajouter des produits
                </h3>
                <div className="flex gap-2 mb-2 max-md:flex-col">
                  <div className="w-full lg:w-2xl">
                    <ProductCombobox
                      isTools={false}
                      value={selectedProduct}
                      onChange={(value) => setSelectedProduct(String(value))}
                    />
                  </div>

                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-20"
                    placeholder="Qté"
                  />
                  <Button type="button" onClick={handleAddProduct}>
                    Ajouter
                  </Button>
                </div>
              </div>

              {cartItems.length > 0 && (
                <>
                  {/* En-têtes */}
                  <div className="grid grid-cols-12 gap-4 pb-4 border-b text-sm font-medium">
                    <div className="col-span-6 font-semibold">Produit</div>
                    <div className="col-span-2 text-center font-semibold">
                      Prix unitaire
                    </div>
                    <div className="col-span-2 text-center font-semibold">
                      Quantité
                    </div>
                    <div className="col-span-2 text-center font-semibold">
                      Total
                    </div>
                  </div>

                  {/* Items du panier */}
                  {cartItems.map((item) => (
                    <div
                      key={item.id_produit}
                      className={`pt-6 pb-2 border-b border-gray-100 space-y-4 ${
                        isUpdate && "pointer-events-none opacity-75"
                      }`}
                    >
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6 flex items-center gap-4">
                          {item.images && item.images.length > 0 && (
                            <img
                              src={BASE_URL + item.images[0].lien_image}
                              alt={item.desi_produit}
                              className="w-16 h-16 object-cover rounded-md"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base">
                              {item.desi_produit}
                            </h3>
                          </div>
                        </div>

                        <div className="col-span-2 flex items-center justify-center">
                          <span className="font-medium text-gray-900">
                            {formatPrice(Number(item.prix_produit))}
                          </span>
                        </div>

                        <div className="col-span-2 flex items-center justify-center">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() =>
                                handleUpdateProductQuantity(
                                  String(item.id_produit),
                                  item.quantity - 1
                                )
                              }
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={isUpdate}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateProductQuantity(
                                  String(item.id_produit),
                                  item.quantity + 1
                                )
                              }
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={isUpdate}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="col-span-2 flex items-center justify-center gap-4">
                          <span className="font-bold text-gray-900">
                            {formatPrice(
                              Number(item.prix_produit) * item.quantity
                            )}
                          </span>
                          {!isUpdate && (
                            <button
                              onClick={() =>
                                handleRemoveProduct(String(item.id_produit))
                              }
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {item.famille && (
                          <Badge variant="secondary" className="mr-2">
                            <Package className="mr-1 h-3 w-3" />
                            {item.famille}
                          </Badge>
                        )}

                        {item.marque && (
                          <Badge variant="outline" className="mr-2">
                            <Tag className="mr-1 h-3 w-3" />
                            {item.marque}
                          </Badge>
                        )}

                        {item.modele && (
                          <Badge variant="outline">{item.modele}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {cartItems.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">
                    {isUpdate ? "Aucun produit dans cette commande" : "Votre panier est vide"}
                  </p>
                  {!isUpdate && (
                    <p className="text-gray-400 text-sm">
                      Ajoutez des produits ci-dessus
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section formulaire */}
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="lg:col-span-1">
              <Card className="shadow-sm sticky top-6">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Détails de la commande
                  </h2>

                  {/* Type de destinataire */}
                  <div className="mb-6">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de destinataire
                    </Label>
                    <Select
                      value={typeDestinataire}
                      onValueChange={handleTypeDestinataireChange}
                      disabled={isUpdate}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="partenaire">Partenaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sélection du destinataire */}
                  {typeDestinataire === "client" ? (
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="id_client"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sélectionner un client</FormLabel>
                            <FormControl>
                              <ClientCombobox
                                value={field.value}
                                onChange={field.onChange}
                                disabled={createCommandeWithMarketing.isLoading || isUpdate}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="partenaireId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sélectionner le partenaire</FormLabel>
                            <FormControl>
                              <PartenaireCombobox 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Lieu de livraison */}
                  <div className="mb-6">
                    <FormField
                      control={form.control}
                      name="lieuLivraison"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lieu de livraison</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Cocody, Abidjan"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Date de livraison */}
                  <div className="mb-6">
                    <FormField
                      control={form.control}
                      name="dateLivraison"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de livraison</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Mode de paiement */}
                  <div className="mb-6">
                    <FormField
                      control={form.control}
                      name="modePaiement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mode de paiement</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="-- Choisir un mode --" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {modesPaiement.map((mode) => (
                                <SelectItem key={mode.value} value={mode.value}>
                                  {mode.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Résumé des montants */}
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total</span>
                      <span className="font-medium">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Livraison</span>
                      <span className="font-medium text-green-600">
                        Gratuit
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bouton de soumission */}
                  {isUpdate ? (
                    <Button
                      type="submit"
                      disabled={updateCommande.isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      Modifier la commande
                      {updateCommande.isLoading ? (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <ArrowDown className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={
                        cartItems.length === 0 || 
                        createCommande.isLoading || 
                        createCommandeWithMarketing.isLoading
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      Créer la commande
                      {(createCommande.isLoading || createCommandeWithMarketing.isLoading) ? (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CommandeForm;