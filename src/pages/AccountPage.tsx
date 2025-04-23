import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Package, User, Heart, CreditCard, LogOut } from "lucide-react";

const AccountPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    document.title = "Mon compte - DCAT Shop";
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Mock order history
  const orders = [
    { id: "ORD-1234", date: "2025-04-15", status: "Delivered", total: 249.99 },
    { id: "ORD-5678", date: "2025-03-21", status: "Shipped", total: 189.5 },
    { id: "ORD-9012", date: "2025-02-10", status: "Processing", total: 399.99 },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container">
        <h1 className="text-3xl font-serif font-bold mb-8">Mon compte</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-100 rounded-full h-12 w-12 flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="font-medium text-slate-900">{user?.name}</h2>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                <a
                  href="#account-info"
                  className="flex items-center space-x-3 px-4 py-3 rounded-md bg-slate-50 text-slate-900"
                >
                  <User className="h-5 w-5 text-slate-600" />
                  <span>Informations sur le compte</span>
                </a>
                <a
                  href="#orders"
                  className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <Package className="h-5 w-5 text-slate-600" />
                  <span>Ordres</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <Heart className="h-5 w-5 text-slate-600" />
                  <span>Liste de souhaits</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <CreditCard className="h-5 w-5 text-slate-600" />
                  <span>Méthodes de paiement</span>
                </a>
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Se déconnecter</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Account Information */}
            <section
              id="account-info"
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-medium mb-6">
                Informations sur le compte
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm uppercase text-slate-500 font-medium mb-3">
                    Information Personnelle
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Nom et prénom
                      </label>
                      <input
                        type="text"
                        id="name"
                        defaultValue={user?.name}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Adresse email
                      </label>
                      <input
                        type="email"
                        id="email"
                        defaultValue={user?.email}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Numéro de téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm uppercase text-slate-500 font-medium mb-3">
                    adresse de livraison
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Adresse de la rue
                      </label>
                      <input
                        type="text"
                        id="address"
                        defaultValue="123 Main Street"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-slate-700 mb-1"
                        >
                          Ville
                        </label>
                        <input
                          type="text"
                          id="city"
                          defaultValue="San Francisco"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-slate-700 mb-1"
                        >
                          Commune
                        </label>
                        <input
                          type="text"
                          id="state"
                          defaultValue="CA"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="zip"
                          className="block text-sm font-medium text-slate-700 mb-1"
                        >
                          Quartier
                        </label>
                        <input
                          type="text"
                          id="zip"
                          defaultValue="94105"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="btn-primary">
                  Enregistrer les modifications
                </button>
              </div>
            </section>

            {/* Order History */}
            <section id="orders" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-6">
                Historique des commandes
              </h2>

              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                        >
                          Order ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a
                              href={`/order/${order.id}`}
                              className="text-amber-600 hover:text-amber-900"
                            >
                              Voir
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-medium text-slate-900">
                    Aucune commande pour l'instant
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Une fois que vous aurez passé une commande, elle apparaîtra
                    ici.
                  </p>
                  <div className="mt-6">
                    <a href="/catalog" className="btn-primary">
                      Parcourir les produits
                    </a>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
