"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import ProductGrid from "@/components/storefront/ProductGrid";
import ProductModal from "@/components/storefront/ProductModal";

import {
  Loader2,
  MessageCircle,
  Share2,
  ShoppingBag,
  Star,
  Shield,
  Truck,
  BadgeCheck,
  ChevronRight,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function StorePage() {
  const params = useParams();
  const storeSlug = params.storeSlug as string;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    currentStore,
    loading,
    error,
    selectedProduct,
    getStoreBySlug,
    selectProduct,
    createWhatsAppOrder,
  } = useStore();

  useEffect(() => {
    if (storeSlug) {
      getStoreBySlug(storeSlug);
    }
  }, [storeSlug, getStoreBySlug]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Store not found</h1>
          <p className="text-gray-400 text-sm leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !currentStore) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading store…</p>
        </div>
      </div>
    );
  }

  const getCategoryLabel = (cat: any): string => {
    if (!cat) return "";
    if (typeof cat === "string") return cat;
    if (Array.isArray(cat)) {
      const first = cat[0];
      if (!first) return "";
      return first.category?.name || first.name || "";
    }
    return cat.category?.name || cat.name || cat.title || "";
  };

  const categories: string[] = Array.from(
    new Set(
      (currentStore.products || [])
        .map((p: any) => getCategoryLabel(p.category))
        .filter(Boolean)
    )
  );

  const totalProducts = currentStore.products?.length || 0;

  const filteredProducts = activeCategory
    ? currentStore.products?.filter(
        (p: any) =>
          getCategoryLabel(p.category).toLowerCase() ===
          activeCategory.toLowerCase()
      )
    : currentStore.products;

  // ✅ Fixed — falls back to vendorPhone from first product if user.phone is missing
  const whatsappNumber = (
    currentStore.user?.phone ||
    currentStore.products?.[0]?.vendorPhone ||
    ""
  ).replace(/\D/g, "");

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── TOP NAV BAR ── */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-sm font-bold text-emerald-600 tracking-tight">
            Vendorly
          </a>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-all"
          >
            <Share2 className="h-3.5 w-3.5" />
            {copied ? "Copied!" : "Share store"}
          </button>
        </div>
      </header>

      {/* ── STORE HERO CARD ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-2">
        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">

          {/* Compact accent strip */}
          <div
            className="h-20 w-full"
            style={{
              background: currentStore.coverImage
                ? `url(${currentStore.coverImage}) center/cover`
                : "linear-gradient(135deg, #d1fae5 0%, #6ee7b7 60%, #34d399 100%)",
            }}
          >
            {currentStore.coverImage && (
              <div className="w-full h-full bg-black/20" />
            )}
          </div>

          {/* Card body */}
          <div className="px-5 pb-5">

            {/* Avatar + CTA row */}
            <div className="flex items-end justify-between -mt-7 mb-4">
              <div className="w-14 h-14 rounded-xl border-2 border-white shadow-lg overflow-hidden flex-shrink-0 bg-white">
                {currentStore.logo ? (
                  <img
                    src={currentStore.logo}
                    alt={currentStore.storeName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {currentStore.storeName?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {whatsappNumber && (
                
                 <a href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm"
                  style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chat vendor
                </a>
              )}
            </div>

            {/* Store name */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <h1 className="text-base font-bold text-gray-900 tracking-tight">
                {currentStore.storeName}
              </h1>
              <BadgeCheck
                className="text-emerald-500 flex-shrink-0"
                style={{ width: 17, height: 17 }}
              />
            </div>

            <p className="text-xs text-gray-400 mb-4">
              by {currentStore.user?.fullName}
            </p>

            {/* Stat pills + trust badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-600 font-medium">
                <ShoppingBag className="h-3.5 w-3.5 text-emerald-500" />
                {totalProducts} products
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-xs text-gray-700 font-medium">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                4.9 rating
              </span>
              {currentStore.user?.location && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-500">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {currentStore.user.location}
                </span>
              )}
              {currentStore.createdAt && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  Joined{" "}
                  {formatDistanceToNow(new Date(currentStore.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              )}

              <span className="hidden sm:block w-px h-4 bg-gray-200" />

              {[
                { icon: Shield, label: "Verified vendor" },
                { icon: Truck, label: "Fast delivery" },
                { icon: CheckCircle2, label: "WhatsApp orders" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1 px-2 py-1 rounded-full border"
                  style={{
                    background: "#f0fdf4",
                    borderColor: "#bbf7d0",
                    color: "#15803d",
                  }}
                >
                  <Icon
                    style={{ width: 11, height: 11, color: "#16a34a", flexShrink: 0 }}
                  />
                  <span className="text-[10px] font-medium whitespace-nowrap">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY CATEGORY FILTER ── */}
      <div className="sticky top-14 z-20 bg-[#F7F8FA]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={
                activeCategory === null
                  ? { background: "#111827", color: "#fff" }
                  : { background: "#fff", color: "#6b7280", border: "1px solid #e5e7eb" }
              }
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setActiveCategory(activeCategory === category ? null : category)
                }
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={
                  activeCategory === category
                    ? { background: "#111827", color: "#fff" }
                    : { background: "#fff", color: "#6b7280", border: "1px solid #e5e7eb" }
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {activeCategory ?? "All Products"}
          </p>
          <p className="text-xs text-gray-400">
            {filteredProducts?.length ?? 0}{" "}
            {filteredProducts?.length === 1 ? "item" : "items"}
          </p>
        </div>

        {filteredProducts?.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-7 w-7 text-gray-300" />
            </div>
            <h3 className="text-gray-700 font-semibold text-sm mb-1">
              No products here yet
            </h3>
            <p className="text-gray-400 text-xs">
              Check back soon or browse all categories.
            </p>
            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                className="mt-4 inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            onProductClick={selectProduct}
          />
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="text-center py-8 px-4">
        <p className="text-xs text-gray-300">
          Powered by{" "}
          <a href="/" className="text-emerald-500 font-semibold hover:underline">
            Vendorly
          </a>
        </p>
      </footer>

      {/* ── PRODUCT MODAL ── */}
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