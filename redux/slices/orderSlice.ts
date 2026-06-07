import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, Pagination, VendorStats } from "@/types/order";

export interface OrderState {
  // Data
  orders: Order[];
  pagination: Pagination | null;
  selectedOrder: Order | null;
  stats: VendorStats | null;

  // UI States
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  // Filters
  filters: {
    status: string;
    page: number;
    limit: number;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

const initialState: OrderState = {
  orders: [],
  pagination: null,
  selectedOrder: null,
  stats: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  filters: {
    status: "PENDING",
    page: 1,
    limit: 20,
    search: "",
    dateFrom: "",
    dateTo: "",
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // set loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload;
    },

    // set error message
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // set orders data
    setOrders(
      state,
      action: PayloadAction<{ orders: Order[]; pagination: Pagination }>,
    ) {
      state.orders = action.payload.orders;
      state.pagination = action.payload.pagination;
    },

    setStats: (state, action: PayloadAction<VendorStats | null>) => {
      state.stats = action.payload;
    },

    // Selected order
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },

    // Update single order in the list
    updateOrderInList: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = action.payload;
      }
    },

    // Remove order from list (if cancelled/deleted)
    removeOrderFromList: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
      if (state.selectedOrder?.id === action.payload) {
        state.selectedOrder = null;
      }
    },

    // Add new order (when tracking click)
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders = [action.payload, ...state.orders];
    },

    // Filters
    setFilters: (
      state,
      action: PayloadAction<Partial<OrderState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to page 1 when filters change
      if (
        action.payload.status !== undefined ||
        action.payload.search !== undefined ||
        action.payload.dateFrom !== undefined ||
        action.payload.dateTo !== undefined
      ) {
        state.filters.page = 1;
      }
    },

    // Reset filters to default
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Clear all data
    clearOrders: (state) => {
      state.orders = [];
      state.pagination = null;
      state.selectedOrder = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset entire state
    resetOrders: () => initialState,
  },
});

// Export actions
export const {
  setLoading,
  setUpdating,
  setError,
  setOrders,
  setStats,
  setSelectedOrder,
  updateOrderInList,
  removeOrderFromList,
  addOrder,
  setFilters,
  resetFilters,
  clearOrders,
  clearError,
  resetOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
