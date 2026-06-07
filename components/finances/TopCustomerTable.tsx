"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, User } from "lucide-react";
import { TopCustomersTableSkeleton } from "./FinanceSkeleton";
import { TopCustomer } from "@/types/finance";

interface TopCustomersTableProps {
  data: TopCustomer[];
  isLoading: boolean;
  onViewCustomer: (customerId: string) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | null) => string;
  getInitials: (name: string) => string;
}

export const TopCustomersTable = ({
  data,
  isLoading,
  onViewCustomer,
  formatCurrency,
  formatDate,
  getInitials,
}: TopCustomersTableProps) => {
  const [limit, setLimit] = useState(10);

  if (isLoading) return <TopCustomersTableSkeleton />;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Top Customers by Revenue</CardTitle>
        <select
          className="text-sm border rounded-md px-2 py-1"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.slice(0, limit).map((customer, index) => (
            <div
              key={customer.customerId}
              className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => onViewCustomer(customer.customerId)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center justify-center w-6 text-sm font-semibold text-gray-400">
                  #{index + 1}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(customer.customerName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{customer.customerName}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {customer.orderCount} orders • Last {formatDate(customer.lastOrderDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <span className="text-sm font-bold text-primary">
                  {formatCurrency(customer.totalSpent)}
                </span>
                <Badge variant="outline" className="bg-primary/5">
                  {customer.orderCount} orders
                </Badge>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};