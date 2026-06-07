"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorite";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";

interface FavoriteButtonProps {
  productId: string;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
  isWishlisted: boolean;
}

export const FavoriteButton = ({
  productId,
  size = "md",
  showCount = false,
  className,
  isWishlisted 
}: FavoriteButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [optimistic, setOptimistic] = useState(false);
  const { isFavorited: isFavoritedGlobal, toggle, checkBatch } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const isFavorited = isFavoritedGlobal(productId);

  // Check favorite status on mount
  useEffect(() => {
    if (isAuthenticated && productId) {
      checkBatch([productId]);
    }
  }, [isAuthenticated, productId]);

  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-9 w-9",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast("Please login to save favorites", "error");
      return;
    }

    setOptimistic(true);
    try {
      await toggle(productId);
    } catch (error) {
      showToast("Failed to update favorites", "error");
    } finally {
      setOptimistic(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "rounded-full relative z-50 transition-all duration-200 flex items-center justify-center",
          "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
          "shadow-md hover:shadow-lg",
          "bg-white border border-gray-200",
          isFavorited
            ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
            : isHovered && !optimistic
            ? "bg-red-50 border-red-200 text-red-500"
            : "text-gray-500 hover:text-red-500",
          sizeClasses[size],
          className,
        )}
        disabled={optimistic}
      >
        <Heart
          className={cn(
            iconSizes[size],
            "transition-all duration-200",
            (isFavorited || isWishlisted) && "fill-white text-white scale-110",
            !(isFavorited || isWishlisted) && isHovered && "scale-110"
          )
        }
        />
      </button>
      
      {/* Optional badge for count */}
      {showCount && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1 shadow-sm">
          {Math.floor(Math.random() * 99) + 1}
        </span>
      )}
    </div>
  );
};