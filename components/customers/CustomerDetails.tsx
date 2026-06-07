"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Customer } from "@/types/customer";

interface CustomerDetailsProps {
  customer: Customer;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

export const CustomerDetails = ({ customer, formatDate, formatCurrency }: CustomerDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Customer Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Full Name</p>
            <p className="font-medium">{customer.fullName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Email Address</p>
            <p className="font-medium">{customer.email || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Phone Number</p>
            <p className="font-medium">{customer.phone || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Address</p>
            <p className="font-medium">{customer.address || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Customer Since</p>
            <p className="font-medium">{formatDate(customer.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Last Order</p>
            <p className="font-medium">
              {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : "Never"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Orders</p>
            <p className="font-medium">{customer.totalOrders || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Spent</p>
            <p className="font-medium">{formatCurrency(customer.totalSpent)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};