import React from "react";
import { Link } from "react-router-dom";
import {ShoppingCart } from "lucide-react";
import { Product } from "../../types/product";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="card h-full">
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="relative pt-[100%]">
          <img
            src={product.image}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center mb-1">
            <span className="text-sm text-slate-500">{product.brand}</span>
            <span className="mx-2 text-slate-300">•</span>
            <span className="text-sm text-slate-500">{product.category}</span>
          </div>
          <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center mb-3">
            <div className="flex items-center"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-medium text-slate-900">
                {product.price.toFixed(2)} FCFA
              </span>
            </div>
            {product.inStock ? (
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center w-10 h-10 bg-slate-900 hover:bg-amber-500 text-white rounded-full transition-colors"
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
            ) : (
              <span className="text-xs font-medium text-amber-600 bg-red-50 px-2 py-1 rounded">
                Bientôt disponible
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
