import { useCallback, useEffect } from "react";
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
      dispatch(optimisticToggle(productId));
      try {
        await dispatch(addFavorite(productId)).unwrap();
      } catch (error) {
        dispatch(revertOptimisticToggle(productId));
        throw error;
      }
    },
    [dispatch],
  );

  // Remove from favorites (with optimistic update)
  const removeFromFavorites = useCallback(
    async (productId: string) => {
      dispatch(optimisticToggle(productId));
      try {
        await dispatch(removeFavorite(productId)).unwrap();
      } catch (error) {
        dispatch(revertOptimisticToggle(productId));
        throw error;
      }
    },
    [dispatch],
  );

  // Toggle favorite
  const toggle = useCallback(
    async (productId: string) => {
      dispatch(optimisticToggle(productId));
      try {
        await dispatch(toggleFavorite(productId)).unwrap();
      } catch (error) {
        dispatch(revertOptimisticToggle(productId));
        throw error;
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
