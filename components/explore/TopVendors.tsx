"use client";

import { Card } from "@/components/ui/Card";
import {
  Award,
  Star,
  TrendingUp,
  Shield,
  Sparkles,
  Store,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { useExplore } from "@/hooks/useExplore";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface TopVendorsProps {
  onViewAll?: () => void;
}

export const TopVendors = ({ onViewAll }: TopVendorsProps) => {
  const { topVendors, isLoadingTopVendors } = useExplore();
  const [hoveredVendor, setHoveredVendor] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Format date helper
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 30) {
      return `${diffDays} days ago`;
    } else if (diffDays <= 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 220;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [topVendors]);

  const vendorSkeletons = Array.from({ length: 8 });

  return (
    <section className="relative">
      <SectionHeader
        icon={Award}
        title="Top Vendors"
        subtitle="Trusted sellers with high ratings"
        iconBg="bg-[#10b981]/10"
        onViewAll={onViewAll}
      />

      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#10b981] hover:bg-[#059669] text-white rounded-full p-2 shadow-xl transition-all duration-200 hover:scale-110 border-0"
            style={{ transform: "translateY(-50%)" }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-4 no-scrollbar scroll-smooth"
          style={{
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {isLoadingTopVendors &&
            vendorSkeletons.map((_, index) => (
              <div key={index} className="flex-shrink-0 w-[180px] sm:w-[200px]">
                <Card className="h-[230px] p-4 border border-[#e5e7eb] bg-white">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse mb-4" />
                    <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mb-3" />
                    <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mb-4" />
                    <div className="h-3 w-28 bg-gray-100 rounded animate-pulse mb-3" />
                    <div className="h-6 w-full bg-gray-100 rounded animate-pulse mt-2" />
                  </div>
                </Card>
              </div>
            ))}

          {!isLoadingTopVendors &&
            topVendors.map((vendor) => (
              <div
                key={vendor.storeName}
                className="flex-shrink-0 w-[180px] sm:w-[200px] group/vendor"  
              >
                <Card
                  className="relative text-center p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-[#e5e7eb] hover:border-[#10b981]/30 bg-white/80 backdrop-blur-sm overflow-hidden h-full"
                  onMouseEnter={() => setHoveredVendor(vendor.storeName)}
                  onMouseLeave={() => setHoveredVendor(null)}
                >
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10b981]/0 via-[#10b981]/0 to-[#10b981]/0 group-hover/vendor:from-[#10b981]/10 group-hover/vendor:via-[#10b981]/5 group-hover/vendor:to-transparent transition-all duration-500" />

                  {/* Verified badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-[#10b981]/10 rounded-full p-1 group-hover/vendor:bg-[#10b981]/20 transition-colors">
                      <Shield className="h-2.5 w-2.5 text-[#10b981]" />
                    </div>
                  </div>

                  {/* Image container with enhanced styling */}
                  <div className="relative mb-3 flex justify-center">
                    <div className="relative">
                      {/* Animated background glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/0 rounded-full blur-xl opacity-0 group-hover/vendor:opacity-100 transition-opacity duration-500" />

                      {/* Image wrapper with border and shadow */}
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/5 p-0.5 group-hover/vendor:from-[#10b981]/40 group-hover/vendor:to-[#10b981]/20 transition-all duration-300">
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-md group-hover/vendor:shadow-xl transition-all duration-300">
                          {vendor.logo ? (
                            <Image
                              src={vendor.logo}
                              height={64}
                              width={64}
                              alt={`${vendor.storeName} logo`}
                              className="h-full w-full object-cover scale-100 group-hover/vendor:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#10b981]/10 to-[#10b981]/5 flex items-center justify-center">
                              <Store className="h-6 w-6 text-[#10b981]/40" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Decorative ring on hover */}
                      <div className="absolute inset-0 rounded-full border-2 border-[#10b981]/0 group-hover/vendor:border-[#10b981]/30 transition-all duration-300 scale-110" />
                    </div>

                    {/* Floating rating indicator */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-full px-1.5 py-0.5 flex items-center gap-0.5 border border-[#e5e7eb] opacity-0 group-hover/vendor:opacity-100 transition-all duration-300 translate-y-1 group-hover/vendor:translate-y-0">
                      <Star className="h-2 w-2 fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="text-[10px] font-semibold text-[#111827]">
                        {vendor.averageRating}
                      </span>
                    </div>
                  </div>

                  {/* Store name with hover effect */}
                  <h3 className="font-semibold text-xs mb-1.5 text-[#111827] group-hover/vendor:text-[#10b981] transition-colors duration-300 line-clamp-1">
                    {vendor.storeName}
                  </h3>

                  {/* Rating stars */}
                  <div className="flex items-center justify-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-2.5 w-2.5 ${
                          i < Math.floor(vendor.averageRating!)
                            ? "fill-[#f59e0b] text-[#f59e0b]"
                            : i < vendor.averageRating!
                              ? "fill-[#f59e0b]/50 text-[#f59e0b]/50"
                              : "fill-gray-200 text-gray-200"
                        } transition-all duration-300`}
                      />
                    ))}
                  </div>

                  {/* Location and Join Date */}
                  <div className="flex items-center justify-center gap-2 mb-2 text-[10px]">
                    {vendor.location && (
                      <div className="flex items-center gap-0.5 text-[#6b7280] group-hover/vendor:text-[#10b981] transition-colors duration-300">
                        <MapPin className="h-2.5 w-2.5" />
                        <span className="truncate max-w-[60px]">
                          {vendor.location}
                        </span>
                      </div>
                    )}
                    {vendor.joinDate && (
                      <div className="flex items-center gap-0.5 text-[#6b7280] group-hover/vendor:text-[#10b981] transition-colors duration-300">
                        <Calendar className="h-2.5 w-2.5" />
                        <span>{formatJoinDate(vendor.joinDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats with icons */}
                  <div className="flex items-center justify-center gap-3 text-[10px] mb-2">
                    <div className="flex items-center gap-0.5 text-[#6b7280] group-hover/vendor:text-[#111827] transition-colors">
                      <div className="w-0.5 h-0.5 rounded-full bg-[#10b981] group-hover/vendor:scale-125 transition-transform" />
                      <span>{vendor.totalProducts} items</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-[#10b981] font-medium">
                      <TrendingUp className="h-2.5 w-2.5" />
                      <span>{vendor.totalOrders} sales</span>
                    </div>
                  </div>

                  {/* Hover action button */}
                  <div className="mt-1 opacity-0 group-hover/vendor:opacity-100 transition-all duration-300 translate-y-1 group-hover/vendor:translate-y-0">
                    <button className="w-full text-[10px] bg-[#10b981]/10 text-[#10b981] py-1 rounded-lg font-medium hover:bg-[#10b981] hover:text-white transition-all duration-300">
                      <Link
                        href={`/${vendor.storeSlug}`}
                        className="w-full block h-full"
                        target="_blank"
                      >
                        View Store
                      </Link>
                    </button>
                  </div>

                  {/* Decorative sparkle effect on hover */}
                  {hoveredVendor === vendor.storeName && (
                    <div className="absolute inset-0 pointer-events-none">
                      <Sparkles className="absolute top-1/4 left-1/4 h-2 w-2 text-[#10b981]/40 animate-ping" />
                      <Sparkles className="absolute bottom-1/4 right-1/4 h-1.5 w-1.5 text-[#10b981]/40 animate-pulse" />
                    </div>
                  )}
                </Card>
              </div>
            ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#10b981] hover:bg-[#059669] text-white rounded-full p-2 shadow-xl transition-all duration-200 hover:scale-110 border-0"
            style={{ transform: "translateY(-50%)" }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
