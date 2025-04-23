import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Headphones,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Headphones className="h-8 w-8 text-amber-500" />
              <span className="text-2xl font-serif font-bold">DACT SHOP</span>
            </div>
            <p className="text-slate-300 mb-6">
              Équipement audiovisuel haut de gamme pour les professionnels et
              les passionnés.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-300 hover:text-amber-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-amber-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-amber-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-amber-500 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-6">Liens rapides</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Boutique
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-medium mb-6">Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/catalog?category=microphones"
                  className="text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Audiovisuels
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=headphones"
                  className="text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Informatiques
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=interfaces"
                  className="text-slate-300 hover:text-amber-500 transition-colors"
                >
                  TIC & Domotique
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=mixers"
                  className="text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Solaires
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=cameras"
                  className="text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Autres
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-medium mb-6">Contactez-nous</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-500 mt-0.5" />
                <span className="text-slate-300">
                  27 BP 826 Abidjan 27 Angré Château immeuble BATIM II 1er étage
                  porte A108, Abidjan
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-500" />
                <span className="text-slate-300">+225 27 21 37 33 63</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-500" />
                <span className="text-slate-300">infos@dcat.ci</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-slate-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            © 2025 DCAT. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-slate-400 text-sm hover:text-amber-500 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-slate-400 text-sm hover:text-amber-500 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/shipping"
              className="text-slate-400 text-sm hover:text-amber-500 transition-colors"
            >
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
