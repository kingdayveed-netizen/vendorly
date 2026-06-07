export interface Favorite {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    vendor: {
      storeName: string;
      storeSlug: string;
    };
  };
  createdAt: string;
}

export interface FavoritesResponse {
  items: Favorite[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface FavoriteCheckResponse {
  productId: string;
  isFavorited: boolean;
  favoriteId?: string;
}
