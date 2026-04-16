"use client";

import {
  MessageCircle,
  Search,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  User2,
  X,
  ChevronDown,
  Settings,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

interface ExploreHeaderProps {
  wishlistCount: number;
  cartCount: number;
  onSearch: (query: string) => void;
}

export const ExploreHeader = ({
  wishlistCount,
  cartCount,
  onSearch,
}: ExploreHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    setShowUserMenu(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b border-[#e5e7eb] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-[#10b981]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <MessageCircle className="h-7 w-7 text-[#10b981] relative" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#111827] to-[#10b981] bg-clip-text text-transparent">
              Vendorly
            </span>
          </Link>

          {/* Search Section - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af] transition-colors group-hover:text-[#10b981]" />
              <Input
                type="search"
                placeholder="Search products, vendors, categories..."
                className="pl-10 pr-10 h-10 bg-[#f9fafb] border-[#e5e7eb] focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition-all duration-200"
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-[#e5e7eb] rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-[#6b7280] hover:text-[#111827]" />
                </button>
              )}
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-[#f3f4f6] transition-all duration-200 hover:scale-105"
              onClick={() => router.push("/wishlist")}
            >
              <Heart className="h-5 w-5 text-[#6b7280] hover:text-[#10b981] transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-[#f3f4f6] transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed"
              onClick={() => router.push("/cart")}
              disabled 
            >
              <ShoppingCart className="h-5 w-5 text-[#6b7280] hover:text-[#10b981] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#f3f4f6] transition-all duration-200 group"
                >
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] flex items-center justify-center text-white text-sm font-medium shadow-md overflow-hidden">
                      {
                        user.profileImage ? 
                        <Image
                        src={user.profileImage!}
                        height={500}
                        width={500}
                        alt="user logo"
                        className="h-full w-full object-cover"
                        /> : (
                          <span>{getInitials(user.fullName || 'User')}</span>
                        )
                      } 
                     
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
                  </div>
                  <span className="text-sm font-medium text-[#374151] hidden sm:block group-hover:text-[#10b981] transition-colors">
                    {user.fullName?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#6b7280] transition-transform duration-200 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-[#e5e7eb] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-[#e5e7eb] bg-gradient-to-r from-[#f9fafb] to-white">
                      <p className="text-sm font-semibold text-[#111827]">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-[#6b7280] mt-0.5">
                        {user.email}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "VENDOR"
                              ? "bg-[#10b981]/10 text-[#10b981]"
                              : "bg-[#6b7280]/10 text-[#6b7280]"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {user.role === "VENDOR" ? (
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#374151] hover:bg-[#f3f4f6] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#374151] hover:bg-[#f3f4f6] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User2 className="h-4 w-4" />
                          My Profile
                        </Link>
                      )}

                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#374151] hover:bg-[#f3f4f6] transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>

                      <Link
                        href="/help"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#374151] hover:bg-[#f3f4f6] transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <HelpCircle className="h-4 w-4" />
                        Help & Support
                      </Link>

                      <div className="border-t border-[#e5e7eb] my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex gap-2 border-[#e5e7eb] text-[#374151] hover:border-[#10b981] hover:text-[#10b981] hover:bg-[#10b981]/5 transition-all duration-200"
                >
                  <User className="h-4 w-4" /> Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 pr-10 h-10 bg-[#f9fafb] border-[#e5e7eb] focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition-all duration-200"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-[#e5e7eb] rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-[#6b7280]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
