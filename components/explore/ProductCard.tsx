"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import { Eye, Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types/explore";
import { useOrder } from "@/hooks/useOrder";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import { FavoriteButton } from "./FavoriteButton";

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onQuickView: (id: string) => void;
  formatPrice: (price: number) => string;
}

export const ProductCard = ({
  product,
  isWishlisted,
  onToggleWishlist,
  formatPrice,
  onQuickView,
}: ProductCardProps) => {
  const { createOrder, isCreating } = useOrder();
  const { user } = useSelector((state: RootState) => state.auth);
  const productImage = product.images?.[0]?.url || "📦";

  const isHotDeal = product.tags?.some((tag) =>
    ["Hot Deal", "Hot", "Bestseller", "Trending"].includes(tag),
  );

  const isLowStock = product.quantity > 0 && product.quantity < 5;
  const isOutOfStock = product.quantity === 0;

  const discountPercentage = product.discountPrice
    ? Math.round((1 - product.price / product.discountPrice) * 100)
    : null;

  const handleWhatsAppOrder = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!product.vendor.user.phone) return;

    const formatToInternational = (phone: string) => {
      let cleaned = phone.replace(/[^\d]/g, "");

      // If number starts with 0, replace with 234
      if (cleaned.startsWith("0")) {
        cleaned = "234" + cleaned.slice(1);
      }

      return cleaned;
    };

    try {
      await createOrder({
        productId: product.id,
        vendorId: product.vendor.id,
        customerName: user?.fullName!,
        customerPhone: user?.phone!,
        customerId: user?.id!,
        productName: product.name,
      });

      const phoneNumber = formatToInternational(product.vendor.user.phone);

      const message = `Hello, I'm interested in ordering: Product: ${product.name} Price: ₦${product.price.toLocaleString()}. Please let me know how to proceed with the order.`;

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error: any) {
      toast.error(error.response?.data?.message, {
        position: "top-center",
      });
      console.error("Failed to create order:", error);
    }
  };

  return (
    <Card className="group/card relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-[#e5e7eb] bg-white rounded-lg">
      {/* Image Container - Reduced height */}
      <div className="relative aspect-square bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6] overflow-hidden">
        {productImage.startsWith("http") ? (
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-50">
            {productImage}
          </div>
        )}

        {/* Badges - Smaller */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
          {isHotDeal && (
            <Badge className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white text-[9px] border-0 px-1.5 py-0 font-medium shadow-sm">
              🔥 Hot
            </Badge>
          )}
          {isLowStock && !isHotDeal && (
            <Badge className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white text-[9px] border-0 px-1.5 py-0 font-medium shadow-sm">
              ⚡ Low
            </Badge>
          )}
          {isOutOfStock && (
            <Badge className="bg-[#6b7280] text-white text-[9px] border-0 px-1.5 py-0 font-medium shadow-sm">
              Sold
            </Badge>
          )}
        </div>
        {/* Wishlist Button - Smaller */}
        {/* Favorite Button - Always visible with high z-index */}
        <div className="absolute top-2 right-2 z-20">
          {/* <FavoriteButton productId={product.id} size="sm" isWishlisted={isWishlisted}/> */}
        </div>

        {/* Stats Badge - Smaller */}
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5">
          <Eye className="h-2 w-2 text-white" />
          <span className="text-[8px] font-medium text-white">
            {Math.floor(product?.analytics?.views!) || 0}
          </span>
        </div>

        {/* Quick View Overlay - Always visible on mobile/tablet, on hover on desktop */}
        <div className="absolute inset-0 bg-black/40 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onQuickView(product.id)}
            className="px-2 py-1 bg-white rounded-md text-[9px] font-medium text-[#111827] hover:bg-[#10b981] hover:text-white transition-all duration-200 transform scale-90 md:group-hover/card:scale-100 shadow-lg"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Content - Reduced padding and spacing */}
      <CardContent className="p-2 space-y-1">
        {/* Vendor Name */}
        <p className="text-[9px] text-[#6b7280] truncate">
          {product.vendor?.storeName || "Unknown"}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-[10px] leading-tight line-clamp-2 text-[#111827] group-hover/card:text-[#10b981] transition-colors min-h-[24px]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-bold text-xs text-[#10b981]">
            {formatPrice(product.price)}
          </span>
          {product.discountPrice && (
            <>
              <span className="text-[8px] text-[#9ca3af] line-through">
                {formatPrice(product.discountPrice)}
              </span>
              <Badge className="bg-[#fef3c7] text-[#d97706] text-[8px] border-0 px-1 py-0">
                -{discountPercentage}%
              </Badge>
            </>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            <Star className="h-2.5 w-2.5 fill-[#f59e0b] text-[#f59e0b]" />
            <span className="text-[9px] font-medium text-[#111827]">4.5</span>
          </div>
          <span className="text-[8px] text-[#9ca3af]">(128)</span>
        </div>

        {/* Order Button */}
        <Button
          className={`w-full mt-1 font-medium text-[10px] h-7 transition-all duration-200 rounded-md disabled:cursor-not-allowed ${
            isCreating
              ? "bg-gray-400 hover:bg-gray-400 text-white"
              : isOutOfStock
                ? "bg-gray-300 hover:bg-gray-300 text-gray-500"
                : "bg-[#10b981] hover:bg-[#059669] text-white"
          }`}
          size="sm"
          disabled={isOutOfStock || isCreating}
          onClick={handleWhatsAppOrder}
        >
          {isCreating ? (
            <div className="flex items-center justify-center gap-1">
              <svg
                className="animate-spin h-3 w-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <ShoppingCart className="mr-1 h-2.5 w-2.5 transition-transform" />
              {isOutOfStock ? "Out of Stock" : "Order"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
