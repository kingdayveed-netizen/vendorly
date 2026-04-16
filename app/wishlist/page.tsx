"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorite";
import { FavoriteButton } from "@/components/explore/FavoriteButton";

export default function WishlistPage() {
  const { favorites, isLoading, hasMore, loadMore, removeFromFavorites } =
    useFavorites();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll setup
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore],
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    if (lastItemRef.current) {
      observerRef.current.observe(lastItemRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [handleObserver, favorites.length]);

  if (isLoading && favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-1" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 mb-6">Save your favorite products here</p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">
            {favorites.length} item{favorites.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {favorites.map((favorite, index) => (
          <div
            key={favorite.id}
            ref={index === favorites.length - 1 ? lastItemRef : null}
            className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Product Image */}
            <Link href={`/product/${favorite.product.id}`}>
              <div className="aspect-square bg-gray-100 relative">
                {favorite.product.images?.[0] ? (
                  <Image
                    src={favorite.product.images[0]}
                    alt={favorite.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>
            </Link>

            {/* Favorite button overlay */}
            <div className="absolute top-2 right-2">
              <FavoriteButton productId={favorite.product.id} size="sm" />
            </div>

            {/* Product Info */}
            <div className="p-3">
              <Link href={`/product/${favorite.product.id}`}>
                <h3 className="font-medium text-sm text-gray-900 line-clamp-2 hover:text-green-600 transition-colors">
                  {favorite.product.name}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {favorite.product.vendor?.storeName}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-green-600 text-sm">
                  ₦{favorite.product.price.toLocaleString()}
                </span>
                <button
                  onClick={() => removeFromFavorites(favorite.product.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLoading && favorites.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
        </div>
      )}
    </div>
  );
}
