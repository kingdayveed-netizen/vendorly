"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ImageOff,
  Package,
  Eye,
  Info,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { useProduct } from "@/hooks/useProducts";
import Link from "next/link";
import Image from "next/image";
import EditProductModal from "@/app/dashboard/products/EditProductModal";

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show only 5 pages at a time
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;

    if (currentPage <= 3) return pages.slice(0, 5);
    if (currentPage >= totalPages - 2) return pages.slice(totalPages - 5);

    return pages.slice(currentPage - 3, currentPage + 2);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >
          Next
        </Button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>

          {visiblePages[0] > 1 && (
            <>
              <Button
                onClick={() => onPageChange(1)}
                variant={currentPage === 1 ? "default" : "outline"}
                size="sm"
                className={currentPage === 1 ? "bg-green-500 text-white" : ""}
              >
                1
              </Button>
              {visiblePages[0] > 2 && <span className="px-2">...</span>}
            </>
          )}

          {visiblePages.map((page) => (
            <Button
              key={page}
              onClick={() => onPageChange(page)}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className={
                currentPage === page
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : ""
              }
            >
              {page}
            </Button>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span className="px-2">...</span>
              )}
              <Button
                onClick={() => onPageChange(totalPages)}
                variant={currentPage === totalPages ? "default" : "outline"}
                size="sm"
                className={
                  currentPage === totalPages ? "bg-green-500 text-white" : ""
                }
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({
  product,
  onEdit,
  onDelete,
}: {
  product: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [imageError, setImageError] = useState(false);

  // Get the first image or use placeholder
  const productImage =
    product.images && product.images.length > 0 ? product.images[0].url : null;

  // Stock status
  const getStockStatus = () => {
    if (product.quantity === 0) {
      return {
        label: "Out of Stock",
        color: "bg-red-100 text-red-800 border-red-200",
      };
    }
    if (product.quantity < 10) {
      return {
        label: "Low Stock",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    }
    return {
      label: "In Stock",
      color: "bg-green-100 text-green-800 border-green-200",
    };
  };

  const stockStatus = getStockStatus();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-gray-200 hover:border-green-200">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {productImage && !imageError ? (
          <>
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    window.open(`/product/${product.id}`, "_blank")
                  }
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-green-500 hover:text-white transition-colors"
                  title="View Product"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(product.id)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-green-500 hover:text-white transition-colors"
                  title="Edit Product"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-12 w-12 text-gray-300" />

            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    window.open(`/product/${product.id}`, "_blank")
                  }
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-green-500 hover:text-white transition-colors"
                  title="View Product"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(product.id)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-green-500 hover:text-white transition-colors"
                  title="Edit Product"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stock Badge */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border ${stockStatus.color} bg-opacity-90 backdrop-blur-sm`}
        >
          {stockStatus.label}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-green-600">
            ₦{product.price.toLocaleString()}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>{product.quantity} units</span>
          </div>
        </div>

        {/* Category Tags */}
        {product.category &&
          Array.isArray(product.category) &&
          product.category.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.category.map(
                (cat: { category: { name: string } }, index: number) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                  >
                    {cat.category.name}
                  </span>
                ),
              )}
            </div>
          )}

        {/* Mobile Actions (visible on small screens) */}
        <div className="flex gap-2 mt-4 sm:hidden">
          <Button
            onClick={() => onEdit(product.id)}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={() => onDelete(product.id)}
            size="sm"
            variant="outline"
            className="flex-1 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProductsPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "newest" | "price-low" | "price-high" | "name"
  >("newest");
  const productsPerPage = 8;
  const [showDuplicateNotice, setShowDuplicateNotice] = useState(true);

  const { vendorProducts, deleteProduct } = useProduct();

  // Get unique categories from products
  const categories = useMemo(() => {
    if (!vendorProducts.data) return [];

    const cats = vendorProducts.data.flatMap((p) =>
      p.category.map((c: any) => c.category.name),
    );

    return ["All", ...new Set(cats)];
  }, [vendorProducts.data]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!vendorProducts.data) return [];

    let filtered = [...vendorProducts.data];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter((product) =>
        product.category.some((c: any) => c.category.name === selectedCategory),
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    return filtered;
  }, [vendorProducts.data, searchTerm, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / productsPerPage,
  );
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const handleEdit = (productId: string) => {
    const product = vendorProducts.data?.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsEditModalOpen(true);
    }
  };

  // callback for when product is updated in the edit modal
  const handleProductUpdated = () => {
    vendorProducts.refetch();
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct.mutateAsync(productId);
      } catch (error) {
        toast.error("Failed to delete product. Please try again.", { position: 'top-center'});  
      }
    }
  };

  // Loading state
  if (vendorProducts.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <CardContent className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                <div className="flex justify-between">
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (vendorProducts.isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full text-center p-8 shadow-sm border border-red-100">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            We couldn't load your products right now. Please try again.
          </p>
          <Button
            onClick={() => vendorProducts.refetch()}
            className="bg-green-500 hover:bg-green-600 text-white px-6"
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedProducts.length} product
            {filteredAndSortedProducts.length !== 1 && "s"} in total
          </p>
        </div>

        <Link href="/dashboard/products/addProduct">
          <Button className="bg-green-500 hover:bg-green-600 text-white inline-flex items-center gap-2 px-6">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {showDuplicateNotice && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex-1 text-sm text-red-700">
              <span className="font-medium">Quick tip:</span> If you're adding a
              product that already exists, consider updating the quantity of the
              existing product instead of creating a duplicate.
            </div>
            <button
              onClick={() => setShowDuplicateNotice(false)}
              className="flex-shrink-0 text-red-400 hover:text-red-500"
              aria-label="Dismiss"
            >
              <span className="text-xl leading-none">&times;</span>
            </button>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products by name or description..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.25rem",
              }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.25rem",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory) && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-green-900"
                  >
                    {/* 1472 */}×
                  </button>
                </span>
              )}
              {selectedCategory && selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("")}
                    className="hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Grid */}
      {currentProducts.length === 0 ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory
                ? "Try adjusting your filters or search term"
                : "Get started by adding your first product"}
            </p>
            {!searchTerm && !selectedCategory && (
              <Link href="/dashboard/products/addProduct">
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

          {/* Results Info */}
          <div className="text-center text-sm text-gray-500">
            Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
            {Math.min(
              currentPage * productsPerPage,
              filteredAndSortedProducts.length,
            )}{" "}
            of {filteredAndSortedProducts.length} products
          </div>
        </>
      )}

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onProductUpdated={handleProductUpdated}
      />
    </div>
  );
}
