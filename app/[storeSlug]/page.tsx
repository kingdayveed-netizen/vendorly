"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import StoreHeader from "@/components/storefront/StoreHeader";
import ProductGrid from "@/components/storefront/ProductGrid";
import ProductModal from "@/components/storefront/ProductModal";
import { Loader2 } from "lucide-react";

export default function StorePage() {
  const params = useParams();
  const storeSlug = params.storeSlug as string;

  const {
    currentStore,
    loading,
    error,
    selectedProduct,
    getStoreBySlug,
    selectProduct,
    getCategories,
    createWhatsAppOrder,
  } = useStore();

  useEffect(() => {
    if (storeSlug) {
      getStoreBySlug(storeSlug);
    }
  }, [storeSlug, getStoreBySlug]);

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Store Not Found
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading || !currentStore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
      </div>
    );
  }

  const categories = getCategories();
  const flatCategories = categories.flat();


  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader store={currentStore} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium">
            All Products
          </button>

          {flatCategories.map((item: any) => (
            <button
              key={item.categoryId}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:border-green-500 hover:text-green-600 transition-colors"
            >
              {item.category?.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={currentStore.products}
          onProductClick={selectProduct}
        />
      </main>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          storeSlug={storeSlug}
          onClose={() => selectProduct(null)}
          onWhatsAppOrder={() => {
            const url = createWhatsAppOrder(selectedProduct);
            window.open(url, "_blank");
          }}
        />
      )}
    </div>
  );
}
