// components/orders/UpdateOrderModal.tsx
"use client";

import React, { useState } from "react";
import { Order } from "@/types/order";
import { useOrder } from "@/hooks/useOrder";
import {
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  User,
  Phone,
  ShoppingBag,
  Calendar,
  Edit3,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

interface UpdateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onUpdate: () => void;
}

const UpdateOrderModal: React.FC<UpdateOrderModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdate,
}) => {
  const { updateOrderStatus, isUpdating } = useOrder();
  const [status, setStatus] = useState<"COMPLETED" | "CANCELLED" | null>(null);
  const [formData, setFormData] = useState({
    finalQuantity: order.finalQuantity || 1,
    finalPricePerUnit: order.finalPricePerUnit || 0,
    notes: order.notes || "",
  });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!status) {
      setError("Please select an action (Complete or Cancel)");
      return;
    }

    try {
      if (status === "COMPLETED") {
        // Validation for completed orders
        if (!formData.finalQuantity || formData.finalQuantity <= 0) {
          setError("Quantity must be greater than 0");
          return;
        }
        if (!formData.finalPricePerUnit || formData.finalPricePerUnit <= 0) {
          setError("Price must be greater than 0");
          return;
        }

        await updateOrderStatus({
          orderId: order.id,
          data: {
            status: "COMPLETED",
            finalQuantity: formData.finalQuantity,
            finalPricePerUnit: formData.finalPricePerUnit,
            notes: formData.notes || undefined,
          },
        });
      } else {
        // For cancelled orders
        await updateOrderStatus({
          orderId: order.id,
          data: {
            status: "CANCELLED",
            notes: formData.notes || undefined,
          },
        });
      }

      onUpdate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProductName = (order: Order): string => {
    if (order.orderItems && order.orderItems.length > 0) {
      return order.orderItems[0]?.product?.name || "Unknown Product";
    }
    return "Unknown Product";
  };

  const totalAmount = formData.finalQuantity * formData.finalPricePerUnit;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">
                Update Order
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Order Summary Card */}
            <Card className="mb-6 bg-gray-50 border-gray-200">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Order Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <ShoppingBag className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 font-medium">
                        Product:
                      </span>
                      <span className="text-gray-900">
                        {getProductName(order)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 font-medium">
                        Customer:
                      </span>
                      <span className="text-gray-900">
                        {order.customerName || "Anonymous"}
                      </span>
                    </div>
                    {order.customerPhone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 font-medium">
                          Phone:
                        </span>
                        <span className="text-gray-900">
                          {order.customerPhone}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 font-medium">Date:</span>
                      <span className="text-gray-900">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600 font-medium">
                        Order ID:
                      </span>
                      <span className="text-gray-900">
                        #{order.id.slice(-8)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600 font-medium">
                        Current Status:
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "PENDING"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Update Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setStatus("COMPLETED")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    status === "COMPLETED"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50 text-gray-600"
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Complete Order</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("CANCELLED")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    status === "CANCELLED"
                      ? "border-rose-500 bg-rose-50 text-rose-700"
                      : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/50 text-gray-600"
                  }`}
                >
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Cancel Order</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === "COMPLETED" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Final Quantity <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.finalQuantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            finalQuantity: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Per Unit (₦){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="100"
                        value={formData.finalPricePerUnit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            finalPricePerUnit: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full"
                        required
                      />
                    </div>
                  </div>

                  {/* Total Amount Preview */}
                  {formData.finalQuantity > 0 &&
                    formData.finalPricePerUnit > 0 && (
                      <Card className="bg-emerald-50 border-emerald-200">
                        <div className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-emerald-600 font-medium">
                                Total Amount
                              </p>
                              <p className="text-xs text-emerald-500">
                                {formData.finalQuantity} ×{" "}
                                {formatCurrency(formData.finalPricePerUnit)}
                              </p>
                            </div>
                            <p className="text-xl font-bold text-emerald-700">
                              {formatCurrency(totalAmount)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}
                </>
              )}

              {/* Notes Field (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  placeholder={
                    status === "COMPLETED"
                      ? "Add any notes about the completed order..."
                      : "Add a reason for cancellation (optional)..."
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 mt-6">
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating || !status}
                    className="min-w-[120px]"
                  >
                    {isUpdating ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating...
                      </div>
                    ) : (
                      "Update Order"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderModal;
