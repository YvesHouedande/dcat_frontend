import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { productData } from "../../data/products";

const FeaturedProducts: React.FC = () => {
  const featuredProducts = productData
    .filter((product) => product.featured)
    .slice(0, 8);

  // Custom arrow components for the slider
  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-5 bg-white rounded-full shadow-md p-2 hover:bg-slate-50 focus:outline-none"
      >
        <ChevronLeft className="h-6 w-6 text-slate-800" />
      </button>
    );
  };

  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-5 bg-white rounded-full shadow-md p-2 hover:bg-slate-50 focus:outline-none"
      >
        <ChevronRight className="h-6 w-6 text-slate-800" />
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl font-serif font-bold">Produits en vedette</h2>
          <Link
            to="/catalog"
            className="mt-4 sm:mt-0 text-amber-600 hover:text-amber-700 transition-colors font-medium flex items-center"
          >
            Voir tous les produits
            <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>

        <div className="px-6">
          <Slider {...settings}>
            {featuredProducts.map((product) => (
              <div key={product.id} className="px-3 pb-6">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="card h-full">
                    <div className="relative pt-[100%]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-1">
                        <span className="text-sm text-slate-500">
                          {product.brand}
                        </span>
                        <span className="mx-2 text-slate-300">•</span>
                        <span className="text-sm text-slate-500">
                          {product.category}
                        </span>
                      </div>
                      <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-3"></div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-medium text-slate-900">
                            {product.price.toFixed(2)} FCFA
                          </span>
                        </div>
                        {product.inStock ? (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            En stock
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-amber-600 bg-red-50 px-2 py-1 rounded">
                            Bientôt disponible
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
