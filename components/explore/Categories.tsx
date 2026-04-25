"use client";

import { useMemo } from "react"; 
import {
  Sparkles,
  Laugh,
  Zap,
  Award,
  TrendingUp,
  Star,
  ToyBrick,
  Camera,
  Book,
  Music,
  Gamepad,
  Laptop,
  Watch,
  Shirt,
  Home,
  Car,
  Baby,
  Phone,
  PawPrint,
  Trophy,
  Cookie,
  HeartPulse,
  Blinds,
  Beef,
} from "lucide-react";

// Icon mapping for different categories
const categoryIcons: Record<string, any> = {
  // Default categories
  All: Sparkles,
  Electronics: Zap,
  Fashion: Award,
  Gadgets: TrendingUp,
  Accessories: Star,

  // Additional categories you might have
  Cameras: Camera,
  Books: Book,
  Music: Music,
  Gaming: Gamepad,
  Laptops: Laptop,
  Watches: Watch,
  Clothing: Shirt,
  Furniture: Home,
  Automotive: Car,
  Baby: Baby,
  "Pet Supplies": PawPrint,
  "Toys & Games": ToyBrick,
  "Beauty & Personal Care": Laugh,
  "Home & Living": Blinds,
  "Food & Beverages": Beef,
  "Sports & Outdoors": Trophy,
  Food: Cookie,
  Beauty: HeartPulse,
  Phones: Phone,
};

// Helper function to get icon for a category
const getCategoryIcon = (categoryName: string) => {
  return categoryIcons[categoryName] || Sparkles;
};

interface Category {
  name: string | string[]; 
  count: number;
}

interface CategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Category[];
  isLoading: boolean;
}

export const Categories = ({
  activeCategory,
  onCategoryChange,
  categories,
  isLoading,
}: CategoriesProps) => {
  // Show loading skeletons while fetching
  if (isLoading) {
    return (
      <section className="py-6 border-b border-[#e5e7eb] bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="h-10 w-20 bg-[#f3f4f6] rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ✅ Process categories to handle array names
  const processedCategories = useMemo(() => {
    const categoryMap = new Map<string, number>();

    categories.forEach((cat) => {
      // If name is an array (from your backend)
      if (Array.isArray(cat.name)) {
        cat.name.forEach((categoryName: string) => {
          if (categoryName && categoryName.trim() !== "") {
            categoryMap.set(
              categoryName,
              (categoryMap.get(categoryName) || 0) + cat.count,
            );
          }
        });
      }
      // If name is a string (normal case)
      else if (typeof cat.name === "string" && cat.name.trim() !== "") {
        categoryMap.set(cat.name, (categoryMap.get(cat.name) || 0) + cat.count);
      }
    });

    // Convert to array format
    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [categories]);

  // Calculate total products from processed categories
  const totalProducts = processedCategories.reduce(
    (sum, cat) => sum + cat.count,
    0,
  );

  // Create "All" category and combine with processed categories
  const allCategories = [
    { name: "All", count: totalProducts },
    ...processedCategories,
  ];

  return (
    <section className="py-6 border-b border-[#e5e7eb] bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {allCategories.map((cat) => {
            const Icon = getCategoryIcon(cat.name);
            const isActive = activeCategory === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => onCategoryChange(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#10b981] text-white shadow-md"
                    : "bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb] hover:text-[#111827]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};