import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import { toast } from "sonner";

interface ProductShareProps {
  product?: {
    name: string;
    description?: string;
    url: string;
    image?: string;
  };
  // Nouvelles props pour les promotions
  productName?: string;
  originalPrice?: number;
  promotionalPrice?: number;
  discount?: number;
}

export const SocialShareButton: React.FC<ProductShareProps> = ({ 
  product, 
  productName, 
  originalPrice, 
  promotionalPrice, 
  discount 
}) => {
  // Support des deux formats (ancien et nouveau)
  const name = product?.name || productName || "";
  const description = product?.description || "";
  const url = product?.url || window.location.href;

  // Créer un message pour les promotions
  const createPromotionMessage = () => {
    if (promotionalPrice && originalPrice && discount) {
      return `🎉 PROMOTION ! ${name}\n💰 Prix: ${promotionalPrice.toLocaleString()}€ (au lieu de ${originalPrice.toLocaleString()}€)\n🔥 Économisez ${discount.toFixed(1)}% !`;
    }
    return `Découvrez ${name} - ${description}`;
  };

  const shareMessage = createPromotionMessage();

  // Instagram n'a pas d'API de partage direct, on propose de copier le lien
  const handleInstagramShare = () => {
    const textToCopy = `${shareMessage}\n${url}`;
    navigator.clipboard.writeText(textToCopy);
    toast.success("Message copié pour Instagram !");
  };

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center">
      <FacebookShareButton 
        url={url} 
        hashtag={promotionalPrice ? "#Promotion" : "#Produit"}
        quote={shareMessage}
      >
        <FacebookIcon size={36} round />
      </FacebookShareButton>
      
      <TwitterShareButton 
        url={url} 
        title={shareMessage}
        hashtags={promotionalPrice ? ["promotion", "bonplan"] : ["produit"]}
      >
        <TwitterIcon size={36} round />
      </TwitterShareButton>
      
      <LinkedinShareButton
        url={url}
        title={name}
        summary={shareMessage}
        source="Notre Boutique"
      >
        <LinkedinIcon size={36} round />
      </LinkedinShareButton>
      
      <WhatsappShareButton 
        url={url} 
        title={shareMessage}
      >
        <WhatsappIcon size={36} round />
      </WhatsappShareButton>
      
      <button
        onClick={handleInstagramShare}
        title="Partager sur Instagram (copie le message)"
        className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center text-white text-lg font-bold border-none outline-none hover:scale-110 transition-transform"
      >
        IG
      </button>
    </div>
  );
};

export default SocialShareButton;
