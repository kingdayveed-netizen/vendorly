"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

// Type for the dashboard stats
interface DashboardStats {
  revenue: {
    total: number;
    percentageChange: number;
  };
  orders: {
    total: number;
    percentageChange: number;
  };
  products: {
    total: number;
    newThisMonth: number;
  };
  customers: {
    total: number;
    newThisMonth: number;
    percentageChange: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    items: any[];
    customerName: string;
    productName: string;
  }>;
}

// Single API call to get all dashboard data
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get("/dashboard/stats");
  return response.data;
};

// Helper function to abbreviate large numbers professionally
const abbreviateNumber = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `₦${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(1)}K`;
  }
  return `₦${amount.toLocaleString()}`;
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    COMPLETED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Completed",
    },
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
      label: "Pending",
    },
    PROCESSING: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-500",
      label: "Processing",
    },
    CANCELLED: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      dot: "bg-rose-500",
      label: "Cancelled",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-500",
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
};

// Stat Card Component - Professional with number abbreviation
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  trendDirection = "up",
  iconBgColor = "bg-emerald-50",
  iconColor = "text-emerald-600",
  isCurrency = false,
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: number;
  trendLabel?: string;
  trendDirection?: "up" | "down" | "neutral";
  iconBgColor?: string;
  iconColor?: string;
  isCurrency?: boolean;
}) => {
  const isPositive = trendDirection === "up";

  // Format the value appropriately
  const formattedValue =
    isCurrency && typeof value === "string"
      ? value // If it's already formatted currency, keep it
      : typeof value === "number" && isCurrency
        ? abbreviateNumber(value)
        : value;

  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 mr-4">
            <p className="text-sm font-medium text-gray-500 truncate">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {formattedValue}
              </span>
              {trend !== undefined && (
                <span
                  className={`flex items-center text-xs font-medium whitespace-nowrap ${
                    isPositive ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
            {trendLabel && (
              <p className="text-xs text-gray-400">{trendLabel}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconBgColor}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Professional order icon - consistent for all orders
const OrderIcon = () => {
  return (
    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-emerald-100">
      <Receipt className="h-5 w-5 text-emerald-600" />
    </div>
  );
};

// Skeleton Loader Component
const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header Skeleton */}
    <div className="space-y-2">
      <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
      <div className="h-5 w-64 bg-gray-200 rounded-lg"></div>
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-28 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Recent Orders Skeleton */}
    <Card className="border-0 shadow-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  // Single query for all dashboard data
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30000,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading skeleton during SSR and initial fetch
  if (!mounted || isLoading) {
    return <DashboardSkeleton />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Welcome section with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 sm:p-6 md:p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Dashboard Overview
          </h1>
          <p className="text-emerald-50 mt-1 sm:mt-2 flex items-center gap-2 text-sm sm:text-base">
            Welcome back,{" "}
            <span className="font-semibold truncate max-w-[150px] sm:max-w-[200px] md:max-w-none text-amber-100">
              {user?.vendor?.storeName}
            </span>
            <span className="text-xl sm:text-2xl ml-1">👋</span>
          </p>
        </div>

        {/* Decorative elements - adjusted for different screen sizes */}
        <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -translate-y-24 sm:-translate-y-32 translate-x-24 sm:translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-36 sm:w-48 h-36 sm:h-48 bg-emerald-400/20 rounded-full -translate-x-16 sm:-translate-x-24 translate-y-16 sm:translate-y-24"></div>
      </div>

      {/* Stats cards - Professional with number abbreviation */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card - Using abbreviation */}
        <StatCard
          title="Total Revenue"
          value={stats?.revenue?.total || 0}
          icon={DollarSign}
          trend={stats?.revenue?.percentageChange}
          trendLabel="vs last month"
          trendDirection={
            (stats?.revenue?.percentageChange || 0) >= 0 ? "up" : "down"
          }
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          isCurrency={true}
        />

        {/* Orders Card */}
        <StatCard
          title="Orders"
          value={stats?.orders?.total?.toLocaleString() || "0"}
          icon={ShoppingCart}
          trend={stats?.orders?.percentageChange}
          trendLabel="vs last month"
          trendDirection={
            (stats?.orders?.percentageChange || 0) >= 0 ? "up" : "down"
          }
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        {/* Products Card */}
        <StatCard
          title="Products"
          value={stats?.products?.total!}
          icon={Package}
          trend={stats?.products?.newThisMonth}
          trendLabel={`${stats?.products?.newThisMonth} new this month`}
          trendDirection="up"
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />

        {/* Customers Card */}
        <StatCard
          title="Customers"
          value={stats?.customers?.total || 0}
          icon={Users}
          trend={stats?.customers?.percentageChange}
          trendLabel={`${stats?.customers?.newThisMonth} new this month`}
          trendDirection={
            (stats?.customers?.percentageChange!) >= 0 ? "up" : "down"
          }
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Recent orders - Made fully responsive */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Recent Orders
            </CardTitle>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Updated just now
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {stats?.recentOrders?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No orders yet</p>
              <p className="text-gray-400 text-xs mt-1">
                When customers place orders, they'll appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats?.recentOrders?.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50/50 transition-colors duration-150 gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <OrderIcon />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="text-xs text-gray-500">Product:</span>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {order.productName}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                        <span className="text-xs text-gray-500">Customer:</span>
                        <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block w-fit">
                          {order.customerName || "Anonymous Customer"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between sm:justify-end gap-4 ml-0 sm:ml-4">
                    <StatusBadge status={order.status} />
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
