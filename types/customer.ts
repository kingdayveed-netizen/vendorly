export interface Customer {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  createdAt: string;
  orders?: Order[];
}

export interface Order {
  id: string;
  orderNumber: string;
  total: number | null;
  status: string;
  createdAt: string;
  items: any[];
}

// export interface CustomerDetail extends Customer {
//   orders: Order[];
// }

export interface CustomerStats {
  totalCustomers: number;
  newCustomers30d: number;
}

export interface CustomersResponse {
  customers: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CustomerQueryParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}