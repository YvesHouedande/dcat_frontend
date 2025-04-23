import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Professional audio equipment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/30" />
      </div>

      {/* Content */}
      <div className="container relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-xl animate-slide-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-4">
            Équipement Audio Professionnel Pour Toutes Les Radios
          </h1>
          <p className="text-xl text-slate-200 mb-8">
            Découvrez des équipements audiovisuels haut de gamme qui donnent vie
            à votre vision créative
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/catalog" className="btn-secondary px-8 py-3">
              Voir la collection
            </Link>
            <Link
              to="/catalog?category=new"
              className="btn text-white hover:text-amber-500 flex items-center transition-colors"
            >
              Découvrir les nouveautés
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
