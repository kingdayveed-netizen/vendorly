"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { exploreService } from "@/app/services/explore.service";
import { ExploreHeader } from "@/components/explore/ExploreHeader";
import { ProductCard } from "@/components/explore/ProductCard";
import { PaginationControls } from "@/components/explore/PaginationControls";
import { ProductQuickViewModal } from "@/components/explore/ProduckQuickViewModal";
import { ChevronLeft, Flame, Loader2 } from "lucide-react";

const formatPrice = (price: number) => `₦${price.toLocaleString()}`;
const LIMIT = 20;

export default function TrendingTodayPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

 const fetchData = async (page: number) => {
  setIsLoading(true);
  try {
    const res = await exploreService.getTrendingToday(LIMIT * page);
    const allItems = res?.products || [];  // ← fixed: was res?.data || res || []
    const start = (page - 1) * LIMIT;
    const end = start + LIMIT;
    setProducts(allItems.slice(start, end));
    setTotal(allItems.length);
    setTotalPages(Math.ceil(allItems.length / LIMIT));
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchData(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <ExploreHeader
        wishlistCount={wishlist.length}
        cartCount={0}
        onSearch={() => {}}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/explore")}
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors mb-6 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Explore</span>
        </button>

        {/* Page header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <Flame className="h-5 w-5 text-red-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Trending Today
          </h1>
        </div>
        <p className="text-gray-500 mb-8 ml-1">
          {isLoading ? "Loading…" : `${total} hottest products right now`}
        </p>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            No products available right now.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={toggleWishlist}
                formatPrice={formatPrice}
                onQuickView={(id) => {
                  setSelectedProductId(id);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <ProductQuickViewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProductId(null);
        }}
        product={null}
        isLoading={false}
        isWishlisted={false}
        onToggleWishlist={toggleWishlist}
        formatPrice={formatPrice}
      />
    </div>
  );
}