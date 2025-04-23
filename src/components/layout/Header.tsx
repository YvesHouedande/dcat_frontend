import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User, Headphones } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../ui/SearchBar";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Headphones className="h-8 w-8 text-amber-500" />
            <span className="text-2xl font-serif font-bold">DCAT Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-slate-800 hover:text-amber-500 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className="text-slate-800 hover:text-amber-500 transition-colors"
            >
              Boutique
            </Link>
            <Link
              to="/catalog?category=microphones"
              className="text-slate-800 hover:text-amber-500 transition-colors"
            >
              Audiovisuels
            </Link>
            <Link
              to="/catalog?category=headphones"
              className="text-slate-800 hover:text-amber-500 transition-colors"
            >
              Informatiques
            </Link>
            <Link
              to="/catalog?category=interfaces"
              className="text-slate-800 hover:text-amber-500 transition-colors"
            >
              Tic & Domotiques
            </Link>
            <Link
              to="/catalog?category=interfaces"
              className="text-slate-800 hover:text-amber-500 transition-colors"
            >
              Solaires
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>

            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-amber-500 text-white text-xs rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-b-lg p-4 animate-fade-in">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <nav className="flex flex-col py-4">
            <Link to="/" className="px-6 py-3 text-slate-800 hover:bg-slate-50">
              Home
            </Link>
            <Link
              to="/catalog"
              className="px-6 py-3 text-slate-800 hover:bg-slate-50"
            >
              Shop
            </Link>
            <Link
              to="/catalog?category=microphones"
              className="px-6 py-3 text-slate-800 hover:bg-slate-50"
            >
              Microphones
            </Link>
            <Link
              to="/catalog?category=headphones"
              className="px-6 py-3 text-slate-800 hover:bg-slate-50"
            >
              Headphones
            </Link>
            <Link
              to="/catalog?category=interfaces"
              className="px-6 py-3 text-slate-800 hover:bg-slate-50"
            >
              Interfaces
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
