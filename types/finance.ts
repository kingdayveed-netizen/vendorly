export interface RevenueOverview {
  totalRevenue: number;
  monthlyRevenue: number;
  averageOrderValue: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface TopCustomer {
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string | null;
  firstOrderDate: string | null;
}

export interface CustomerRevenueDetail extends TopCustomer {
  orders: Array<{
    orderId: string;
    orderNumber: string;
    amount: number;
    date: string;
    status: string;
    items: Array<{
      productName: string;
      quantity: number;
      price: number;
    }>;
  }>;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface FinanceState {
  // Data
  overview: RevenueOverview | null;
  topCustomers: TopCustomer[];
  selectedCustomerDetail: CustomerRevenueDetail | null;
  dailyRevenue: DailyRevenue[];

  // UI States
  isLoadingOverview: boolean;
  isLoadingTopCustomers: boolean;
  isLoadingCustomerDetail: boolean;
  isLoadingDailyRevenue: boolean;
  error: string | null;

  // Filters/Pagination
  topCustomersLimit: number;
  dailyRevenueDays: number;
}
