"use client";

import { ShoppingBag, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Customer } from "@/types/customer";
import { useMemo } from "react";

interface CustomerStatsProps {
  stats: Pick<Customer, "totalOrders" | "totalSpent">;
  orders?: Array<{ createdAt: string }>;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

export const CustomerStats = ({
  stats,
  orders,
  formatCurrency,
  formatDate,
}: CustomerStatsProps) => {
  const avgOrderValue =
    stats.totalOrders > 0 ? stats.totalSpent / stats.totalOrders : 0;

  // Calculate last order date from orders array
  const lastOrderDate = useMemo(() => {
    if (!orders || orders.length === 0) return null;

    // Find the most recent order by createdAt
    const latestOrder = orders.reduce((latest, order) => {
      return !latest || new Date(order.createdAt) > new Date(latest.createdAt)
        ? order
        : latest;
    });

    return latestOrder.createdAt; 
  }, [orders]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-lg font-semibold">{stats.totalOrders || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Spent</p>
              <p className="text-lg font-semibold text-emerald-600">
                {formatCurrency(stats.totalSpent)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg. Order</p>
              <p className="text-lg font-semibold">
                {formatCurrency(avgOrderValue)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Last Order</p>
              <p className="text-sm font-medium">
                {lastOrderDate ? formatDate(lastOrderDate) : "Never"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
