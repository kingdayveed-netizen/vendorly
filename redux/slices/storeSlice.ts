import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StoreProduct {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
  category: string;
  tags: string[];
  quantity: number;
  vendorPhone: string;
}

export interface StoreData {
  id: string;
  storeName: string;
  storeSlug: string;
  coverImage?: string | null;
  logo?: string | null;
  user: {
    fullName: string;
    location?: string | null;
    phone?: string | null;
  };
  products: StoreProduct[];
  createdAt: string;
}

interface StoreState {
  currentStore: StoreData | null;
  loading: boolean;
  error: string | null;
  selectedProduct: StoreProduct | null;
}

const initialState: StoreState = {
  currentStore: null,
  loading: false,
  error: null,
  selectedProduct: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setStore: (state, action: PayloadAction<StoreData>) => {
      state.currentStore = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearStore: (state) => {
      state.currentStore = null;
      state.error = null;
      state.selectedProduct = null;
    },
    setSelectedProduct: (state, action: PayloadAction<StoreProduct | null>) => {
      state.selectedProduct = action.payload;
    },
    updateProductQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      if (state.currentStore) {
        const product = state.currentStore.products.find(
          (p) => p.id === action.payload.productId,
        );
        if (product) {
          product.quantity = action.payload.quantity;
        }
      }
    },
  },
});

export const {
  setStore,
  setLoading,
  setError,
  clearStore,
  setSelectedProduct,
  updateProductQuantity,
} = storeSlice.actions;
export default storeSlice.reducer;