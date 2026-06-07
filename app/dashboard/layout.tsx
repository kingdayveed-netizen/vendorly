"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  Wallet,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Copy,
  Check,
  ExternalLink,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "@/components/notifications/NotificationBell";

// Shadcn UI components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Finances",
    href: "/dashboard/finances",
    icon: Wallet,
  },
  {
    title: "Explore",
    href: "/explore",
    icon: Compass,
  },
  {
    title: "Account",
    href: "/dashboard/account",
    icon: Wallet,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

// Copy button component - UPDATED WITH GREEN COLORS
const CopyButton = ({ storeUrl }: { storeUrl: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleCopy}
          className={cn(
            "p-1 rounded-md transition-all",
            copied
              ? "bg-green-100 text-green-600"
              : "text-green-500 hover:text-green-700 hover:bg-green-50",
          )}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{copied ? "Copied!" : "Copy store link"}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
      // Auto close sidebar on small screens
      if (window.innerWidth < 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileSidebarOpen, sidebarOpen]);

  // During SSR and initial hydration, render without user-dependent content
  if (!mounted) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Sidebar */}
          <aside className="fixed top-0 left-0 z-30 h-full bg-white border-r border-gray-200 w-64">
            {/* Sidebar header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="font-bold text-gray-800">Vendorly</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-green-50 text-green-600"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isActive && "text-green-600",
                      )}
                    />
                    <span className="flex-1 text-sm font-medium">
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Settings and Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 mt-10">
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700">
                  <Settings className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Settings</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700">
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Logout</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:ml-64">
            {/* Top bar */}
            <header className="sticky top-0 z-10 bg-white border-b border-gray-200 h-16">
              <div className="flex items-center justify-between h-16 px-4">
                <button className="p-2 rounded-lg lg:hidden">
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
                <div className="flex-1" />
              </div>
            </header>

            {/* Page content */}
            <main className="p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 z-30 h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
            sidebarOpen ? "w-64" : "w-20",
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0",
          )}
        >
          {/* Sidebar header with close button for mobile */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div
              className={cn(
                "flex items-center gap-2",
                !sidebarOpen && "justify-center w-full",
              )}
            >
              <Link
                href="/"
                className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <span className="text-white font-bold text-lg">V</span>
              </Link>
              {sidebarOpen && (
                <Link href="/" className="text-lg font-bold text-gray-800">
                  Vendorly
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* X button for mobile sidebar */}
              {mobileSidebarOpen && (
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              )}
              {/* Chevron button for desktop */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight
                  className={cn(
                    "h-5 w-5 text-gray-500 transition-transform",
                    !sidebarOpen && "rotate-180",
                  )}
                />
              </button>
            </div>
          </div>

          {/* Navigation - with scroll for overflow */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative group",
                    isActive
                      ? "bg-green-50 text-green-600"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive && "text-green-600",
                    )}
                  />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-sm font-medium">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                      {item.title}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section - fixed at bottom with proper spacing */}
          <div className="flex-shrink-0 border-t border-gray-200 mt-auto">
            <div className="p-4 space-y-1">
              <button
                disabled
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 opacity-60 cursor-not-allowed",
                  !sidebarOpen && "justify-center",
                )}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">Settings</span>}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    Settings
                  </div>
                )}
              </button>
              <button
                onClick={logout}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors relative group",
                  !sidebarOpen && "justify-center",
                )}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">Logout</span>}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    Logout
                  </div>
                )}
              </button>
            </div>

            {/* User info - only visible when sidebar is open */}
            {sidebarOpen && user && (
              <div className="px-4 pb-4 pt-2">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.role === "VENDOR" ? "Vendor" : "Customer"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div
          className={cn(
            "transition-all duration-300",
            sidebarOpen ? "lg:ml-64" : "lg:ml-20",
            "ml-0",
          )}
        >
          {/* Top bar */}
          <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-3 sm:px-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>

              <div className="flex-1" />

              <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                {/* Store link with copy functionality - Desktop */}
                {user?.vendor?.storeSlug && (
                  <>
                    {/* Info text - hidden on mobile, visible on tablet and up */}
                    <div className="hidden sm:flex items-center gap-1 bg-blue-50 px-2 md:px-3 py-1.5 rounded-lg">
                      <span className="text-[10px] md:text-xs text-blue-700 whitespace-nowrap">
                        Click the copy icon to share your store link
                      </span>
                    </div>

                    {/* Store link and copy button */}
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-1.5 sm:px-2 md:px-3 py-1.5">
                      <Link
                        href={`/${user.vendor.storeSlug}`}
                        className="group flex items-center text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                        target="_blank"
                      >
                        <span className="hidden xs:inline">My Store</span>
                        <span className="xs:hidden">Store</span>
                        <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>

                      <CopyButton
                        storeUrl={`${process.env.NEXT_PUBLIC_CLIENT_URL}/${user.vendor.storeSlug}`}
                      />
                    </div>
                  </>
                )}

                {/* Separator - hidden on mobile */}
                {user?.vendor?.storeSlug && (
                  <div className="hidden sm:block w-px h-6 bg-gray-200" />
                )}

                {/* Notification Bell - responsive sizing */}
                <div className="scale-90 sm:scale-100">
                  <NotificationBell />
                </div>

                {/* Explore Marketplace Button - Desktop */}
                <Link href="/explore" className="hidden sm:block">
                  <button className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                    <Compass className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="text-xs md:text-sm font-medium">Explore</span>
                  </button>
                </Link>

                {/* Explore Marketplace Button - Mobile Icon Only */}
                <Link href="/explore" className="sm:hidden">
                  <button className="p-2 rounded-lg bg-[#10b981]/10 hover:bg-[#10b981]/20 transition-colors">
                    <Compass className="h-5 w-5 text-[#10b981]" />
                  </button>
                </Link>

                {/* Analytics button - hidden on tablet and below */}
                <button className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 relative">
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-3 sm:p-4 md:p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}