import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {X, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";


const HistoryCartPage: React.FC = () => {
  const { cartItems, subtotal } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderStatus] = React.useState<
    "en cours" | "validée" | "annulée" | "livrée" | "retournée"
  >("en cours");

  const handleCancelClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmCancel = () => {
    // Ajoute ici la logique d'annulation
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "en cours":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "validée":
        return "bg-green-100 text-green-700 border-green-300";
      case "annulée":
        return "bg-red-100 text-red-700 border-red-300";
      case "livrée":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "retournée":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  useEffect(() => {
    document.title = "Your Cart - DCAT Shop";
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">Panier</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 bg-slate-50 p-4 border-b border-slate-200">
                  <div className="col-span-6">
                    <span className="font-medium">Produit</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-medium">Prix</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-medium">Quantité</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="font-medium">Total</span>
                  </div>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="grid grid-cols-1 sm:grid-cols-12 p-4 border-b border-slate-200 last:border-b-0 items-center"
                  >
                    {/* Product */}
                    <div className="col-span-6 flex items-center mb-4 sm:mb-0">
                      <div className="relative h-20 w-20 flex-shrink-0 bg-slate-50 rounded-md">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-medium text-slate-900 hover:text-amber-600 transition-colors mb-1 block"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-slate-500">
                          Marque: {item.product.brand}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-center text-slate-900 mb-4 sm:mb-0">
                      <div className="sm:hidden inline font-medium mr-2">
                        Prix:
                      </div>
                      {item.product.price.toFixed(2)} FCFA
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2 flex justify-center mb-4 sm:mb-0">
                      <div className="flex  rounded-md">
                        <label htmlFor="quantity">{item.quantity}</label>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="col-span-2 text-right">
                      <div className="font-medium text-slate-900">
                        <div className="sm:hidden inline font-medium mr-2">
                          Total:
                        </div>
                        {(item.product.price * item.quantity).toFixed(2)} FCFA
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">
                  Résumé de la commande
                </h2>

                {/* Affichage du statut */}
                <div className="mb-4">
                  <span className="text-slate-600 mr-2">Statut :</span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full border font-semibold capitalize text-sm ${getStatusStyle(orderStatus)}`}
                  >
                    {orderStatus}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total</span>
                    <span className="font-medium">
                      {subtotal.toFixed(2)} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Expédition</span>
                    <span className="font-medium">
                      {subtotal > 99 ? "Gratuit" : "2000 FCFA"}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-lg">
                        {(
                          subtotal +
                          (subtotal > 99 ? 0 : 10) +
                          subtotal * 0.08
                        ).toFixed(2)}{" "}
                        FCFA
                      </span>
                    </div>
                  </div>
                </div>

                

                <button
                  onClick={handleCancelClick}
                  className="btn-outline w-full flex items-center justify-center text-red-500 hover:text-red-600 transition-colors mb-4"
                >
                  <X className="mr-2 h-4 w-4" />
                  Annuler la commande
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-medium mb-4">Votre panier est vide</h2>
            <p className="text-slate-600 mb-8">
              Il semble que vous n'ayez pas encore ajouté de produits à votre
              panier.
            </p>
            <Link to="/catalog" className="btn-primary">
              Commencez vos achats
            </Link>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium mb-4">Confirmer l'annulation</h3>
            <p className="text-slate-600 mb-6">
              Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleConfirmCancel}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
              >
                Confirmer
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 border border-slate-300 py-2 px-4 rounded-md hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryCartPage;
