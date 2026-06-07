"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import { LogOut, User, ShoppingBag, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  // During SSR and initial hydration, render a consistent loading state
  if (!isHydrated) {
    return (
      <>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100 shadow-sm">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo skeleton */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-8 w-8 bg-gradient-to-br from-green-100 to-green-200 rounded-xl animate-pulse"></div>
                  <ShoppingBag className="h-4 w-4 text-green-400 absolute inset-2" />
                </div>
                <div className="h-6 w-28 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md animate-pulse"></div>
              </div>

              {/* Desktop skeleton */}
              <div className="hidden md:flex items-center gap-4">
                <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-9 w-24 bg-gradient-to-r from-green-200 to-green-300 rounded-lg animate-pulse"></div>
              </div>

              {/* Mobile menu button skeleton */}
              <div className="md:hidden h-9 w-9 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      <div className="h-px bg-gray-300"></div>
      <nav className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Always visible */}
            <Link 
              href="/" 
              className="flex items-center gap-2 flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                className="h-6 w-6 sm:h-7 sm:w-7"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-lg sm:text-xl font-bold text-gray-800">Vendorly</span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {user?.role === "VENDOR" ? (
                    <Link
                      href="/dashboard"
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/explore"
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
                    >
                      Explore
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate max-w-[150px]">
                      {user?.vendor?.storeName || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 border-red-600 hover:bg-red-50 whitespace-nowrap"
                  >
                    <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-gray-700 hover:text-gray-900 whitespace-nowrap"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors whitespace-nowrap"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/50 transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Mobile Menu Panel */}
        <div
          className={`
            md:hidden fixed top-16 right-0 bottom-0 w-full max-w-sm bg-white shadow-xl z-50
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="flex-1 px-4 py-6 space-y-6">
              {isAuthenticated ? (
                <>
                  {/* User Info Card */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.vendor?.storeName || user?.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Menu Items */}
                  <div className="space-y-2">
                    {user?.role === "VENDOR" ? (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    ) : (
                      <Link
                        href="/explore"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        <span className="font-medium">Explore</span>
                      </Link>
                    )}
                  </div>

                  {/* Logout Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}