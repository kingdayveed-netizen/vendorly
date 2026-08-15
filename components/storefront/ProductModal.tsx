"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  X,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { StoreProduct } from "@/redux/slices/storeSlice";
import { RootState } from "@/redux/store";
import { useAddToCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface ProductModalProps {
  product: StoreProduct;
  onClose: () => void;
}

export default function ProductModal({
  product,
  onClose,
}: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { addToCart, isAdding } = useAddToCart();

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.stopPropagation();

    if (product.quantity === 0 || isAdding) return;

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl bg-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="relative h-96 bg-gray-100 md:h-full">
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 w-2 rounded-full transition-colors ${
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
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          <div className="p-6">
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              {product.name}
            </h2>

            <div className="mb-4 flex items-center gap-2">
              <span className="text-3xl font-bold text-green-600">
                NGN {product.price.toLocaleString()}
              </span>
              {product.quantity > 0 ? (
                <span className="rounded-full bg-green-100 px-2 py-1 text-sm text-green-600">
                  In Stock ({product.quantity})
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-2 py-1 text-sm text-red-600">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-gray-700">Description</h3>
              <p className="whitespace-pre-line text-gray-600">
                {product.description}
              </p>
            </div>

            {product.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 font-semibold text-gray-700">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              disabled={product.quantity === 0 || isAdding}
              className="min-h-12 w-full rounded-lg bg-gray-900 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-600 hover:shadow-md focus:ring-green-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
            >
              {isAdding ? (
                <Loader2 className="mr-2 h-5 w-5 flex-shrink-0 animate-spin" />
              ) : (
                <ShoppingCart className="mr-2 h-5 w-5 flex-shrink-0" />
              )}
              <span className="whitespace-nowrap">
                {isAdding ? "Adding to cart" : "Add to cart"}
              </span>
            </Button>

            <p className="mt-4 text-center text-xs text-gray-500">
              Sign in to add this item to your cart and complete checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
