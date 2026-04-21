import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  batchCheckFavorites,
  optimisticToggle,
  revertOptimisticToggle,
  clearFavorites,
} from "@/redux/slices/favoriteSlice";

export const useFavorites = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, favoritesMap, isLoading, hasMore, nextCursor, error } =
    useSelector((state: RootState) => state.favorites);

  // Track pending toggles per product to prevent duplicate requests
  const pendingTogglesRef = useRef<Map<string, Promise<any>>>(new Map());

  // Load favorites
  const loadFavorites = useCallback(
    (cursor?: string) => {
      return dispatch(fetchFavorites({ cursor, limit: 20 })).unwrap();
    },
    [dispatch],
  );

  // Load more (infinite scroll)
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading && nextCursor) {
      return loadFavorites(nextCursor);
    }
    return Promise.resolve();
  }, [hasMore, isLoading, nextCursor, loadFavorites]);

  // Check if product is favorited
  const isFavorited = useCallback(
    (productId: string) => {
      return favoritesMap[productId] || false;
    },
    [favoritesMap],
  );

  // Add to favorites (with optimistic update)
  const addToFavorites = useCallback(
    async (productId: string) => {
      // Check if already pending
      if (pendingTogglesRef.current.has(productId)) {
        console.log(`Already adding product ${productId}, reusing promise`);
        return pendingTogglesRef.current.get(productId);
      }

      dispatch(optimisticToggle(productId));

      const promise = dispatch(addFavorite(productId)).unwrap();
      pendingTogglesRef.current.set(productId, promise);

      try {
        const result = await promise;
        return result;
      } catch (error) {
        dispatch(revertOptimisticToggle(productId));
        throw error;
      } finally {
        pendingTogglesRef.current.delete(productId);
      }
    },
    [dispatch],
  );

  // Remove from favorites (with optimistic update)
  const removeFromFavorites = useCallback(
    async (productId: string) => {
      // Check if already pending
      if (pendingTogglesRef.current.has(productId)) {
        console.log(`Already removing product ${productId}, reusing promise`);
        return pendingTogglesRef.current.get(productId);
      }

      dispatch(optimisticToggle(productId));

      const promise = dispatch(removeFavorite(productId)).unwrap();
      pendingTogglesRef.current.set(productId, promise);

      try {
        const result = await promise;
        return result;
      } catch (error) {
        dispatch(revertOptimisticToggle(productId));
        throw error;
      } finally {
        pendingTogglesRef.current.delete(productId);
      }
    },
    [dispatch],
  );

  // Toggle favorite
  const toggle = useCallback(
    async (productId: string) => {
      // If there's already a pending toggle for this product, return that promise
      if (pendingTogglesRef.current.has(productId)) {
        console.log(`Already toggling product ${productId}, reusing promise`);
        return pendingTogglesRef.current.get(productId);
      }

      // Optimistically update UI
      dispatch(optimisticToggle(productId));

      // Create the API call promise
      const promise = dispatch(toggleFavorite(productId)).unwrap();
      pendingTogglesRef.current.set(productId, promise);

      try {
        const result = await promise;
        return result;
      } catch (error) {
        // Revert on error
        dispatch(revertOptimisticToggle(productId));
        throw error;
      } finally {
        // Clean up
        pendingTogglesRef.current.delete(productId);
      }
    },
    [dispatch],
  );

  // Batch check favorites for multiple products
  const checkBatch = useCallback(
    async (productIds: string[]) => {
      if (productIds.length === 0) return;
      await dispatch(batchCheckFavorites(productIds)).unwrap();
    },
    [dispatch],
  );

  // Clear favorites (on logout)
  const clear = useCallback(() => {
    dispatch(clearFavorites());
  }, [dispatch]);

  // Auto-load on mount
  useEffect(() => {
    if (items.length === 0 && !isLoading) {
      loadFavorites();
    }
  }, []);

  return {
    favorites: items,
    isFavorited,
    isFavoritedMap: favoritesMap,
    isLoading,
    hasMore,
    nextCursor,
    error,
    loadFavorites,
    loadMore,
    addToFavorites,
    removeFromFavorites,
    toggle,
    checkBatch,
    clear,
  };
};