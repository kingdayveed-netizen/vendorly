"use client";

import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/redux/store";
import { queryClient } from "@/lib/queryClient";
import { ToastProvider } from "@/components/ui/Toast";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Navbar from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";


function ProtectedPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mb-8"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// Auth initializer component
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const { isLoading } = useAuth();

  const publicPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/verifyEmail",
  ];

  const protectedPaths = [
    "/dashboard",
    "/dashboard/products",
    "/dashboard/products/addProduct",
    "/profile",
    "/settings",
  ];

  const isPublicPage = publicPaths.includes(pathName);
  const isProtectedPage = protectedPaths.some((path) =>
    pathName.startsWith(path),
  );

  // If it's a protected page and still loading, show skeleton
  if (isLoading && isProtectedPage) {
    return <ProtectedPageSkeleton />;
  }

  // For public pages or when auth is loaded, render children
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  const authPaths = [
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/reset-password/validate",
    "/verifyEmail",
    "/dashboard/products",
    "/dashboard/products/addProduct",
    "/dashboard/orders",
    `/dashboard/orders/${pathName.split("/")[3]}`, 
    "/dashboard/customers",
    `/dashboard/customers/${pathName.split("/")[3]}`,
    "/dashboard/finances",
    "/dashboard/profile",
    "/dashboard/notifications",
  ];

  const isStorePage =
    pathName.split("/").length === 2 &&
    !authPaths.includes(pathName) &&
    pathName !== "/" &&
    !pathName.startsWith("/dashboard/");

  const shouldHideNavbar = authPaths.includes(pathName) || isStorePage;

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Toaster />  
            <ToastProvider>
              <TooltipProvider>
                <AuthInitializer>
                  {!shouldHideNavbar && <Navbar />}
                  <main className="min-h-screen bg-gray-50">{children}</main>
                </AuthInitializer>
              </TooltipProvider>
            </ToastProvider>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
