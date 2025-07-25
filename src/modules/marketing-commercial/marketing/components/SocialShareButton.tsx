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

interface ProductShareProps {
  product: {
    name: string;
    description?: string;
    url: string;
    image?: string;
  };
}

const SocialShareButton: React.FC<ProductShareProps> = ({ product }) => {
  const { name, description, url } = product;
  // Instagram n'a pas d'API de partage direct, on propose de copier le lien
  const handleInstagramShare = () => {
    navigator.clipboard.writeText(url);
    alert("Lien copié pour Instagram !");
  };
  return (
    <div className="flex flex-wrap gap-2 items-center justify-center">
      <FacebookShareButton url={url}  hashtag="#Produit">
        <FacebookIcon size={36} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={name}>
        <TwitterIcon size={36} round />
      </TwitterShareButton>
      <LinkedinShareButton
        url={url}
        title={name}
        summary={description}
        source={url}
      >
        <LinkedinIcon size={36} round />
      </LinkedinShareButton>
      <WhatsappShareButton url={url} title={name}>
        <WhatsappIcon size={36} round />
      </WhatsappShareButton>
      <button
        onClick={handleInstagramShare}
        title="Partager sur Instagram (copie le lien)"
        className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center text-white text-lg font-bold border-none outline-none hover:scale-110 transition-transform"
      >
        IG
      </button>
    </div>
  );
};

export default SocialShareButton;
