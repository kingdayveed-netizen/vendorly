'use client';

import { useState } from 'react';
import { StoreProduct } from '@/redux/slices/storeSlice';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: StoreProduct[];
  storeSlug?: string;
  onProductClick?: (product: StoreProduct) => void;
}

export default function ProductGrid({ products, storeSlug }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
        <p className="text-gray-500 mt-1">Check back later for new products.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          storeSlug={storeSlug!}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}