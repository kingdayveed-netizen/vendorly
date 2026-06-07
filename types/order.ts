export interface Order {
  id: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  type: "WHATSAPP";
  totalAmount?: number;
  customerName?: string;
  customerPhone?: string;
  finalQuantity?: number;
  finalPricePerUnit?: number;
  notes?: string;
  clickedAt: string;
  completedAt?: string;
  reminderSent: boolean;

  // Relationships
  vendorId: string;
  customerId?: string;
  orderItems: OrderItem[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}


export interface OrderItem {
  id: string;
  quantity?: number;
  price?: number;
  productId: string;
  product: {
    name: string;
    price: number;
    images: string[];
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface VendorStats {
  totalClicks: number;
  pendingOrders: number;
  completedOrders30d: number;
  revenue30d: number;
}

export interface UpdateOrderPayload {
  orderId: string;
  status: 'COMPLETED' | 'CANCELLED';
  finalQuantity: number;
  finalPricePerUnit: number;
  notes?: string;
}