"use client";

import { StoreData } from "@/redux/slices/storeSlice";
import { Share2, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { formatDistanceToNow } from "date-fns";

interface StoreHeaderProps {
  store: StoreData;
}

export default function StoreHeader({ store }: StoreHeaderProps) {
  const { showToast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Store link copied!", "success");
    } catch (err) {
      showToast("Failed to copy link", "error");
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {store.storeName}
            </h1>
            <p className="text-gray-600 mt-1">by {store.user.fullName}</p>

            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              {store.user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {store.user.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined{" "}
                {formatDistanceToNow(new Date(store.createdAt), {
                  addSuffix: true,
                })}
              </span>
              <span className="flex items-center gap-1">
                {store.products.length}{" "}
                {store.products.length === 1 ? "Product" : "Products"}
              </span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Share Store
          </button>
        </div>
      </div>
    </div>
  );
}
