"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Package, Calendar, DollarSign } from "lucide-react";
import { CustomerDetailSkeleton } from "./FinanceSkeleton";
import { CustomerRevenueDetail } from "@/types/finance";

interface CustomerDetailModalProps {
  customer: CustomerRevenueDetail | null;
  isLoading: boolean;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  getInitials: (name: string) => string;
}

export const CustomerDetailModal = ({
  customer,
  isLoading,
  onClose,
  formatCurrency,
  formatDate,
  getInitials,
}: CustomerDetailModalProps) => {
  if (!customer && !isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Customer Details</h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <CustomerDetailSkeleton />
          ) : customer ? (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {getInitials(customer.customerName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {customer.customerName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {customer.customerEmail}
                  </p>
                  <p className="text-sm text-gray-500">
                    {customer.customerPhone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(customer.totalSpent)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {customer.orderCount} orders
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">First Order</p>
                        <p className="text-sm font-medium">
                          {formatDate(customer.firstOrderDate!)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Last Order</p>
                        <p className="text-sm font-medium">
                          {formatDate(customer.lastOrderDate!)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Orders List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customer.orders.map((order) => (
                      <div
                        key={order.orderId}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium">
                              Order #{order.orderNumber}
                            </span>
                          </div>
                          <Badge variant="outline" className="bg-primary/5">
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {formatDate(order.date)}
                          </span>
                          <span className="font-semibold">
                            {formatCurrency(order.amount)}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {order.items.length} items
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
