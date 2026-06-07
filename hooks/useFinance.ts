import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { financeService } from "@/app/services/finance.service";
import {
  setRevenueOverview,
  setTopCustomers,
  setSelectedCustomerDetail,
  setDailyRevenue,
  setTopCustomersLimit,
  setDailyRevenueDays,
  clearSelectedCustomer,
  setError,
} from "@/redux/slices/financeSlice";

export const useFinance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  // Redux state
  const {
    overview,
    topCustomers,
    selectedCustomerDetail,
    dailyRevenue,
    isLoadingOverview,
    isLoadingTopCustomers,
    isLoadingCustomerDetail,
    isLoadingDailyRevenue,
    error,
    topCustomersLimit,
    dailyRevenueDays,
  } = useSelector((state: RootState) => state.finance);

  // Query for revenue overview
  const overviewQuery = useQuery({
    queryKey: ["finance", "overview"],
    queryFn: async () => {
      const response = await financeService.getRevenueOverview();
      dispatch(setRevenueOverview(response));
      return response;
    },
  });

  // Query for top customers
  const topCustomersQuery = useQuery({
    queryKey: ["finance", "top-customers", topCustomersLimit],
    queryFn: async () => {
      const response = await financeService.getTopCustomers(topCustomersLimit);
      dispatch(setTopCustomers(response));
      return response;
    },
  });

  // Query for customer revenue detail
  const customerDetailQuery = useQuery({
    queryKey: ["finance", "customer", selectedCustomerDetail?.customerId],
    queryFn: async () => {
      if (!selectedCustomerDetail?.customerId) return null;
      const response = await financeService.getCustomerRevenueDetail(selectedCustomerDetail.customerId);
      dispatch(setSelectedCustomerDetail(response));
      return response;
    },
    enabled: !!selectedCustomerDetail?.customerId,
  });

  // Query for daily revenue
  const dailyRevenueQuery = useQuery({
    queryKey: ["finance", "daily-revenue", dailyRevenueDays],
    queryFn: async () => {
      const response = await financeService.getDailyRevenue(dailyRevenueDays);
      dispatch(setDailyRevenue(response));
      return response;
    },
  });

  // Actions
  const fetchCustomerDetail = (customerId: string) => {
    // First, check if we already have this customer in topCustomers
    const existingCustomer = topCustomers.find(c => c.customerId === customerId);
    if (existingCustomer) {
      // Set as selected customer detail (will trigger the query)
      dispatch(setSelectedCustomerDetail(existingCustomer as any));
    } else {
      // Create a minimal customer object to trigger the query
      dispatch(setSelectedCustomerDetail({ customerId } as any));
    }
  };

  const updateTopCustomersLimit = (limit: number) => {
    dispatch(setTopCustomersLimit(limit));
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ["finance", "top-customers"] });
  };

  const updateDailyRevenueDays = (days: number) => {
    dispatch(setDailyRevenueDays(days));
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ["finance", "daily-revenue"] });
  };

  const clearSelected = () => {
    dispatch(clearSelectedCustomer());
    queryClient.removeQueries({ queryKey: ["finance", "customer"] });
  };

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["finance"] });
  };

  const refetchOverview = () => {
    queryClient.invalidateQueries({ queryKey: ["finance", "overview"] });
  };

  const refetchTopCustomers = () => {
    queryClient.invalidateQueries({ queryKey: ["finance", "top-customers"] });
  };

  const refetchDailyRevenue = () => {
    queryClient.invalidateQueries({ queryKey: ["finance", "daily-revenue"] });
  };

  return {
    // Data
    overview,
    topCustomers,
    selectedCustomerDetail,
    dailyRevenue,

    // Loading states
    isLoadingOverview: isLoadingOverview || overviewQuery.isLoading,
    isLoadingTopCustomers: isLoadingTopCustomers || topCustomersQuery.isLoading,
    isLoadingCustomerDetail: isLoadingCustomerDetail || customerDetailQuery.isLoading,
    isLoadingDailyRevenue: isLoadingDailyRevenue || dailyRevenueQuery.isLoading,

    // Fetching states (for background updates)
    isFetchingOverview: overviewQuery.isFetching,
    isFetchingTopCustomers: topCustomersQuery.isFetching,
    isFetchingCustomerDetail: customerDetailQuery.isFetching,
    isFetchingDailyRevenue: dailyRevenueQuery.isFetching,

    // Error states
    error,

    // Filters
    topCustomersLimit,
    dailyRevenueDays,

    // Query objects (if needed for advanced use cases)
    overviewQuery,
    topCustomersQuery,
    customerDetailQuery,
    dailyRevenueQuery,

    // Actions
    fetchCustomerDetail,
    updateTopCustomersLimit,
    updateDailyRevenueDays,
    clearSelected,
    refreshAll,
    refetchOverview,
    refetchTopCustomers,
    refetchDailyRevenue,

    // Direct service access
    getRevenueOverview: financeService.getRevenueOverview.bind(financeService),
    getTopCustomers: financeService.getTopCustomers.bind(financeService),
    getCustomerRevenueDetail: financeService.getCustomerRevenueDetail.bind(financeService),
    getDailyRevenue: financeService.getDailyRevenue.bind(financeService),
  };
};