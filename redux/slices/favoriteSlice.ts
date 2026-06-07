import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import {
  Favorite,
  FavoritesResponse,
  FavoriteCheckResponse,
} from "@/types/favorite";

interface FavoriteState {
  items: Favorite[];
  favoritesMap: Record<string, boolean>; // productId -> isFavorited
  isLoading: boolean;
  hasMore: boolean;
  nextCursor: string | null;
  error: string | null;
}

const initialState: FavoriteState = {
  items: [],
  favoritesMap: {},
  isLoading: false,
  hasMore: true,
  nextCursor: null,
  error: null,
};

// Async thunks
export const fetchFavorites = createAsyncThunk(
  "favorites/fetch",
  async ({ cursor, limit }: { cursor?: string; limit?: number }) => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit.toString());
    const response = await axiosInstance.get<FavoritesResponse>(
      `/favorites?${params}`,
    );
    return response.data;
  },
);

export const addFavorite = createAsyncThunk(
  "favorites/add",
  async (productId: string) => {
    await axiosInstance.post(`/favorites/${productId}`);
    return productId;
  },
);

export const removeFavorite = createAsyncThunk(
  "favorites/remove",
  async (productId: string) => {
    await axiosInstance.delete(`/favorites/${productId}`);
    return productId;
  },
);

export const toggleFavorite = createAsyncThunk(
  "favorites/toggle",
  async (productId: string) => {
    const response = await axiosInstance.post<{ isFavorited: boolean }>(
      `/favorites/${productId}/toggle`,
    );
    return { productId, isFavorited: response.data.isFavorited };
  },
);

export const batchCheckFavorites = createAsyncThunk(
  "favorites/batchCheck",
  async (productIds: string[]) => {
    const response = await axiosInstance.post<FavoriteCheckResponse[]>(
      "/favorites/batch/check",
      { productIds },
    );
    return response.data;
  },
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.favoritesMap = {};
      state.hasMore = true;
      state.nextCursor = null;
    },
    optimisticToggle: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.favoritesMap[productId] = !state.favoritesMap[productId];
    },
    revertOptimisticToggle: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.favoritesMap[productId] = !state.favoritesMap[productId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = [...state.items, ...action.payload.items];
        state.hasMore = action.payload.hasMore;
        state.nextCursor = action.payload.nextCursor || null;

        // Update favorites map
        action.payload.items.forEach((item) => {
          state.favoritesMap[item.productId] = true;
        });
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch favorites";
      })
      // Add favorite
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favoritesMap[action.payload] = true;
      })
      // Remove favorite
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favoritesMap[action.payload] = false;
        state.items = state.items.filter(
          (item) => item.productId !== action.payload,
        );
      })
      // Toggle favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.favoritesMap[action.payload.productId] =
          action.payload.isFavorited;
      })
      // Batch check favorites
      .addCase(batchCheckFavorites.fulfilled, (state, action) => {
        action.payload.forEach((result) => {
          state.favoritesMap[result.productId] = result.isFavorited;
        });
      });
  },
});

export const { clearFavorites, optimisticToggle, revertOptimisticToggle } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;
