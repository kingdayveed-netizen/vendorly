"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useOrder } from "@/hooks/useOrder";
import {
  Search,
  Filter,
  ShoppingBag,
  MoreVertical,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Order } from "@/types/order";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import Input from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UpdateOrderModal from "@/components/orders/UpdateOrderModal";
import OrderDetailsModal from "@/components/orders/OrderDetailModal";
import { toast } from "sonner";

// Format currency
const formatCurrency = (amount: number = 0) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get product name from order items
const getProductName = (order: Order): string => {
  if (order.orderItems && order.orderItems.length > 0) {
    return order.orderItems[0]?.product?.name || "Unknown Product";
  }
  return "Unknown Product";
};

// Calculate order total
const getOrderTotal = (order: Order): number => {
  if (order.totalAmount) {
    return order.totalAmount;
  }
  if (order.orderItems && order.orderItems.length > 0) {
    return order.orderItems.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const price = item.price || item.product?.price || 0;
      return sum + quantity * price;
    }, 0);
  }
  return 0;
};

// Status badge variant mapping
const getStatusVariant = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "PENDING":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    default:
      return "secondary";
  }
};

const OrdersPage = () => {
  const { orders, getVendorOrders, isFetchingOrders, deleteOrder } = useOrder();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "ALL">(
    "ALL",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] =
    useState<Order | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  useEffect(() => {
    getVendorOrders();
  }, []);

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders.filter((order: Order) => {
      const productName = getProductName(order);
      const matchesSearch =
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Paginate orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  // Stats
  const totalOrders = filteredOrders.length;
  const completedOrders = filteredOrders.filter(
    (o) => o.status === "COMPLETED",
  ).length;
  const pendingOrders = filteredOrders.filter(
    (o) => o.status === "PENDING",
  ).length;
  const cancelledOrders = filteredOrders.filter(
    (o) => o.status === "CANCELLED",
  ).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as Order["status"] | "ALL");
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateClick = (order: Order) => {
    setSelectedOrder(order);
    setIsUpdateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsUpdateModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOrderUpdated = () => {
    // Refresh orders after update
    getVendorOrders();
  };

  // handleUpdate function
  const handleUpdate = (order: Order) => {
    handleUpdateClick(order);
  };

  const handleDelete = async (order: Order) => {
    setDeletingOrderId(order.id);
    try {
      await deleteOrder(order.id);
      toast.success("Order deleted successfully", { position: "top-center" });
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Row click handler
  const handleRowClick = (order: Order) => {
    setSelectedOrderForDetails(order);
    setIsDetailsModalOpen(true);
  };

  // Details modal close handler
  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedOrderForDetails(null);
  };

  if (isFetchingOrders && !orders?.length) {
    return <OrdersPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">
              Manage and track all your orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-9 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter === "ALL" ? "All Status" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange("ALL")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("COMPLETED")}
                >
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("CANCELLED")}
                >
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cancelled
              </CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cancelledOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order: Order) => {
                    const isThisOrderDeleting = deletingOrderId === order.id;

                    return (
                      <TableRow
                        key={order.id}
                        className={`cursor-pointer hover:bg-muted/50 transition-all duration-200 ${
                          isThisOrderDeleting
                            ? "opacity-50 pointer-events-none bg-gray-50"
                            : ""
                        }`}
                        onClick={() =>
                          !isThisOrderDeleting && handleRowClick(order)
                        }
                      >
                        <TableCell className="font-medium">
                          #{order.id.slice(-8)}
                        </TableCell>
                        <TableCell>
                          {order.customerName || "Anonymous"}
                        </TableCell>
                        <TableCell>{getProductName(order)}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell className="font-semibold text-primary">
                          {formatCurrency(getOrderTotal(order))}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "COMPLETED"
                                ? "default"
                                : (getStatusVariant(order.status) as any)
                            }
                            className={
                              order.status === "COMPLETED"
                                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                : ""
                            }
                          >
                            {order.status.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={isThisOrderDeleting}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* Only show Update option if order is PENDING */}
                              {order.status === "PENDING" && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdate(order)}
                                  disabled={isThisOrderDeleting}
                                >
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Update
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDelete(order)}
                                className="text-destructive"
                                disabled={isThisOrderDeleting}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {isThisOrderDeleting ? "Deleting..." : "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No orders found</p>
                        <p className="text-sm text-muted-foreground">
                          {searchTerm || statusFilter !== "ALL"
                            ? "Try adjusting your filters"
                            : "When customers place orders, they'll appear here"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t">
              {/* Left side - Showing X to Y of Z orders & Page size selector */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, filteredOrders.length)} of{" "}
                  {filteredOrders.length} orders
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    Show
                  </span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value: string) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    per page
                  </span>
                </div>
              </div>

              {/* Right side - Pagination controls */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 w-full sm:w-auto">
                {/* First Page Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                >
                  <ChevronsLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>

                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>

                {/* Page Indicator - Mobile friendly */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Show first page on mobile if not too far */}
                  {currentPage > 3 && totalPages > 5 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        className="hidden sm:flex h-8 w-8 p-0"
                      >
                        1
                      </Button>
                      {currentPage > 4 && (
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                          ...
                        </span>
                      )}
                    </>
                  )}

                  {/* Page numbers - responsive */}
                  {(() => {
                    const pages = [];
                    const maxVisible = window.innerWidth < 640 ? 3 : 5;
                    let startPage = Math.max(
                      1,
                      currentPage - Math.floor(maxVisible / 2),
                    );
                    let endPage = Math.min(
                      totalPages,
                      startPage + maxVisible - 1,
                    );

                    if (endPage - startPage + 1 < maxVisible) {
                      startPage = Math.max(1, endPage - maxVisible + 1);
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={currentPage === i ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(i)}
                          className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${
                            currentPage === i
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                        >
                          {i}
                        </Button>,
                      );
                    }
                    return pages;
                  })()}

                  {/* Show last page on mobile if not too far */}
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                          ...
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="hidden sm:flex h-8 w-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                >
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>

                {/* Last Page Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                >
                  <ChevronsRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Update Order Modal */}
      {selectedOrder && (
        <UpdateOrderModal
          isOpen={isUpdateModalOpen}
          onClose={handleModalClose}
          order={selectedOrder}
          onUpdate={handleOrderUpdated}
        />
      )}

      {/* Order Details Modal */}
      {selectedOrderForDetails && (
        <OrderDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleDetailsModalClose}
          order={selectedOrderForDetails}
        />
      )}
    </div>
  );
};

// Skeleton Loader
const OrdersPageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    </header>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between mb-8">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-64 bg-muted rounded animate-pulse"></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 bg-muted rounded animate-pulse"
              ></div>
            ))}
          </div>
        </CardContent>
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
          <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
        </div>
      </Card>
    </div>
  </div>
);

export default OrdersPage;
