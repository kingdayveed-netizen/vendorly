"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { exploreService } from "@/app/services/explore.service";
import { ExploreHeader } from "@/components/explore/ExploreHeader";
import { PaginationControls } from "@/components/explore/PaginationControls";
import { ChevronLeft, Store, Star, MapPin, Shield, Loader2 } from "lucide-react";

const LIMIT = 20;
// getTopVendors has no page param — backend only supports "give me top N",
// so fetch a generous list once and paginate client-side rather than
// re-requesting the same data on every page click.
const FETCH_CAP = 100;

export default function VendorsPage() {
  const router = useRouter();
  const [allVendors, setAllVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await exploreService.getTopVendors(FETCH_CAP, "revenue");
        const items = (res as any)?.vendors || [];
        setAllVendors(items);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const total = allVendors.length;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const start = (currentPage - 1) * LIMIT;
  const vendors = allVendors.slice(start, start + LIMIT);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <ExploreHeader
        wishlistCount={wishlist.length}
        cartCount={0}
        onSearch={() => {}}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push("/explore")}
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors mb-6 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Explore</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Store className="h-5 w-5 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Top Vendors
          </h1>
        </div>
        <p className="text-gray-500 mb-8 ml-1">
          {isLoading ? "Loading…" : `${total} verified vendors on Vendorly`}
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Store className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-gray-700 font-semibold mb-1">No vendors yet</h3>
            <p className="text-gray-400 text-sm">Check back soon</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {vendors.map((vendor: any) => (
              
              <a  key={vendor.id || vendor.storeSlug}
                href={`/${vendor.storeSlug}`}
                target="_blank"
                rel="noreferrer"
                className="block group"
              >
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-4 text-center relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                      <Shield className="h-3.5 w-3.5 text-green-500" />
                    </div>
                  </div>

                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3 overflow-hidden border-2 border-green-100 group-hover:border-green-300 transition-colors">
                    {vendor.logo ? (
                      <img
                        src={vendor.logo}
                        alt={vendor.storeName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-green-500">
                        {vendor.storeName?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1 group-hover:text-green-600 transition-colors">
                    {vendor.storeName}
                  </h3>

                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-gray-700">
                      {vendor.averageRating || "New"}
                    </span>
                  </div>

                  {vendor.location && (
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-3">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{vendor.location}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-3 text-xs pt-2 border-t border-gray-50">
                    <div className="text-center">
                      <p className="font-semibold text-gray-800">{vendor.totalProducts || 0}</p>
                      <p className="text-gray-400">items</p>
                    </div>
                    <div className="w-px h-6 bg-gray-100" />
                    <div className="text-center">
                      <p className="font-semibold text-green-600">{vendor.totalOrders || 0}</p>
                      <p className="text-gray-400">sales</p>
                    </div>
                  </div>

                  <div className="mt-3 overflow-hidden max-h-0 group-hover:max-h-10 transition-all duration-200">
                    <div className="pt-2 border-t border-gray-50">
                      <span className="text-xs font-medium text-green-600">
                        Visit store →
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}