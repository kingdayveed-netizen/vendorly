import axiosInstance from "@/lib/axios";
import { StoreData, StoreProduct } from "@/redux/slices/storeSlice";

export const storeService = {
  getStoreBySlug: async (storeSlug: string): Promise<StoreData> => {
    const response = await axiosInstance.get<StoreData>(`/store/${storeSlug}`);
    return response.data;
  },

  getProductById: async (productId: string): Promise<StoreProduct> => { 
    const response = await axiosInstance.get(`/store/product/${productId}`);
    return response.data;
  },
};