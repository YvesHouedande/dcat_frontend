import { useQuery } from "@tanstack/react-query";
import { categorieTypes, familleTypes, marqueTypes, modeleTypes } from "../../types/reference";
import { productBrands, productCategories, productFamilies, productModels } from "../services/othertype.service";
export const useOthers = () => {

  const fetchProductBrands = useQuery<marqueTypes[], Error>({
    queryKey: ["productBrands"], 
    queryFn: () => productBrands.getAll(),
    staleTime: 15 * 60 * 1000, // 5 minutes (optional)
  });
  const fetchProductCategories = useQuery<categorieTypes[], Error>({
    queryKey: ["productCategories"], 
    queryFn: () => productCategories.getAll(),
    staleTime: 15 * 60 * 1000, // 5 minutes (optional)
  });
  const fetchProductFamilies = useQuery<familleTypes[], Error>({
    queryKey: ["productFamilies"], 
    queryFn: () => productFamilies.getAll(),
    staleTime: 15 * 60 * 1000, // 5 minutes (optional)
  });
  const fetchProductModels  = useQuery<modeleTypes[], Error>({
    queryKey: ["productModels"], 
    queryFn: () => productModels.getAll(),
    staleTime: 15 * 60 * 1000, // 5 minutes (optional)
  });


  return {
    productBrands: fetchProductBrands.data || [],
    productCategories:fetchProductCategories.data  || [],
    productFamilies: fetchProductFamilies.data || [],
    productModels: fetchProductModels.data || [],
    isLoading: fetchProductBrands.isLoading && fetchProductCategories.isLoading && fetchProductFamilies.isLoading && fetchProductModels.isLoading
  }
};

