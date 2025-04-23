import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productData } from '../../data/products';

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof productData>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const filteredResults = productData.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query.trim())}`);
      if (onClose) onClose();
    }
  };

  const handleResultClick = (id: string) => {
    navigate(`/product/${id}`);
    if (onClose) onClose();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="w-full px-4 py-3 pl-10 pr-12 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-slate-100"
          >
            <X className="h-4 w-4 text-slate-400" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-amber-500 text-white p-1 rounded-full hover:bg-amber-600"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>

      {results.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-slate-200 max-h-96 overflow-y-auto">
          <ul>
            {results.map((product) => (
              <li key={product.id} className="border-b border-slate-100 last:border-none">
                <button
                  onClick={() => handleResultClick(product.id)}
                  className="flex items-center p-3 w-full text-left hover:bg-slate-50 transition-colors"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-12 h-12 object-cover rounded mr-4" 
                  />
                  <div>
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.category} • {product.brand}</p>
                  </div>
                  <p className="ml-auto font-medium text-amber-600">${product.price.toFixed(2)}</p>
                </button>
              </li>
            ))}
          </ul>
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <button
              onClick={handleSearch}
              className="w-full text-center text-slate-600 hover:text-amber-600 transition-colors"
            >
              See all results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;