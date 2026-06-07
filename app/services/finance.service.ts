import axiosInstance from "@/lib/axios";
import {
  RevenueOverview,
  TopCustomer,
  CustomerRevenueDetail,
  DailyRevenue,
} from "@/types/finance";

export const financeService = {
  // Get revenue overview
  getRevenueOverview: async (): Promise<RevenueOverview> => {
    const response =
      await axiosInstance.get<RevenueOverview>("/finance/overview");
    return response.data;
  },

  // Get top customers by spending
  getTopCustomers: async (limit: number = 10): Promise<TopCustomer[]> => {
    const response = await axiosInstance.get<TopCustomer[]>(
      "/finance/top-customers",
      {
        params: { limit },
      },
    );
    return response.data;
  },

  // Get detailed revenue info for a specific customer
  getCustomerRevenueDetail: async (
    customerId: string,
  ): Promise<CustomerRevenueDetail> => {
    const response = await axiosInstance.get<CustomerRevenueDetail>(
      `/finance/customers/${customerId}`,
    );
    return response.data;
  },

  // Get daily revenue for the last X days
  getDailyRevenue: async (days: number = 30): Promise<DailyRevenue[]> => {
    const response = await axiosInstance.get<DailyRevenue[]>(
      "/finance/daily-revenue",
      {
        params: { days },
      },
    );
    return response.data;
  },
};
