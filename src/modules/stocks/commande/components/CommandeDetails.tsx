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
import { Commande } from "../types/commande";
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
import { Loader2 } from "lucide-react";

const CommandeDetails = () => {
  const [openCancel, setOpenCancel] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [formError, setFormError] = useState("");
  const { id } = useParams();
  const { data: commande } = useCommande(Number(id)!);
  const commandeReserveAll = useCommandeReserveAll();
  const navigate = useNavigate();
  const commandeCancel = useCommandeCancel();
  const updateCommandeStatus = useUpdateCommandeStatus();
  const deleteCommande = useDeleteCommande();

  const [showError, setShowError] = useState(false);

  const statusOptions: Commande["etat_commande"][] = [
    "en_attente",
    "Retournée",
    "Livrée",
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
    return `${price.toLocaleString()} FCFA`;
  };

  const onStatusChange = (id: number, status: Commande["etat_commande"]) => {
    updateCommandeStatus.mutate({ id, status });
  };

  const getStatusColor = (status: Commande["etat_commande"]) => {
    const colors = {
      en_attente: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Retournée: "bg-orange-100 text-orange-800 border-orange-300",
      Livrée: "bg-green-100 text-green-800 border-green-300",
      annulée: "bg-red-100 text-red-800 border-red-300",
    };

    return colors[status] || colors["en_attente"];
  };

  const validateForm = () => {
    if (!cancelReason.trim()) {
      setFormError("Le motif est obligatoire");
      return false;
    }
    if (cancelReason.trim().length < 3) {
      setFormError("Le motif doit contenir au moins 3 caractères");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Ici tu peux faire l'appel API d'annulation
      commandeCancel.mutate({ id: Number(id)!, motif: cancelReason });

      alert("Commande annulée pour le motif : " + cancelReason);
      setOpenCancel(false);
      setCancelReason("");
      setFormError("");
    }
  };
  const handleSupprimer = async () => {
    // Ici tu peux faire l'appel API d'annulation
    const type = commande?.client ? "vente en ligne" : "vente directe";
    await deleteCommande.mutateAsync({ id: Number(id), type: type });
    setOpenDelete(false);
  };

  const handleCancel = () => {
    setOpenCancel(false);
    setCancelReason("");
    setFormError("");
  };

  // Corrige : gestion du undefined et du typage
  const isvalidereserve = (): boolean => {
    if (!commande?.produits) return false;
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

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
                    commande?.etat_commande === "annulée"
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
                        <Button
                          variant="blue"
                          size="sm"
                          disabled={
                            item.produit.qte_produit !== undefined
                              ? item.produit.qte_produit <= 0
                              : false
                          }
                          className="w-full max-w-[120px]"
                        >
                          Faire sortir
                        </Button>
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
                      <Button
                        variant="blue"
                        size="sm"
                        disabled={
                          item.produit.qte_produit !== undefined
                            ? item.produit.qte_produit <= 0
                            : false
                        }
                        className="w-full max-w-[100px]"
                      >
                        Faire sortir
                      </Button>
                    )}
                </div>
              </div>
            ))}
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
              {commande?.etat_commande === "annulée" ? (
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
                    onClick={() => setOpenCancel(true)}
                  >
                    Annuler la commande
                  </Button>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog d'annulation */}
      <Dialog open={openCancel} onOpenChange={setOpenCancel}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Annuler la commande</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motif d'annulation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex : Client absent, erreur de stock..."
              />
              {formError && (
                <p className="text-xs text-red-600 mt-1">{formError}</p>
              )}
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirmer l'annulation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
