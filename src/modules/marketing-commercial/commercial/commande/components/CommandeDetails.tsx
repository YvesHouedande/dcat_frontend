import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useParams } from "react-router-dom";
import { useCommande, useDeleteCommande } from "../hooks/useCommandes";
import { Commande, ProduitDetail } from "../types/commande";
import { useNavigate } from "react-router-dom";
import { useCommandeCancel } from "../hooks/useCommandes";
import { useCommandeReserveAll } from "../hooks/useCommandes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { StatusBadge } from "./CommandeTable";
import { useUpdateCommandeStatus } from "../hooks/useCommandes";
import { CheckCircle, Loader2, Printer } from "lucide-react";
import { useFetchExemplaireProduitByEtat } from "@/modules/stocks/exemplaire/hooks/useExemplaireProduits";
import { useSortieExemplaireCreate } from "@/modules/stocks/exemplaire/hooks/useSortieExemplaire";
import { toast } from "sonner";
import { getAxiosErrorMessage } from "@/api/api";
import { useSortieExemplaireCommande } from "@/modules/stocks/exemplaire/hooks/useSortieExemplaire";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteSortieExemplaire } from "@/modules/stocks/exemplaire/hooks/useSortieExemplaire";
import { etat_commande } from "../types/commande";

const CommandeDetails = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [sortieLoading, setSortieLoading] = useState(false);
  const { id } = useParams();
  const { data: commande } = useCommande(Number(id)!);
  const commandeReserveAll = useCommandeReserveAll();
  const commandeSortieExemplaire = useSortieExemplaireCommande(String(id));
  const { mutate: mutateSortieExemplaire } = useSortieExemplaireCreate();
  const { mutate: mutateDeleteSortieExemplaire } = useDeleteSortieExemplaire();
  const navigate = useNavigate();
  const commandeCancel = useCommandeCancel();
  const updateCommandeStatus = useUpdateCommandeStatus();
  const deleteCommande = useDeleteCommande();
  const queryClient = useQueryClient();
  const [showError, setShowError] = useState(false);

  const statusOptions: Commande["etat_commande"][] = [
    etat_commande.annulee,
    etat_commande.en_cours,
    etat_commande.en_attente,
    etat_commande.livree,
    etat_commande.retournee,
  ];

  // Effet pour afficher l'erreur après 1 seconde
  useEffect(() => {
    if (commande === undefined) {
      const timer = setTimeout(() => {
        setShowError(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [commande]);

  if (commande === undefined && showError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Commande introuvable
          </h1>
          <p className="text-gray-600 max-w-md">
            La commande que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mt-4"
          >
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  /**
   * Formats a given price number into a localized string representation
   * with a currency suffix.
   *
   * @param price - The price number to format.
   * @returns A string formatted with the locale's number representation
   * followed by the currency "FCFA".
   */

  const formatPrice = (price: number) => {
    return `${price} FCFA`;
  };

  const onStatusChange = (id: number, status: Commande["etat_commande"]) => {
    updateCommandeStatus.mutate({ id, status });
  };

  const getStatusColor = (status: Commande["etat_commande"]) => {
    const colors = {
      en_attente: "bg-yellow-100 text-yellow-800 border-yellow-300",
      retournee: "bg-orange-100 text-orange-800 border-orange-300",
      livree: "bg-green-100 text-green-800 border-green-300",
      annulee: "bg-red-100 text-red-800 border-red-300",
      en_cours: "bg-blue-100 text-blue-800 border-blue-300",
      
    };
    return colors[status] || colors["en_attente"];
  };

  const handleSubmit = () => {
    // Ici tu peux faire l'appel API d'annulation
    commandeCancel.mutate({ id: Number(id)!, motif: "" });
  };
  const handleSupprimer = async () => {
    // Ici tu peux faire l'appel API d'annulation
    const type = commande?.client ? "vente en ligne" : "vente directe";
    await deleteCommande.mutateAsync({ id: Number(id), type: type });
    setOpenDelete(false);
  };

  // Corrige : gestion du undefined et du typage
  const isvalidereserve = (): boolean => {
    if (!commande?.produits || commande.produits.length === 0) return false;
    return commande.produits.every(
      (produit) =>
        produit.produit?.qte_produit !== undefined &&
        produit.quantite <= produit.produit.qte_produit
    );
  };

  const isEditable = (status: Commande["etat_commande"]): boolean => {
    return status === "en_attente";
  };

  const validereserve = () => {
    // Correction : l'objet doit avoir la clé 'commandeId' et non 'Number'
    commandeReserveAll.mutate({ commandeId: Number(id)! });
  };

  const faireSortieDisabled = (item: ProduitDetail) => {
    const istrue =
      item.produit.qte_produit !== undefined
        ? item.produit.qte_produit <= 0
        : false;

    return sortieLoading || istrue;
  };

  const isSortieExemplaire = (item: ProduitDetail) => {
    const exemplaireExiste = commandeSortieExemplaire.data?.some(
      (itemSortie) =>
        String(itemSortie.exemplaire.id_produit) ===
        String(item.produit.id_produit)
    );
    console.log("exemplaire existe: ", exemplaireExiste);
    return exemplaireExiste;
  };

  const AnnulerSortieExemplaire = ({ item }: { item: ProduitDetail }) => {
    const handleDeleteSortieExemplaire = () => {
      mutateDeleteSortieExemplaire(String(item.produit.id_produit));
    };
    return (
      <Button
        size="sm"
        className="w-full max-w-[120px] text-[11px] bg-orange-200 text-amber-800 hover:bg-amber-400 hover:text-amber-900"
        onClick={handleDeleteSortieExemplaire}
      >
        Annuler la sortie
      </Button>
    );
  };
  const FaireSortieExemplaire = ({ item }: { item: ProduitDetail }) => {
    setSortieLoading(true);
    const { ExemplaireProduitByEtat, error } = useFetchExemplaireProduitByEtat(
      item.produit.id_produit,
      "Reserve"
    );
    if (error) {
      toast.error(getAxiosErrorMessage(error));

      return;
    }

    if (
      !ExemplaireProduitByEtat ||
      ExemplaireProduitByEtat.length < item.quantite
    ) {
      return (
        <Button
          size="sm"
          className="w-full max-w-[120px] text-[11px] bg-amber-300 text-amber-800 hover:bg-amber-400 hover:text-amber-900"
        >
          réserve insuffisante
        </Button>
      );
    }
    const handleSortie = () => {
      setSortieLoading(true);
      for (let i = 0; i < item.quantite; i++) {
        const id = ExemplaireProduitByEtat[i].id_exemplaire;
        mutateSortieExemplaire(
          {
            id_commande: id,
            id_exemplaire: String(id),
            type_sortie: "vente directe",
          },
          {
            onError: (errorSortie) => {
              toast.error(getAxiosErrorMessage(errorSortie));
            },
          }
        );
      }
      setSortieLoading(false);
      toast.success("Sortie réussie");
      queryClient.invalidateQueries({
        queryKey: ["commande", id],
      });
    };
    setSortieLoading(false);

    return (
      <Button
        variant="blue"
        size="sm"
        disabled={faireSortieDisabled(item)}
        className="w-full max-w-[120px]"
        onClick={handleSortie}
      >
        {sortieLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Faire sortir"
        )}
      </Button>
    );
  };

  const ValideBoutton = ({ item }: { item: ProduitDetail }) => {
    if (isSortieExemplaire(item)) {
      return <AnnulerSortieExemplaire item={item} />;
    }
    return <FaireSortieExemplaire item={item} />;
  };

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Commande #${commande?.id_commande}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-info { margin-bottom: 20px; display: flex; align-items: center; gap: 20px; }
            .company-logo { width: 80px; height: 80px; object-fit: contain; }
            .company-details { flex: 1; }
            .order-info { margin-bottom: 20px; }
            .customer-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .product-image { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; }
            .product-cell { display: flex; align-items: center; gap: 10px; }
            .total { text-align: right; font-weight: bold; margin-top: 20px; }
            .status { display: inline-block; padding: 4px 8px; border-radius: 4px; }
            .status.livree { background-color: #d4edda; color: #155724; }
            .status.attente { background-color: #fff3cd; color: #856404; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <img src="${BASE_URL}/public/dcat-logo.png" alt="DCAT Logo" class="company-logo" onerror="this.style.display='none'">
              <div class="company-details">
                <h1>DCAT</h1>
                <p>Adresse de l'entreprise</p>
                <p>Téléphone: +XXX XXX XXX</p>
              </div>
            </div>
            <h2>COMMANDE #${commande?.id_commande}</h2>
            <p>Date: ${commande?.date_de_commande}</p>
            <span class="status ${
              commande?.etat_commande === etat_commande.livree
                ? "livree"
                : "attente"
            }">
              ${commande?.etat_commande}
            </span>
          </div>
  
          <div class="customer-info">
            <h3>${commande?.partenaire ? "Partenaire" : "Client"}</h3>
            <p><strong>Nom:</strong> ${
              commande?.partenaire?.nom_partenaire ?? commande?.client?.nom
            }</p>
            <p><strong>Email:</strong> ${
              commande?.partenaire?.email_partenaire ?? commande?.client?.email
            }</p>
            <p><strong>Téléphone:</strong> ${
              commande?.partenaire?.telephone_partenaire ??
              commande?.client?.contact
            }</p>
            <p><strong>Lieu de livraison:</strong> ${
              commande?.lieu_de_livraison
            }</p>
          </div>
  
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Code</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${commande?.produits
                ?.map(
                  (item) => `
              <tr>
                <td class="product-cell">
                  ${
                    item.images && item.images.length > 0
                      ? `<img src="${BASE_URL}${item.images[0].lien_image}" alt="${item.produit.desi_produit}" class="product-image" onerror="this.style.display='none'">`
                      : ""
                  }
                  <span>${item.produit.desi_produit}</span>
                </td>
                <td>${item.produit.code_produit}</td>
                <td>${formatPrice(item.prix_unitaire)}</td>
                <td>${item.quantite}</td>
                <td>${formatPrice(item.prix_unitaire * item.quantite)}</td>
              </tr>
            `
                )
                .join("")}
            </tbody>
          </table>
  
          <div class="total">
            <p><strong>Total:</strong> ${formatPrice(
              Number(commande?.montant_total)
            )}</p>
            <p><strong>Mode de paiement:</strong> ${
              commande?.mode_de_paiement
            }</p>
          </div>
  
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    // Créer un blob avec le contenu HTML et spécifier l'encodage UTF-8
    const blob = new Blob([printContent], { type: "text/html; charset=utf-8" });
    const url = URL.createObjectURL(blob);

    // Ouvrir la fenêtre avec l'URL du blob
    const printWindow = window.open(url, "_blank");

    // Nettoyer l'URL après utilisation
    if (printWindow) {
      printWindow.onload = () => {
        URL.revokeObjectURL(url);
      };
    }
  };

  return (
    <div className=" mx-auto min-h-screen pt-4 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section principale - Commande */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between font-bold text-xl mb-2">
            Commande # {commande?.id_commande}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`${
                    commande?.etat_commande.toLowerCase() === "annulée"
                      ? "pointer-events-none"
                      : ""
                  }`}
                  variant="ghost"
                  size="sm"
                >
                  <StatusBadge
                    status={commande?.etat_commande ?? "en_attente"}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {statusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => onStatusChange(Number(id)!, status)} // Convertir l'id en nombre et passer le status en paramètrecommande?.id_commande, status)}
                    className={
                      commande?.etat_commande === status ? "bg-gray-100" : ""
                    }
                  >
                    <Badge
                      variant="outline"
                      className={`mr-2 ${getStatusColor(status)}`}
                    >
                      {status}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-gray-500 mb-6">
            Passée le {commande?.date_de_commande}
          </p>
          {commande?.commande_produits_reserves ? (
            <label className="text-green-800 mb-6 p-2 bg-green-100 rounded-md flex items-center gap-2 max-w-max">
              <span>produits déja réservés</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </label>
          ) : (
            <>
              {isvalidereserve() &&
                isEditable(commande?.etat_commande ?? "en_attente") && (
                  <Button
                    variant={"blue"}
                    className="mb-4"
                    onClick={() => validereserve()}
                  >
                    Tout reserver
                  </Button>
                )}
            </>
          )}

          {/* En-têtes du tableau */}
          <div className="grid grid-cols-12 gap-4 py-3 text-sm font-medium text-gray-700 border-b max-md:hidden">
            <div className="col-span-4">Produit</div>
            <div className="col-span-2 text-right">Prix unitaire</div>
            <div className="col-span-1 text-center">Quantité</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1 text-center">Stock</div>
            <div className="col-span-2 text-center">Action</div>
          </div>

          {/* Items de la commande */}
          <div className="space-y-4">
            {commande?.produits?.map((item) => (
              <div
                key={item.produit.id_produit}
                className="flex flex-col gap-3 p-4 max-lg:border rounded-lg bg-white shadow-sm lg:grid lg:grid-cols-12 lg:gap-4 lg:py-4 lg:border-b lg:rounded-none lg:shadow-none lg:items-center"
              >
                <div className="flex items-center gap-3 lg:col-span-4">
                  {item.images && (
                    <img
                      src={BASE_URL + item.images[0].lien_image}
                      alt={item.produit.desi_produit}
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.produit.desi_produit}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.produit.code_produit}
                    </p>
                  </div>
                </div>

                {/* Sur mobile, on affiche les infos en colonne */}
                <div className="flex flex-col gap-2 text-sm lg:hidden">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Prix unitaire :</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(item.prix_unitaire)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Quantité :</span>
                    <span className="font-medium text-gray-900">
                      {item.quantite}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Total :</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(item.prix_unitaire * item.quantite)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">En stock :</span>
                    <span
                      className={`font-medium ${
                        item.produit.qte_produit && item.produit.qte_produit > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.produit.qte_produit}
                    </span>
                  </div>
                  {item.produit.qte_produit !== undefined &&
                    item.produit.qte_produit >= item.quantite &&
                    isEditable(commande?.etat_commande ?? "en_attente") && (
                      <div className="flex justify-end pt-2">
                        <ValideBoutton item={item} />
                      </div>
                    )}
                </div>

                {/* Sur desktop, on garde le tableau */}
                <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end font-medium text-gray-900">
                  {formatPrice(item.prix_unitaire)}
                </div>
                <div className="hidden lg:col-span-1 lg:flex lg:items-center lg:justify-center font-medium text-gray-900">
                  {item.quantite}
                </div>
                <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end font-medium text-gray-900">
                  {formatPrice(item.prix_unitaire * item.quantite)}
                </div>
                <div className="hidden lg:col-span-1 lg:flex lg:items-center lg:justify-center">
                  <span
                    className={`font-medium text-sm ${
                      item.produit.qte_produit && item.produit.qte_produit > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.produit.qte_produit}
                  </span>
                </div>
                <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-center">
                  {item.produit.qte_produit !== undefined &&
                    item.produit.qte_produit >= item.quantite &&
                    isEditable(commande?.etat_commande ?? "en_attente") && (
                      <ValideBoutton item={item} />
                    )}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-red-50 p-4 rounded-md mb-4">
            <p className="text-red-500">
              Information importante:
              <br />
              <span className="font-bold">
                Il faut reserver les produits avant de les faire sortir.
              </span>
              <br />
              <span className="font-bold">
                le bouton reserver est disponible uniquement si la quantité en stock des produits est supérieure à la quantité commandée.
              </span>
            </p>
          </div>
        </div>

        {/* Section détails */}
        <div className="space-y-6">
          {/* Détails de la commande */}
          {commande?.etat_commande === "en_attente" && (
            <Button
              variant={"blue"}
              onClick={() => navigate("modifier")}
              className="w-full"
            >
              Modifier
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handlePrint}
            className="w-full mb-4"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimer la commande
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {commande?.partenaire ? "Partenaire" : "Client"}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium">
                    {commande?.partenaire?.nom_partenaire ??
                      commande?.client?.nom}
                  </p>
                  <p>
                    {commande?.partenaire?.email_partenaire ??
                      commande?.client?.email}
                  </p>
                  <p>
                    {commande?.partenaire?.telephone_partenaire ??
                      commande?.client?.contact}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Lieu de Livraison
                </h4>
                <p className="text-sm text-gray-600">
                  {commande?.lieu_de_livraison}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Paiement</h4>
                <p className="text-sm text-gray-600">
                  {commande?.mode_de_paiement}
                </p>
              </div>

              {/* Totaux */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">
                    {formatPrice(Number(commande?.montant_total))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium text-green-600">Gratuit</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(Number(commande?.montant_total))}</span>
                  </div>
                </div>
              </div>
              {commande?.etat_commande.toLowerCase() === "annulée" ? (
                <div>
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">
                      Motif d'annulation
                    </h4>
                    <p className="text-sm text-gray-600"></p>
                  </div>
                  <Button
                    className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white"
                    size="lg"
                    onClick={() => setOpenDelete(true)}
                  >
                    Supprimer la commande
                  </Button>
                </div>
              ) : (
                commande?.etat_commande === "en_attente" && (
                  <Button
                    className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white"
                    size="lg"
                    onClick={() => handleSubmit()}
                  >
                    Annuler la commande
                  </Button>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de suppression */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer la commande</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-700">
                <strong>Cette action est irréversible.</strong>
                <br />
                Voulez-vous vraiment supprimer cette commande ?<br />
                Elle sera définitivement supprimée de votre historique.
              </p>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDelete(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={() => handleSupprimer()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirmer la suppression
                {deleteCommande.isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommandeDetails;
