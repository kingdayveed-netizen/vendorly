export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata: {
    orderId?: string;
    orderNumber?: string;
    productName?: string;
    reminderCount?: number;
    customerName?: string;
    amount?: number;
  };
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
}