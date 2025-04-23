import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Shield,
  RefreshCw,
  Check,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { productData } from "../data/products";
import ProductCard from "../components/ui/ProductCard";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  // Find product by id
  const product = productData.find((p) => p.id === id);

  // Related products
  const relatedProducts = product
    ? productData
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - DCAT Shop`;
    }
  }, [product]);

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-serif font-bold mb-4">
          Produit introuvable
        </h1>
        <p className="text-slate-600 mb-8">
          Le produit que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link to="/catalog" className="btn-primary">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="container py-4">
        <div className="flex items-center text-sm text-slate-500">
          <Link to="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link
            to="/catalog"
            className="hover:text-amber-600 transition-colors"
          >
            Boutique
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link
            to={`/catalog?category=${product.category}`}
            className="hover:text-amber-600 transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-slate-900 font-medium truncate">
            {product.name}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-slate-50 rounded-lg overflow-hidden mb-4">
              <img
                src={product.imageLarge || product.image}
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2">
              <Link
                to={`/catalog?brand=${product.brand}`}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                {product.brand}
              </Link>
            </div>

            <h1 className="text-3xl font-serif font-bold mb-4">
              {product.name}
            </h1>

            <div className="flex items-center mb-6"></div>

            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-slate-900">
                  {product.price.toFixed(2)} FCFA
                </span>
              </div>
              <div className="text-slate-500 mt-1">
                Disponibilité:
                <span
                  className={`ml-2 font-medium ${
                    product.inStock ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {product.inStock ? "En stock" : "Bientôt disponible"}
                </span>
              </div>
            </div>

            <div className="prose prose-slate mb-6 text-slate-700">
              <p>{product.shortDescription}</p>
            </div>

            {/* Add to cart */}
            {product.inStock && (
              <div className="flex items-center mb-8">
                <div className="flex border border-slate-300 rounded-md mr-4">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-2 flex items-center justify-center hover:bg-slate-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value)))
                    }
                    className="w-12 px-2 py-2 text-center focus:outline-none focus:ring-0 border-x border-slate-300"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-2 flex items-center justify-center hover:bg-slate-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 py-3"
                >
                  Ajouter au panier
                </button>
              </div>
            )}

            {/* Shipping and Returns */}
            <div className="space-y-4 border-t border-slate-200 pt-6">
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Expédition rapide</h3>
                  <p className="text-sm text-slate-500">
                    Commandes préparées et envoyées dans un délai très court
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Produit authentique</h3>
                  <p className="text-sm text-slate-500">
                    Qualité garantie, sans contrefaçon
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <RefreshCw className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Service d'installation</h3>
                  <p className="text-sm text-slate-500">
                    Nous proposons l'installation professionnelle de vos
                    produits, sur demande
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="container py-12">
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${
                activeTab === "description"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${
                activeTab === "specifications"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Caractéristiques
            </button>
          </div>
        </div>

        <div className="py-8">
          {activeTab === "description" && (
            <div className="prose prose-slate max-w-none">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="prose prose-slate max-w-none">
              <table className="min-w-full divide-y divide-slate-200">
                <tbody className="divide-y divide-slate-200">
                  {product.specifications.map((spec, index) => (
                   <div></div>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container py-12 border-t border-slate-200">
          <h2 className="text-2xl font-serif font-bold mb-8">
            Produits connexes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
