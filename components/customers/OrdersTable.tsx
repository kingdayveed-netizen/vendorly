"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Package } from "lucide-react";

interface OrdersTableProps {
  orders: any[];
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => JSX.Element;
  getPaymentStatusBadge: (status: string) => JSX.Element;
}

export const OrdersTable = ({ 
  orders, 
  formatDate, 
  formatCurrency,
  getStatusBadge,
  getPaymentStatusBadge 
}: OrdersTableProps) => {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium mb-1">No orders found</h3>
            <p className="text-sm text-gray-500">
              This customer hasn't placed any orders yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                >
                  <TableCell className="font-medium">
                    #{order.orderNumber || order.id}
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{order.finalQuantity || 0} items</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell> 
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/orders/${order.id}`);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};