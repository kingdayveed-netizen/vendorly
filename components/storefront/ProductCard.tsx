"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import { StoreProduct } from "@/redux/slices/storeSlice";
import { RootState } from "@/redux/store";
import { useAddToCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface ProductCardProps {
  product: StoreProduct;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { addToCart, isAdding } = useAddToCart();

  const productImage =
    product.images && product.images.length > 0 ? product.images[0].url : null;
  const isOutOfStock = product.quantity === 0;

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.stopPropagation();

    if (isOutOfStock || isAdding) return;

    if (!isAuthenticated) {
      toast.error("Please sign in to add items to your cart");
      router.push("/login");
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative h-48 bg-gray-100">
        {productImage ? (
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
              Out of Stock
            </span>
          </div>
        )}

        <div
          className={`absolute right-2 top-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button className="rounded-full bg-white p-2 shadow-md hover:bg-gray-100">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-1 line-clamp-1 font-medium text-gray-800">
          {product.name}
        </h3>
        <p className="mb-2 line-clamp-2 text-sm text-gray-500">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-green-600">
            NGN {product.price.toLocaleString()}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="inline-flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {isAdding ? "Adding..." : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
