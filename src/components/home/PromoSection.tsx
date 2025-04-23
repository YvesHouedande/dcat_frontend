import React from "react";
import { Link } from "react-router-dom";
import { Headphones, Zap, ShieldCheck, RefreshCw } from "lucide-react";

const benefits = [
  {
    icon: <Zap className="h-6 w-6 text-amber-500" />,
    title: "Expédition rapide",
    description: "Commandes préparées et envoyées dans un délai très court",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-amber-500" />,
    title: "Produit authentique",
    description: "Qualité garantie, sans contrefaçon",
  },
  {
    icon: <RefreshCw className="h-6 w-6 text-amber-500" />,
    title: "Service d'installation",
    description: "Nous proposons l'installation professionnelle de vos produits, sur demande",
  },
];

const PromoSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        {/* Main Promo */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-6">
                <Headphones className="h-8 w-8 text-amber-500" />
                <span className="text-2xl font-serif font-bold text-white">
                  DCAT Shop+
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Rejoignez notre programme d'adhésion
              </h2>
              <p className="text-slate-300 mb-8 text-lg">
                Bénéficiez d'avantages exclusifs, d'un accès anticipé aux
                nouveaux produits et de réductions réservées aux membres sur
                votre équipement audio préféré.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="text-white">
                    10 % de réduction sur tous les articles à prix régulier
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="text-white">Livraison accélérée </p>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/register" className="btn-secondary px-8 py-3">
                  Inscrivez-vous maintenant
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img
                src="https://lh3.googleusercontent.com/p/AF1QipP8NDMa0_7nujFXRy-ROLfrLiYwL_hDeYMBHHL6=s1360-w1360-h1020"
                alt="DCAT Shop Membership"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl p-6 flex flex-col items-center text-center"
            >
              <div className="p-3 bg-white rounded-lg shadow-sm mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">
                {benefit.title}
              </h3>
              <p className="text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
