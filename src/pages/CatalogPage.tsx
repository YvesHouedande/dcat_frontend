import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import ProductCard from "../components/ui/ProductCard";
import { productData } from "../data/products";
import { Product } from "../types/product";

const CatalogPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 100000000,
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState("featured");

  // Get unique categories and brands
  const categories = [...new Set(productData.map((p) => p.category))];
  const brands = [...new Set(productData.map((p) => p.brand))];

  // Initialize from URL params
  useEffect(() => {
    document.title = "Shop Audio Equipment - DCAT Shop";

    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const search = searchParams.get("search");

    // Réinitialise tous les filtres
    setSelectedCategories(category ? [category] : []);
    setSelectedBrands(brand ? [brand] : []);
    setPriceRange([0, 100000000]);
    setInStockOnly(false);

    if (search) {
      // Filtre par recherche uniquement
      const filtered = productData.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase())
      );
      setProducts(filtered);
    } else {
      setProducts(productData);
    }
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let results = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      results = results.filter((product) =>
        selectedCategories.some(
          (cat) => cat.toLowerCase() === product.category.toLowerCase()
        )
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      results = results.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Price range filter
    results = results.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // In stock filter
    if (inStockOnly) {
      results = results.filter((product) => product.inStock);
    }

    // Sort
    switch (sortOption) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        results.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      default: // featured
        results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(results);
  }, [
    products,
    selectedCategories,
    selectedBrands,
    priceRange,
    inStockOnly,
    sortOption,
  ]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 100000000]);
    setInStockOnly(false);
  };

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">
        Parcourez les équipements
      </h1>

      {/* Mobile filter toggle */}
      <div className="flex md:hidden justify-between items-center mb-6">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center space-x-2 border border-slate-300 rounded-md px-4 py-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtre</span>
        </button>

        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-slate-300 rounded-md px-4 py-2 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="price-asc">Prix​: du plus bas</option>
            <option value="price-desc">
              Prix​​: du plus élevé
            </option>
            <option value="newest">Le plus récent</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Filters - Sidebar */}
        <aside
          className={`md:w-64 flex-shrink-0 pb-6 md:pb-0 ${
            isFilterOpen ? "block" : "hidden"
          } md:block`}
        >
          <div className="sticky top-20 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Filtres</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-amber-600 hover:text-amber-500"
              >
                Tout effacer
              </button>
            </div>

            {/* Categories */}
            <div className="border-b border-slate-200 pb-6">
              <h3 className="font-medium mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-slate-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="border-b border-slate-200 pb-6">
              <h3 className="font-medium mb-4">Gamme de prix</h3>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) =>
                      handlePriceChange(Number(e.target.value), priceRange[1])
                    }
                    className="w-full rounded border-slate-300 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <span className="text-slate-500">à</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    max="100000000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      handlePriceChange(priceRange[0], Number(e.target.value))
                    }
                    className="w-full rounded border-slate-300 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    handlePriceChange(priceRange[0], Number(e.target.value))
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Brands */}
            <div className="border-b border-slate-200 pb-6">
              <h3 className="font-medium mb-4">Marques</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-slate-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="font-medium mb-4">Disponibilité</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={() => setInStockOnly(!inStockOnly)}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="ml-2 text-slate-700">En stock seulement</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort - Desktop */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <p className="text-slate-600">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "produit" : "produits"}
            </p>

            <div className="flex items-center space-x-2">
              <span className="text-slate-600">Trier par:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-slate-300 rounded-md px-4 py-2 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="price-asc">Prix​: du plus bas</option>
                  <option value="price-desc">Prix​​: du plus élevé</option>
                  <option value="newest">Le plus récent</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-600 mb-4">
                Aucun produit ne correspond à vos filtres.
              </p>
              <button onClick={clearFilters} className="btn-primary">
                Effacer les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
