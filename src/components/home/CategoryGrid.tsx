import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "audiovisuel",
    name: "Audiovisuels",
    image:
      "https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=1600",
    description: "Matériel audio et vidéo pour professionnels",
  },
  {
    id: "informatique",
    name: "Informatiques",
    image:
      "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1600",
    description: "Matériel informatique pour professionnels",
  },
  {
    id: "tic et domotique",
    name: "TIC & Domotique",
    image:
      "https://images.pexels.com/photos/29091470/pexels-photo-29091470/free-photo-of-collection-d-appareils-pour-maison-intelligente-sur-fond-blanc.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Matériel domotique pour professionnels",
  },
  {
    id: "solaire",
    name: "Solaires",
    image:
      "https://www.id-solaire.fr/wp-content/uploads/2020/07/industriels-1-1024x639.jpg",
    description: "Le solaire, une énergie propre pour un futur durable",
  },
  {
    id: "autres",
    name: "Autres",
    image:
      "https://images.pexels.com/photos/1420709/pexels-photo-1420709.jpeg?auto=compress&cs=tinysrgb&w=1600",
    description: "modules complémentaires essentiels pour votre configuration",
  },
];

const CategoryGrid: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">
          Parcourir Par Catégorie
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/catalog?category=${category.id}`}
              className="group"
            >
              <div className="card overflow-hidden h-80">
                <div className="relative h-full">
                  {/* Image with overlay */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-slate-200 mb-4">
                      {category.description}
                    </p>
                    <span className="inline-flex items-center text-amber-400 font-medium group-hover:text-amber-300 transition-colors">
                      Parcourir les produits
                      <svg
                        className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 6L15 12L9 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
