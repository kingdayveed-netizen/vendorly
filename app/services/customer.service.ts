import axiosInstance from "@/lib/axios";
import {
  CustomerStats,
  CustomersResponse,
  CustomerQueryParams,
  Customer,
} from "@/types/customer";

class CustomerService {
  // Get all customers with pagination, search, and sort
  async getCustomers(
    params: CustomerQueryParams = {},
  ): Promise<CustomersResponse> {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await axiosInstance.get(
      `/customers?${queryParams.toString()}`,
    );
    return response.data;
  }

  // Get customer by ID with their orders
  async getCustomerById(id: string): Promise<Customer> {
    const response = await axiosInstance.get(`/customers/${id}`);
    return response.data;
  }

  // Get customer stats
  async getCustomerStats(): Promise<CustomerStats> {
    const response = await axiosInstance.get("/customers/stats");
    return response.data;
  }

  // Get customer orders
  async getCustomerOrders(customerId: string) {
    const response = await axiosInstance.get(
      `/customers/${customerId}/orders`,
    );
    return response.data.orders;
  }
}

export const customerService = new CustomerService();