import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

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
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-600 transition-colors text-sm flex items-center mt-2 sm:hidden"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Retirer
                        </button>
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
                      <div className="flex border border-slate-300 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="px-2 py-1 flex items-center justify-center hover:bg-slate-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.product.id,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-10 px-2 py-1 text-center focus:outline-none focus:ring-0 border-x border-slate-300"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="px-2 py-1 flex items-center justify-center hover:bg-slate-100"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
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
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-600 transition-colors text-sm flex items-center mt-1 ml-auto hidden sm:flex"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Retirer
                      </button>
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

                <button className="btn-primary w-full mb-4">
                  Valider la commande
                </button>

                <Link
                  to="/catalog"
                  className="btn-outline w-full flex items-center justify-center"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continuer les achats
                </Link>
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
    </div>
  );
};

export default CartPage;
