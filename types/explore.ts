export interface Product {
  createdAt: string | number | Date;
  id: string;
  name: string;
  description: string;
  price: number;
  images: {
    url: string
  }[];
  category: string;
  tags: string[];
  quantity: number;
  discountPrice?: number;
  performanceScore?: number;
  originalPrice?: number;
  rating?: number;
  // Aggregated stats
  ordersCount?: number;
  products?: string[];
  analytics?: {
    views: number;
    ordersCount: number;
  }

  vendor: {
    id: string;
    storeName: string;
    storeSlug: string;
    user: {
      fullName: string;
      phone: string;
    };
  };
}

export interface TopVendor {
  id: string;
  storeName: string;
  storeSlug: string;
  logo?: string;
  location?: string;
  joinDate: string;

  // Stats
  totalProducts: number;
  totalOrders: number;
  totalItemsSold: number;
  totalRevenue: number;
  averageRating?: number;

  // Verification
  isVerified: boolean;

  // Badges
  isTopRated?: boolean;
  isBestSeller?: boolean;

  // Additional
  ownerName?: string;
  trendingScore?: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: any;
}

export interface Category {
  name: string;
  count: number;
}

export interface ExploreFilters {
  category?: string;
  search?: string;
  page: number;
  limit: number;
}

export interface ExploreState {
  // Data
  products: Product[];
  selectedProduct: Product | null;
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  trendingToday: Product[];
  trendingWeek: Product[];
  topVendors: TopVendor[];

  topVendorsLoading: boolean; 
  topVendorsError: string | null;

  // UI States
  isLoadingProducts: boolean;
  isLoadingCategories: boolean;
  isLoadingProduct: boolean;
  isLoadingTrending: boolean;
  error: string | null;

  // Filters
  filters: ExploreFilters;
}
