import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer, CustomerStats, CustomersResponse, Order } from "@/types/customer";

export interface CustomerState {
  // Data
  customers: Customer[];
  selectedCustomer: Customer | null;
  stats: CustomerStats | null;
  customerOrders: Order[]; 
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;

  // UI States
  isLoading: boolean;
  isFetchingOne: boolean;
  error: string | null;

  // Filters
  filters: {
    search: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    page: number;
    limit: number;
  };
}

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  customerOrders: [],
  stats: null,
  pagination: null,
  isLoading: false,
  isFetchingOne: false,
  error: null,
  filters: {
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 20,
  },
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setFetchingOne: (state, action: PayloadAction<boolean>) => {
      state.isFetchingOne = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set customers data
    setCustomers: (state, action: PayloadAction<CustomersResponse>) => {
      state.customers = action.payload.customers;
      state.pagination = action.payload.pagination;
    },

    // Set selected customer
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
    },

    // Set stats
    setStats: (state, action: PayloadAction<CustomerStats | null>) => {
      state.stats = action.payload;
    },

    // set orders for selected customer 
    setCustomerOrders: (state, action: PayloadAction<Order[]>) => {
      if (state.selectedCustomer) {
        state.customerOrders = action.payload
      }
    },
    // Update filters
    setFilters: (
      state,
      action: PayloadAction<Partial<CustomerState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to page 1 when filters change
      if (
        action.payload.search !== undefined ||
        action.payload.sortBy !== undefined ||
        action.payload.sortOrder !== undefined
      ) {
        state.filters.page = 1;
      }
    },

    // Clear selected customer
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Clear all data
    clearCustomers: (state) => {
      state.customers = [];
      state.pagination = null;
      state.selectedCustomer = null;
      state.stats = null;
    },
  },
});

export const {
  setLoading,
  setFetchingOne,
  setError,
  setCustomers,
  setSelectedCustomer,
  setStats,
  setFilters,
  clearSelectedCustomer,
  resetFilters,
  clearCustomers,
  setCustomerOrders
} = customerSlice.actions;

export default customerSlice.reducer;
