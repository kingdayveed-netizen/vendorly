import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { customerService } from "@/app/services/customer.service";
import {
  setFilters,
  clearSelectedCustomer,
  resetFilters,
  setCustomers,
  setSelectedCustomer,
  setStats,
  setCustomerOrders
} from "@/redux/slices/customerSlice";
import { CustomerQueryParams } from "@/types/customer";


export const useCustomer = (customerId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  // Redux state
  const {
    customers,
    selectedCustomer,
    stats,
    customerOrders,
    pagination,
    isLoading,
    isFetchingOne,
    error,
    filters,
  } = useSelector((state: RootState) => state.customer);

  // Query for fetching customers
  const customersQuery = useQuery({
    queryKey: ["customers", filters],
    queryFn: async () => {
      const response = await customerService.getCustomers(filters);
      dispatch(
        setCustomers({
          customers: response.customers,
          pagination: response.pagination,
        }),
      );
      return response;
    },
  });

  // Query for fetching a customer
  const customerByIdQuery = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      const response = await customerService.getCustomerById(customerId!);
      dispatch(setSelectedCustomer(response));
      return response;
    },
    enabled: !!customerId, // This controls when the query runs
  });

  // Query for fetching customer stats
  const statsQuery = useQuery({
    queryKey: ["customer-stats"],
    queryFn: async () => {
      const response = await customerService.getCustomerStats();
      dispatch(setStats(response));
      return response;
    },
  });

  // Query for fetching customer orders
  const customerOrdersQuery = useQuery({
    queryKey: ["customer-orders", customerId],
    queryFn: async () => {
      const response = await customerService.getCustomerOrders(customerId!);
      dispatch(setCustomerOrders(response));
      return response;
    },
  });

  // Actions
  const updateFilters = (newFilters: Partial<CustomerQueryParams>) => {
    dispatch(setFilters(newFilters));
  };

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  const clearSelected = () => {
    dispatch(clearSelectedCustomer());
  };

  const refetchCustomers = () => {
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    queryClient.invalidateQueries({ queryKey: ["customer-stats"] });
  };

  return {
    // Data
    customers,
    selectedCustomer,
    stats,
    customerOrders,
    pagination,
    filters,

    // Loading states
    isLoading: isLoading || customersQuery.isLoading,
    isFetchingOne,
    isFetching: customersQuery.isFetching,
    isLoadingStats: statsQuery.isPending,
    isLoadingCustomer: customerByIdQuery.isPending,
    isLoadingCustomerOrders: customerOrdersQuery.isPending,

    customerOrdersQuery,

    // Error states
    error,

    // Actions
    updateFilters,
    resetAllFilters,
    clearSelected,
    refetchCustomers,

    // Direct service access (if needed)
    getCustomerOrders: customerService.getCustomerOrders.bind(customerService),
  };
};
