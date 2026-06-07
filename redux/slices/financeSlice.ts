import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  RevenueOverview,
  TopCustomer,
  CustomerRevenueDetail,
  DailyRevenue,
  FinanceState,
} from "@/types/finance";

const initialState: FinanceState = {
  // Data
  overview: null,
  topCustomers: [],
  selectedCustomerDetail: null,
  dailyRevenue: [],

  // UI States
  isLoadingOverview: false,
  isLoadingTopCustomers: false,
  isLoadingCustomerDetail: false,
  isLoadingDailyRevenue: false,
  error: null,

  // Filters/Pagination
  topCustomersLimit: 10,
  dailyRevenueDays: 30,
};

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    // Loading states
    setLoadingOverview: (state, action: PayloadAction<boolean>) => {
      state.isLoadingOverview = action.payload;
    },

    setLoadingTopCustomers: (state, action: PayloadAction<boolean>) => {
      state.isLoadingTopCustomers = action.payload;
    },

    setLoadingCustomerDetail: (state, action: PayloadAction<boolean>) => {
      state.isLoadingCustomerDetail = action.payload;
    },

    setLoadingDailyRevenue: (state, action: PayloadAction<boolean>) => {
      state.isLoadingDailyRevenue = action.payload;
    },

    // Error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Revenue Overview
    setRevenueOverview: (
      state,
      action: PayloadAction<RevenueOverview | null>,
    ) => {
      state.overview = action.payload;
    },

    // Top Customers
    setTopCustomers: (state, action: PayloadAction<TopCustomer[]>) => {
      state.topCustomers = action.payload;
    },

    // Customer Detail
    setSelectedCustomerDetail: (
      state,
      action: PayloadAction<CustomerRevenueDetail | null>,
    ) => {
      state.selectedCustomerDetail = action.payload;
    },

    // Update specific customer in top customers list
    updateTopCustomer: (state, action: PayloadAction<TopCustomer>) => {
      const index = state.topCustomers.findIndex(
        (c) => c.customerId === action.payload.customerId,
      );
      if (index !== -1) {
        state.topCustomers[index] = action.payload;
      }
    },

    // Daily Revenue
    setDailyRevenue: (state, action: PayloadAction<DailyRevenue[]>) => {
      state.dailyRevenue = action.payload;
    },

    // Filters
    setTopCustomersLimit: (state, action: PayloadAction<number>) => {
      state.topCustomersLimit = action.payload;
    },

    setDailyRevenueDays: (state, action: PayloadAction<number>) => {
      state.dailyRevenueDays = action.payload;
    },

    // Clear selected customer
    clearSelectedCustomer: (state) => {
      state.selectedCustomerDetail = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset all filters to default
    resetFilters: (state) => {
      state.topCustomersLimit = initialState.topCustomersLimit;
      state.dailyRevenueDays = initialState.dailyRevenueDays;
    },

    // Reset entire state
    resetFinance: () => initialState,
  },
});

// Export actions
export const {
  setLoadingOverview,
  setLoadingTopCustomers,
  setLoadingCustomerDetail,
  setLoadingDailyRevenue,
  setError,
  setRevenueOverview,
  setTopCustomers,
  setSelectedCustomerDetail,
  updateTopCustomer,
  setDailyRevenue,
  setTopCustomersLimit,
  setDailyRevenueDays,
  clearSelectedCustomer,
  clearError,
  resetFilters,
  resetFinance,
} = financeSlice.actions;

export default financeSlice.reducer;
