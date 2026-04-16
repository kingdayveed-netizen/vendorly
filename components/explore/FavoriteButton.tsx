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
}

export const FavoriteButton = ({
  productId,
  size = "md",
  showCount = false,
  className,
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
    sm: "h-3.5 w-3.5 p-1",
    md: "h-4 w-4 p-1.5",
    lg: "h-5 w-5 p-2",
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
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "rounded-full transition-all duration-200 flex items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
        isFavorited || (isHovered && !optimistic)
          ? "bg-red-50 text-red-500"
          : "bg-white/80 text-gray-400 hover:text-red-500",
        sizeClasses[size],
        className,
      )}
      disabled={optimistic}
    >
      <Heart
        className={cn(
          "transition-all duration-200",
          isFavorited ? "fill-red-500 text-red-500" : "",
          optimistic && "animate-pulse",
        )}
      />
    </button>
  );
};
