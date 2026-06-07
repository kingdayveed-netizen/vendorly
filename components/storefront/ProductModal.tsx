"use client";

import { useState } from "react";
import Image from "next/image";
import { StoreProduct } from "@/redux/slices/storeSlice";
import {
  X,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface ProductModalProps {
  product: StoreProduct;
  storeSlug: string;
  onClose: () => void;
  onWhatsAppOrder?: (product: StoreProduct) => void;
}

export default function ProductModal({
  product,
  storeSlug,
  onClose,
}: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!product.vendorPhone) return;

    const formatToInternational = (phone: string) => {
      let cleaned = phone.replace(/[^\d]/g, "");

      // If number starts with 0, replace with 234
      if (cleaned.startsWith("0")) {
        cleaned = "234" + cleaned.slice(1);
      }

      return cleaned;
    };

    const phoneNumber = formatToInternational(product.vendorPhone);

    const message = `Hello, I'm interested in ordering: Product: ${product.name} Price: ₦${product.price.toLocaleString()}. Please let me know how to proceed with the order.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    // const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image gallery */}
          <div className="relative h-96 md:h-full bg-gray-100">
            {product.images.length > 0 ? (
              <>
                <Image
                  src={product.images[currentImageIndex].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Image indicators */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold text-green-600">
                ₦{product.price.toLocaleString()}
              </span>
              {product.quantity > 0 ? (
                <span className="px-2 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                  In Stock ({product.quantity})
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {product.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleWhatsAppOrder}
              disabled={product.quantity === 0}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Order via WhatsApp
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              You'll be redirected to WhatsApp to complete your order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
