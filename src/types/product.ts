export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  discount: number;
  image: string;
  imageLarge?: string;
  additionalImages?: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: {
    name: string;
    value: string;
  }[];
  dateAdded: string;
}