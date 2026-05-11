"use client";

import Image from "next/image";
import { StoreProduct } from "@/redux/slices/storeSlice";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useOrder } from "@/hooks/useOrder";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface ProductCardProps {
  product: StoreProduct;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  const { createOrder, isCreating } = useOrder();

  const handleWhatsAppOrder = async (e: React.MouseEvent) => {
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

    try {
      await createOrder({
        productId: product.id,
        vendorId: product.vendorId,
        customerId: user?.id!,
        customerName: user?.fullName!,
        customerPhone: user?.phone!,
        productName: product.name,
      });

      const phoneNumber = formatToInternational(product.vendorPhone);

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

  const productImage =
    product.images && product.images.length > 0 ? product.images[0].url : null;

  return (
    <div
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative h-48 bg-gray-100">
        {product.images[0] ? (
          <Image
            src={productImage!}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Out of stock overlay */}
        {product.quantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold px-3 py-1 bg-red-500 rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick action buttons */}
        <div
          className={`absolute top-2 right-2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-green-600">
              ₦{product.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleWhatsAppOrder}
            disabled={product.quantity === 0 || isCreating}
            className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? "Processing..." : "Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
