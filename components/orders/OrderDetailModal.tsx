"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button  from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  User,
  Calendar,
  Phone,
  ShoppingBag,
  ExternalLink,
  X,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Hash,
} from "lucide-react";
import { Order } from "@/types/order";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

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
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg}`}>
      <config.icon className={`w-4 h-4 ${config.text}`} />
      <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
    </div>
  );
};

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const router = useRouter();

  const handleViewFullDetails = () => {
    onClose();
    router.push(`/dashboard/orders/${order.id}`);
  };

  // Get product details
  const product = order.orderItems?.[0]?.product;
  const productName = product?.name || "Unknown Product";
  const productImage = product?.images?.[0];
  const quantity = order.finalQuantity || order.orderItems?.[0]?.quantity || 1;
  const pricePerUnit = order.finalPricePerUnit || order.orderItems?.[0]?.price || product?.price || 0;
  const totalAmount = order.totalAmount || (quantity * pricePerUnit);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details</span>
            <StatusBadge status={order.status} />
          </DialogTitle>
          <DialogDescription>
            Complete information about this order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order ID and Type */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Order ID:</span>
              <span className="text-sm font-mono bg-background px-2 py-1 rounded">
                {order.id}
              </span>
            </div>
            <Badge variant="outline" className="capitalize">
              {order.type.toLowerCase()}
            </Badge>
          </div>

          {/* Product Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Package className="w-4 h-4" />
              Product Information
            </h3>
            <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
              {productImage ? (
                <img
                  src={productImage}
                  alt={productName}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">{productName}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="ml-2 font-medium">{quantity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Unit Price:</span>
                    <span className="ml-2 font-medium">{formatCurrency(pricePerUnit)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{order.customerName || "Anonymous"}</p>
              </div>
              {order.customerPhone && (
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {order.customerPhone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Order Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Total Amount</p>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Order Date</p>
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(order.createdAt)}
                </p>
              </div>
              {order.completedAt && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Completed Date</p>
                  <p className="text-sm flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    {formatDate(order.completedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Notes</h3>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Reminder Status */}
          {order.reminderSent && (
            <div className="p-3 bg-amber-50 text-amber-700 rounded-lg text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Reminder has been sent for this order
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleViewFullDetails}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Details
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;