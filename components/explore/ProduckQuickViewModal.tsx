"use client";

import { useEffect, useState } from "react";
import {
  X,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  Store,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/explore";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import { useOrder } from "@/hooks/useOrder";

interface ProductQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  isLoading: boolean;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  formatPrice: (price: number) => string;
}

export const ProductQuickViewModal = ({
  isOpen,
  onClose,
  product,
  isLoading,
  isWishlisted,
  onToggleWishlist,
  formatPrice,
}: ProductQuickViewModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);
  const { createOrder, isCreating } = useOrder();

  const images =
    product?.images?.filter((img) => img?.url?.startsWith("http")) || [];
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsImageLoading(true);
  }, [product]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsImageLoading(true);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsImageLoading(true);
  };

  if (!isOpen) return null;

  const handleWhatsAppOrder = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!product?.vendor.user.phone) return;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] md:max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 md:p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 group"
        >
          <X className="h-4 w-4 md:h-5 md:w-5 text-[#6b7280] group-hover:text-[#111827]" />
        </button>

        {/* ESC Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-sm rounded-full px-2 md:px-3 py-0.5 md:py-1 pointer-events-none hidden lg:flex">
          <p className="text-[8px] md:text-[10px] text-white/80 flex items-center gap-1">
            <span className="bg-white/20 px-1 rounded text-[8px] md:text-[9px]">
              ESC
            </span>
            <span>to exit</span>
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[400px] md:h-[500px] w-full">
            <div className="flex items-center justify-center gap-1">
              {["v", "e", "n", "d", "o", "r", "l", "y"].map((letter, index) => (
                <span
                  key={index}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent"
                  style={{
                    animation: `bounceSmooth 1.4s ease-in-out infinite`,
                    animationDelay: `${index * 0.12}s`,
                    display: "inline-block",
                    transformOrigin: "center",
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
            <style jsx>{`
              @keyframes bounceSmooth {
                0%,
                100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-20px);
                }
              }
            `}</style>
          </div>
        ) : product ? (
          <>
            {/* Image Section  */}
            <div className="bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6] p-4 md:p-6 flex-shrink-0 md:w-2/5 lg:w-2/5">
              {/* Main Image  */}
              <div className="relative flex items-center justify-center h-48 sm:h-56 md:h-80 lg:h-96">
                {images.length > 0 ? (
                  <>
                    {isImageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 md:h-8 md:w-8 text-[#10b981] animate-spin" />
                      </div>
                    )}
                    <img
                      src={images[currentImageIndex]?.url}
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      className={`max-w-full max-h-full object-contain rounded-lg transition-opacity duration-300 ${
                        isImageLoading ? "opacity-0" : "opacity-100"
                      }`}
                      onLoad={() => setIsImageLoading(false)}
                    />
                  </>
                ) : (
                  <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-30">
                    📦
                  </span>
                )}

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 p-1.5 md:p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-[#374151]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 p-1.5 md:p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-[#374151]" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails - Smaller on mobile/tablet */}
              {hasMultipleImages && (
                <div className="flex gap-1 md:gap-2 mt-2 md:mt-4 overflow-x-auto pb-2 justify-center">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setIsImageLoading(true);
                      }}
                      className={`relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === idx
                          ? "border-[#10b981] shadow-md scale-105"
                          : "border-[#e5e7eb] hover:border-[#10b981]/50"
                      }`}
                    >
                      <img
                        src={img?.url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section - Takes more space on mobile/tablet */}
            <div className="p-4 md:p-6 overflow-y-auto flex-1 md:w-3/5 lg:w-3/5">
              {/* Vendor Info */}
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
                <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10 flex items-center justify-center flex-shrink-0">
                  <Store className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-[#10b981]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-semibold text-[#111827] truncate">
                    {product.vendor?.storeName || "Unknown Store"}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    <div className="flex items-center">
                      <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="text-[10px] md:text-xs font-medium text-[#111827] ml-0.5">
                        {product.rating || "4.8"}
                      </span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] md:text-[11px] text-[#9ca3af]">
                      (245 reviews)
                    </span>
                    <span className="w-0.5 h-0.5 rounded-full bg-[#d1d5db] mx-0.5 md:mx-1" />
                    <div className="flex items-center gap-0.5">
                      <CheckCircle className="h-2.5 w-2.5 md:h-3 md:w-3 text-[#10b981]" />
                      <span className="text-[8px] sm:text-[9px] md:text-[11px] text-[#10b981]">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-[#111827] mb-1.5 md:mb-3 leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4 flex-wrap">
                <span className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-[#10b981]">
                  {formatPrice(product.price)}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-[10px] sm:text-xs md:text-sm text-[#9ca3af] line-through">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <Badge className="bg-gradient-to-r from-[#fef3c7] to-[#fed7aa] text-[#d97706] border-0 px-1 sm:px-1.5 md:px-2 py-0.5 text-[8px] sm:text-[9px] md:text-xs">
                      -
                      {Math.round(
                        (1 - product.price / product.discountPrice) * 100,
                      )}
                      %
                    </Badge>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="mb-2 md:mb-5">
                <h3 className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-1 md:mb-2">
                  Description
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-[#4b5563] leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {product.description ||
                    "No description available for this product. Contact the vendor for more details."}
                </p>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-2 gap-1 md:gap-2 mb-2 md:mb-5">
                <div className="flex items-center gap-1 md:gap-2 text-[9px] sm:text-[10px] md:text-sm text-[#6b7280] bg-[#f9fafb] rounded-lg px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2">
                  <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-[#10b981] flex-shrink-0" />
                  <span className="truncate">Authentic</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-[9px] sm:text-[10px] md:text-sm text-[#6b7280] bg-[#f9fafb] rounded-lg px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2">
                  <Truck className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-[#10b981] flex-shrink-0" />
                  <span className="truncate">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-[9px] sm:text-[10px] md:text-sm text-[#6b7280] bg-[#f9fafb] rounded-lg px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2">
                  <RefreshCw className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-[#10b981] flex-shrink-0" />
                  <span className="truncate">
                    No what I ordered vs what I got
                  </span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-[9px] sm:text-[10px] md:text-sm text-[#6b7280] bg-[#f9fafb] rounded-lg px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2">
                  <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-[#10b981] flex-shrink-0" />
                  <span className="truncate">Support</span>
                </div>
              </div>

              {/* Stock Status */}
              {product.quantity > 0 && product.quantity < 5 && (
                <div className="mb-2 md:mb-5 p-1.5 sm:p-2 md:p-3 bg-gradient-to-r from-[#fef3c7] to-[#fed7aa] rounded-xl border border-[#fed7aa]">
                  <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#d97706] flex items-center gap-1 md:gap-2">
                    <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
                    ⚡ Only {product.quantity} items left! Order now.
                  </p>
                </div>
              )}

              {product.quantity === 0 && (
                <div className="mb-2 md:mb-5 p-1.5 sm:p-2 md:p-3 bg-[#f3f4f6] rounded-xl">
                  <p className="text-[9px] sm:text-[10px] md:text-xs font-medium text-[#6b7280] text-center">
                    Out of Stock - Check back soon
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 md:gap-3">
                <Button
                  className={`flex-1 font-semibold py-1.5 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm shadow-lg transition-all duration-300 ${
                    isCreating
                      ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                      : product.quantity === 0
                        ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] hover:shadow-xl"
                  }`}
                  disabled={product.quantity === 0 || isCreating}
                  onClick={handleWhatsAppOrder}
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      <ShoppingCart className="mr-1 md:mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                      {product.quantity === 0
                        ? "Out of Stock"
                        : "Order on WhatsApp"}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className={`px-3 sm:px-4 md:px-6 border-2 transition-all duration-300 py-1.5 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm ${
                    isWishlisted
                      ? "border-[#ef4444] bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444] hover:text-white"
                      : "border-[#e5e7eb] hover:border-[#ef4444] hover:text-[#ef4444]"
                  }`}
                  onClick={() => onToggleWishlist(product.id)}
                >
                  <Heart
                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-all ${
                      isWishlisted ? "fill-[#ef4444]" : ""
                    }`}
                  />
                  <span className="ml-1 md:ml-2 hidden sm:inline">
                    {isWishlisted ? "Saved" : "Save"}
                  </span>
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-3 md:mt-6 pt-2 md:pt-4 border-t border-[#e5e7eb]">
                <p className="text-[8px] sm:text-[9px] md:text-xs text-[#9ca3af] text-center">
                  Need help? Contact vendor directly via WhatsApp
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[400px] md:h-[500px] w-full">
            <div className="text-center px-4">
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-[#fef2f2] flex items-center justify-center mx-auto mb-3 md:mb-4">
                <X className="h-6 w-6 md:h-8 md:w-8 text-[#ef4444]" />
              </div>
              <p className="text-sm text-[#6b7280] font-medium">
                Failed to load product details
              </p>
              <p className="text-xs text-[#9ca3af] mt-1">
                Please try again later
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
