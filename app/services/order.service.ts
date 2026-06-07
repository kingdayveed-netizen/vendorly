import axiosInstance from "@/lib/axios";
import { store } from "@/redux/store";
import {
  setLoading,
  setUpdating,
  setError,
  setOrders,
  setStats,
  updateOrderInList,
  addOrder,
  removeOrderFromList,
  setSelectedOrder,
  setFilters,
} from "@/redux/slices/orderSlice";
import { Order, VendorStats, UpdateOrderPayload } from "@/types/order";

export const orderService = {
  // Track WhatsApp click
  trackWhatsAppClick: async (data: {
    productId: string;
    vendorId: string;
    customerName: string;
    customerPhone: string;
    customerId: string;
  }): Promise<Order> => {
    try {
      const response = await axiosInstance.post<Order>(
        "/orders/whatsapp/track",
        data,
      );
      store.dispatch(addOrder(response.data));
      return response.data;
    } catch (error) {
      console.error("Error tracking WhatsApp click:", error);
      throw error;
    }
  },

  // Get vendor orders with filters
  getVendorOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{ orders: Order[]; pagination: any }> => {
    try {
      const response = await axiosInstance.get("/orders/vendor", { params });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch orders";
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  // Get vendor stats
  getVendorStats: async (): Promise<VendorStats> => {
    try {
      const response = await axiosInstance.get<VendorStats>(
        "/orders/vendor/stats",
      );
      store.dispatch(setStats(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (
    orderId: string,
    data: UpdateOrderPayload,
  ): Promise<Order> => {
    try {
      store.dispatch(setUpdating(true));
      store.dispatch(setError(null));

      const response = await axiosInstance.patch<Order>(
        `/orders/${orderId}/status`,
        data,
      );
      await orderService.getVendorStats();

      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (orderId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/orders/${orderId}`);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },

  // Get single order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    try {
      store.dispatch(setLoading(true));

      const response = await axiosInstance.get<Order>(`/orders/${orderId}`);
      store.dispatch(setSelectedOrder(response.data));

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch order";
      store.dispatch(setError(errorMessage));
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  // Mark order as completed
  completeOrder: async (
    orderId: string,
    data: {
      finalQuantity: number;
      finalPricePerUnit: number;
      notes?: string;
    },
  ): Promise<Order> => {
    return orderService.updateOrderStatus(orderId, {
      status: "COMPLETED",
      ...data,
      orderId: "",
    });
  },

  // Cancel order
  cancelOrder: async (orderId: string, notes?: string): Promise<Order> => {
    return orderService.updateOrderStatus(orderId, {
      orderId,
      status: "CANCELLED",
      notes,
      finalQuantity: 0,
      finalPricePerUnit: 0,
    });
  },

  // Remove order from list
  removeOrder: (orderId: string): void => {
    store.dispatch(removeOrderFromList(orderId));
  },

  // Clear selected order
  clearSelectedOrder: (): void => {
    store.dispatch(setSelectedOrder(null));
  },

  // Set filters
  setFilters: (
    filters: Partial<{
      status: string;
      page: number;
      limit: number;
      search: string;
      dateFrom: string;
      dateTo: string;
    }>,
  ): void => {
    store.dispatch(setFilters(filters));
  },

  // Clear error
  clearError: (): void => {
    store.dispatch(setError(null));
  },
};
