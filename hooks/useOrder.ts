import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { Order } from "@/types/order";
import { orderService } from "@/app/services/order.service";
import {
  addOrder,
  removeOrderFromList,
  setOrders,
  updateOrderInList,
} from "@/redux/slices/orderSlice";
import { setError } from "@/redux/slices/storeSlice";

interface CreateOrderData {
  productId: string;
  vendorId: string;
  customerName: string;
  customerPhone: string;
  customerId: string;
  productName: string;
}

export const useOrder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  //   const { user } = useSelector((state: RootState) => state.auth);

  const { orders, selectedOrder, isLoading, error } = useSelector(
    (state: RootState) => state.order,
  );

  // Mutation for creating a new order (tracking WhatsApp click)
  const createOrder = useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      const response = await orderService.trackWhatsAppClick(orderData);
      return response;
    },
    onSuccess: (data) => {
      dispatch(addOrder(data));
      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-stats"] });
    },
    onError: (error) => {
      dispatch(
        setError(
          error instanceof Error ? error.message : "Failed to create order",
        ),
      );
    },
  });

  // Query for fetching vendor orders with filters
  const getVendorOrders = useQuery({
    queryKey: ["vendor-orders"],
    queryFn: async () => {
      const response = await orderService.getVendorOrders();
      dispatch(
        setOrders({ orders: response.orders, pagination: response.pagination }),
      );
      return response;
    },
  });

  // Mutation for updating order status
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: any }) => {
      const response = await orderService.updateOrderStatus(orderId, data);
      return response;
    },
    onSuccess: (data) => {
      dispatch(updateOrderInList(data));
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-stats"] });
    },
    onError: (error) => {
      dispatch(
        setError(
          error instanceof Error ? error.message : "Failed to update order",
        ),
      );
    },
  });

  // mutation for deleting an order
  const deleteOrder = useMutation({
    mutationFn: async (orderId: string) => {
      await orderService.deleteOrder(orderId);
    },
    onSuccess: (_, orderId) => {
      dispatch(removeOrderFromList(orderId));
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error) => {
      dispatch(
        setError(
          error instanceof Error ? error.message : "Failed to delete order",
        ),
      );
    },
  });

  return {
    // data from redux
    orders,
    selectedOrder,
    isLoading,
    error,

    // actions
    createOrder: createOrder.mutateAsync,
    isCreating: createOrder.isPending,
    getVendorOrders: getVendorOrders.refetch,
    isFetchingOrders: getVendorOrders.isFetching,
    isError: getVendorOrders.isError,
    updateOrderStatus: updateOrderStatus.mutateAsync,
    isUpdating: updateOrderStatus.isPending,
    deleteOrder: deleteOrder.mutateAsync,
    isDeleting: deleteOrder.isPending,
  };
};
