"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  setStore,
  setLoading,
  setError,
  clearStore,
  setSelectedProduct,
  StoreData,
  StoreProduct,
} from "@/redux/slices/storeSlice";
import { useToast } from "@/components/ui/Toast";
import { storeService } from "@/app/services/store.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface UseStoreReturn {
  // State
  currentStore: StoreData | null;
  loading: boolean;
  error: string | null;
  selectedProduct: StoreProduct | null;

  // Store actions
  getStoreBySlug: (storeSlug: string) => Promise<StoreData | null>;
  clearCurrentStore: () => void;

  // Product actions
  selectProduct: (product: StoreProduct | null) => void;
  getProductById: (productId: string) => Promise<StoreProduct | null>;

  // Category and filter helpers
  getCategories: () => string[];
  filterByCategory: (category: string) => StoreProduct[];
  searchProducts: (query: string) => StoreProduct[];

  // WhatsApp integration
  createWhatsAppOrder: (product: StoreProduct, quantity?: number) => string;

  // Status
  isProductInStock: (productId: string) => boolean;
  getProductQuantity: (productId: string) => number;
}

export const useStore = (storeSlug?: string): UseStoreReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { currentStore, selectedProduct } = useSelector(
    (state: RootState) => state.store,
  );

  // Use proper React Query for automatic fetching when slug is provided
  const {
    data: storeData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["store", storeSlug],
    queryFn: () => {
      if (!storeSlug) throw new Error("Store slug not provided");
      return storeService.getStoreBySlug(storeSlug);
    },
    enabled: !!storeSlug, // Only run if storeSlug is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    retry: 1, // Only retry once on failure
  });

  // Update Redux when data changes
  useEffect(() => {
    if (storeData) {
      dispatch(setStore(storeData));
    }
  }, [storeData, dispatch]);

  // Handle errors
  useEffect(() => {
    if (queryError) {
      const errorMessage =
        (queryError as any)?.response?.data?.message ||
        (queryError as Error)?.message ||
        "Failed to load store";
      dispatch(setError(errorMessage));
      showToast(errorMessage, "error");
    }
  }, [queryError, dispatch, showToast]);

  /**
   * Fetch store by slug - now uses the existing query or refetches
   */
  const getStoreBySlug = async (slug: string): Promise<StoreData | null> => {
    // If we already have this store in cache, return it
    const cachedData = queryClient.getQueryData<StoreData>(["store", slug]);
    if (cachedData) {
      dispatch(setStore(cachedData));
      return cachedData;
    }

    dispatch(setLoading(true));

    try {
      // Use refetch if this is the current storeSlug, otherwise use fetchQuery
      let data: StoreData;

      if (slug === storeSlug) {
        const result = await refetch();
        data = result.data!;
      } else {
        data = await queryClient.fetchQuery({
          queryKey: ["store", slug],
          queryFn: () => storeService.getStoreBySlug(slug),
          staleTime: 5 * 60 * 1000,
        });
      }

      dispatch(setStore(data));
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load store";

      dispatch(setError(errorMessage));
      showToast(errorMessage, "error");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Clear current store from state
   */
  const clearCurrentStore = () => {
    dispatch(clearStore());
    // Also clear the query cache for store
    queryClient.removeQueries({ queryKey: ["store"] });
  };

  /**
   * Select a product for modal/view
   */
  const selectProduct = (product: StoreProduct | null) => {
    dispatch(setSelectedProduct(product));
  };

  /**
   * Fetch single product by ID
   */
  const getProductById = async (
    productId: string,
  ): Promise<StoreProduct | null> => {
    try {
      // Check cache first
      const cachedData = queryClient.getQueryData<StoreProduct>([
        "product",
        productId,
      ]);
      if (cachedData) return cachedData;

      const data = await queryClient.fetchQuery({
        queryKey: ["product", productId],
        queryFn: () => storeService.getProductById(productId),
        staleTime: 5 * 60 * 1000,
      });

      return data;
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to load product",
        "error",
      );
      return null;
    }
  };

  /**
   * Get all unique categories from current store products
   */
  const getCategories = (): string[] => {
    if (!currentStore) return [];

    const categories = new Set(currentStore.products.map((p) => p.category));
    return Array.from(categories);
  };

  /**
   * Filter products by category
   */
  const filterByCategory = (category: string): StoreProduct[] => {
    if (!currentStore) return [];

    if (category === "all") return currentStore.products;

    return currentStore.products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  };

  /**
   * Search products by name or description
   */
  const searchProducts = (query: string): StoreProduct[] => {
    if (!currentStore || !query.trim()) return currentStore?.products || [];

    const searchTerm = query.toLowerCase().trim();

    return currentStore.products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    );
  };

  /**
   * Create WhatsApp message for ordering
   */
  const createWhatsAppOrder = (
    product: StoreProduct,
    quantity: number = 1,
  ): string => {
    const storeUrl = `${window.location.origin}/${currentStore?.storeSlug}`;

    const message =
      `Hello, I'm interested in ordering:%0A%0A` +
      `*Product:* ${product.name}%0A` +
      `*Price:* ₦${product.price.toLocaleString()}%0A` +
      `*Quantity:* ${quantity}%0A` +
      `*Store:* ${storeUrl}%0A%0A` +
      `My delivery location: [Please add your address]`;

    return `https://wa.me/?text=${message}`;
  };

  /**
   * Check if product is in stock
   */
  const isProductInStock = (productId: string): boolean => {
    if (!currentStore) return false;

    const product = currentStore.products.find((p) => p.id === productId);
    return product ? product.quantity > 0 : false;
  };

  /**
   * Get product quantity
   */
  const getProductQuantity = (productId: string): number => {
    if (!currentStore) return 0;

    const product = currentStore.products.find((p) => p.id === productId);
    return product?.quantity || 0;
  };

  return {
    // State - use React Query states for loading/error
    currentStore,
    loading: isLoading,
    error: queryError ? (queryError as Error).message : null,
    selectedProduct,

    // Store actions
    getStoreBySlug,
    clearCurrentStore,

    // Product actions
    selectProduct,
    getProductById,

    // Category and filter helpers
    getCategories,
    filterByCategory,
    searchProducts,

    // WhatsApp integration
    createWhatsAppOrder,

    // Status
    isProductInStock,
    getProductQuantity,
  };
};
