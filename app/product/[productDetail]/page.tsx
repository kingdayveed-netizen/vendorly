"use client";

import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProducts";
import { useState } from "react";
import {
  ChevronLeft,
  ImageOff,
  Package,
  Tag,
  Store,
  Calendar,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";

const ProductDetail = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.productDetail as string;
  const { vendorProduct } = useProduct();

  const [mainImage, setMainImage] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, isLoading, error } = vendorProduct(productId);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
            <div className="space-y-6">
              <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-10 text-center shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">
            This product may have been removed.
          </p>
          <Button onClick={() => router.push("/products")}>
            Browse Products
          </Button>
        </Card>
      </div>
    );
  }

  const currentImage =
    product.images?.map((img) => img.url)[mainImage] || null;
  const hasImageError = imageErrors.has(mainImage);

  const stockColor =
    product.quantity === 0 ? "red" : product.quantity < 10 ? "yellow" : "green";

  const stockText =
    product.quantity === 0
      ? "Out of Stock"
      : product.quantity < 10
      ? "Low Stock"
      : "In Stock";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Nav */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href={`/${product.vendor?.storeSlug}`}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">Back to store</span>
          </Link>

          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-2 rounded-full bg-white shadow hover:shadow-md transition"
          >
            <Heart
              className={`h-5 w-5 ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="relative w-full pt-[100%]">
                {currentImage && !hasImageError ? (
                  <Image
                    src={currentImage}
                    alt={product.name}
                    fill
                    className="object-contain p-6"
                    onError={() => handleImageError(mainImage)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                    <ImageOff className="text-gray-400" size={40} />
                  </div>
                )}

                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full text-white ${
                      stockColor === "green"
                        ? "bg-green-500"
                        : stockColor === "yellow"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {stockText}
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-3 mt-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border ${
                      mainImage === index
                        ? "border-green-500"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category */}
            <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              <Tag size={12} />
              {product.category?.[0]?.category?.name || "Uncategorized"}
            </span>

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Price */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-3xl font-bold text-green-600">
                ₦{product.price.toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-medium mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            {/* Stock */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <Package className="text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Stock</p>
                  <p className="font-semibold">{product.quantity} units</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Updated {formatDate(product.updatedAt)}
              </p>
            </div>

            {/* Vendor */}
            {product.vendor && (
              <Card>
                <CardContent className="p-5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Store className="text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Vendor</p>
                      <p className="font-semibold">
                        {product.vendor.storeName}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Visit Store
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                disabled={product.quantity === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Add to Cart
              </Button>
              <Button variant="outline">Contact</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;