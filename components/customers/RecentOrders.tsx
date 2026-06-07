"use client";

import { Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentOrdersProps {
  orders: any[];
  isLoading: boolean;
  onViewAll: () => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => JSX.Element;
}

export const RecentOrders = ({
  orders,
  isLoading,
  onViewAll,
  formatDate,
  formatCurrency,
  getStatusBadge,
}: RecentOrdersProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <Card className="md:col-span-2 border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2 border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          Recent Orders
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/5"
        >
          View All
        </Button>
      </CardHeader>

      <CardContent className="pt-4">
        {orders?.length > 0 ? (
          <div className="space-y-2">
            {orders.slice(0, 3).map((order, index) => (
              <div key={order.id} className="group relative overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 border border-transparent hover:border-primary/20"
                  onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                >
                  {/* Decorative left border on hover */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-left" />

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        Order #{order.orderNumber || order.id.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <span>{formatDate(order.createdAt)}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{order.finalQuantity || 0} items</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm font-bold text-primary whitespace-nowrap">
                      {formatCurrency(order.totalAmount || 0)}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-4 bg-gray-50 rounded-full mb-3">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              No orders yet
            </p>
            <p className="text-xs text-gray-500 text-center max-w-[200px]">
              When this customer places orders, they'll appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
