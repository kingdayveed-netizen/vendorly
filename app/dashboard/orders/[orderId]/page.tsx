"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrder } from "@/hooks/useOrder";
import { Order } from "@/types/order";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  User,
  Calendar,
  Phone,
  ShoppingBag,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Hash,
  Edit3,
  Trash2,
} from "lucide-react";
import UpdateOrderModal from "@/components/orders/UpdateOrderModal";

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
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Status badge component
const StatusBadge = ({ status }: { status: Order["status"] }) => {
  const statusConfig = {
    COMPLETED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: CheckCircle,
      label: "Completed",
    },
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      icon: Clock,
      label: "Pending",
    },
    CANCELLED: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      icon: XCircle,
      label: "Cancelled",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg}`}
    >
      <config.icon className={`w-4 h-4 ${config.text}`} />
      <span className={`text-sm font-medium ${config.text}`}>
        {config.label}
      </span>
    </div>
  );
};

const OrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { orders, getVendorOrders } = useOrder();
  const [order, setOrder] = useState<Order | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      await getVendorOrders();
      setLoading(false);
    };
    fetchOrder();
  }, []);

  useEffect(() => {
    if (orders && params.orderId) {
      const foundOrder = orders.find((o) => o.id === params.orderId);
      setOrder(foundOrder || null);
    }
  }, [orders, params.orderId]);

  const handleUpdateClick = () => {
    setIsUpdateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsUpdateModalOpen(false);
  };

  const handleOrderUpdated = () => {
    getVendorOrders();
  };

  const handleDelete = () => {
    // Implement delete logic
    console.log("Delete order:", order);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  The order you're looking for doesn't exist or has been
                  removed.
                </p>
                <Button onClick={() => router.push("/dashboard/orders")}>
                  View All Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get product details
  const product = order.orderItems?.[0]?.product;
  const productName = product?.name || "Unknown Product";
  const productImage = product?.images?.[0];
  const quantity = order.finalQuantity || order.orderItems?.[0]?.quantity || 1;
  const pricePerUnit =
    order.finalPricePerUnit ||
    order.orderItems?.[0]?.price ||
    product?.price ||
    0;
  const totalAmount = order.totalAmount || quantity * pricePerUnit;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Order Details</h1>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex gap-2">
            {order.status === "PENDING" && (
              <Button onClick={handleUpdateClick}>
                <Edit3 className="w-4 h-4 mr-2" />
                Update Order
              </Button>
            )}
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Order ID Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono font-medium">{order.id}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline" className="capitalize">
                  {order.type.toLowerCase()}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">Reminder Sent</span>
                <Badge variant={order.reminderSent ? "default" : "secondary"}>
                  {order.reminderSent ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Customer Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground text-sm">Name</span>
                <p className="font-medium text-lg">
                  {order.customerName || "Anonymous"}
                </p>
              </div>
              {order.customerPhone && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground text-sm">Phone</span>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {order.customerPhone}
                  </p>
                </div>
              )}
              {order.customerId && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground text-sm">
                    Customer ID
                  </span>
                  <p className="font-mono text-sm">{order.customerId}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Product Name
                    </p>
                    <p className="font-medium text-lg">{productName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p className="font-medium">{quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Price per Unit
                      </p>
                      <p className="font-medium">
                        {formatCurrency(pricePerUnit)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
                {order.completedAt && (
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-600">Completed Date</p>
                    <p className="font-medium flex items-center gap-2 text-emerald-700">
                      <CheckCircle className="w-4 h-4" />
                      {formatDate(order.completedAt)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes Card */}
          {order.notes && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm">{order.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Update Modal */}
        {order && (
          <UpdateOrderModal
            isOpen={isUpdateModalOpen}
            onClose={handleModalClose}
            order={order}
            onUpdate={handleOrderUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
