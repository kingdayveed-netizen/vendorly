import axiosInstance from "@/lib/axios";
import { ProductsResponse, Category } from "@/types/explore";

export const exploreService = {
  // Get top products with filters
  getTopProducts: async (
    page: number = 1,
    limit: number = 20,
    category?: string,
  ): Promise<ProductsResponse> => {
    const params: any = { page, limit };
    if (category) params.category = category;

    const response = await axiosInstance.get("/explore/products", { params });
    return response.data;
  },
  
  getTrendingToday: async (limit?: number, category?: string): Promise<any> => {
    const params: any = {};
    if (limit) params.limit = limit;
    if (category) params.category = category;
    
    const response = await axiosInstance.get("/explore/trending/today", {
      params,
    });
    return response.data;
  },

  getTrendingThisWeek: async (
    limit?: number,
    category?: string,
  ): Promise<any> => {
    const params: any = {};
    if (limit) params.limit = limit;
    if (category) params.category = category;

    const response = await axiosInstance.get("/explore/trending/week", {
      params,
    });
    return response.data;
  },

  getAllTrending: async (limit?: number): Promise<any> => {
    const params: any = {};
    if (limit) params.limit = limit;

    const response = await axiosInstance.get("/explore/trending/all", {
      params,
    });
    return response.data;
  },

  // Get top vendors
  getTopVendors: async (
    limit?: number,
    sortBy?: "revenue" | "orders" | "products" | "trending",
  ): Promise<any> => {
    const params: any = {};
    if (limit) params.limit = limit;
    if (sortBy) params.sortBy = sortBy;

    const response = await axiosInstance.get("/explore/top-vendors", { params });
    return response.data;
  },

  // Get single product details
  getProductById: async (id: string): Promise<any> => {
    const response = await axiosInstance.get(`/explore/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (
    category: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ProductsResponse> => {
    const response = await axiosInstance.get(
      `/explore/categories/${category}`,
      {
        params: { page, limit },
      },
    );
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/explore/categories");
    return response.data;
  },

  // Search products
  searchProducts: async (
    query: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ProductsResponse> => {
    const response = await axiosInstance.get("/explore/search", {
      params: { q: query, page, limit },
    });
    return response.data;
  },
};
