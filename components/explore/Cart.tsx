"use client";

import { useGetCart, useRemoveCartItem } from "@/hooks/useCart";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  Trash2,
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  Shield,
  Truck,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Cart() {
  const router = useRouter();
  const { data: cart, isLoading, error } = useGetCart();
  const { removeCartItem } = useRemoveCartItem();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [isAuthHydrated, setIsAuthHydrated] = useState(false);

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItems((current) => {
      const next = new Set(current);
      next.add(itemId);
      return next;
    });

    try {
      await removeCartItem(itemId);
    } catch {
      // Error messaging and recovery are handled in useRemoveCartItem.
    } finally {
      setRemovingItems((current) => {
        const next = new Set(current);
        next.delete(itemId);
        return next;
      });
    }
  };

  // Wait for auth state to be hydrated
  useEffect(() => {
    setIsAuthHydrated(true);
  }, []);

  // Show loading spinner while auth state is being hydrated
  if (!isAuthHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 border-4 border-transparent border-t-[#10b981] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">
            Loading your cart
          </p>
          <p className="text-sm text-gray-500">
            Please wait while we fetch your items...
          </p>
        </div>
      </div>
    );
  }

  // Not Authenticated State - Only show when auth is hydrated and user is not authenticated
  if (isAuthHydrated && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Sign in to view your cart
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Please log in to see the items you&apos;ve saved in your shopping
              cart.
            </p>
            <Link href="/login">
              <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300">
                Sign In to Continue
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading State - Show while fetching cart data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 border-4 border-transparent border-t-[#10b981] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">
            Loading your cart
          </p>
          <p className="text-sm text-gray-500">
            Please wait while we fetch your items...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Unable to load cart
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We encountered an issue while loading your cart. Please check your
              connection and try again.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Looks like you haven&apos;t added anything yet. Explore our
              products and find something you love!
            </p>
            <Link href="/explore">
              <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>

            <Link href="/explore">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-700 hover:border-[#10b981] hover:text-[#10b981] hover:bg-green-50 transition-all duration-200"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 mt-2">
            Review your items and proceed to checkout
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Secure Checkout
              </p>
              <p className="text-xs text-gray-500">Your data is protected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Fast Delivery
              </p>
              <p className="text-xs text-gray-500">Nationwide shipping</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Quality Products
              </p>
              <p className="text-xs text-gray-500">Verified vendors</p>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {item.product.images?.[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                    {/* Stock Badge */}
                    {item.product.quantity <= 5 &&
                      item.product.quantity > 0 && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                          Low Stock
                        </div>
                      )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Product Name & Category */}
                        <div className="mb-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#10b981] transition-colors line-clamp-1">
                            {item.product.name}
                          </h3>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-2xl font-bold text-[#10b981]">
                            ₦{item.product.price.toLocaleString()}
                          </span>
                          {item.product.discountPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ₦{item.product.discountPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Product Meta */}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-1.5">
                            <span className="text-gray-500">Qty:</span>
                            <span className="font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-1.5">
                            <span className="text-gray-500">Total:</span>
                            <span className="font-bold text-gray-900">
                              ₦
                              {(
                                item.product.price * item.quantity
                              ).toLocaleString()}
                            </span>
                          </div>

                          {item.product.discountPrice && (
                            <div className="flex items-center gap-1 bg-red-50 text-red-600 rounded-lg px-2.5 py-1">
                              <span className="text-xs font-bold">
                                Save ₦
                                {(
                                  (item.product.discountPrice -
                                    item.product.price) *
                                  item.quantity
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingItems.has(item.id)}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50"
                        title="Remove item"
                      >
                        {removingItems.has(item.id) ? (
                          <div className="w-5 h-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Checkout Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button
                        onClick={() => {
                          router.push(`/checkout?item=${item.id}`);
                        }}
                        className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold py-3 rounded-xl shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 group/btn"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Proceed to Checkout
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with item number */}
              <div className="bg-gray-50 px-6 py-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">
                    Item #{index + 1} of {cartItems.length}
                  </span>
                  <span className="text-xs text-gray-400">Added to cart</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link href="/explore">
            <Button
              variant="outline"
              className="border-2 border-gray-200 text-gray-700 hover:border-[#10b981] hover:text-[#10b981] hover:bg-green-50 font-semibold px-8 py-3 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>

          <p className="text-sm text-gray-500 text-center">
            {totalItems} {totalItems === 1 ? "item" : "items"} in cart • Secure
            checkout with SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}
