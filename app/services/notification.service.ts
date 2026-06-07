import axiosInstance from "@/lib/axios";
import { NotificationsResponse } from "@/types/notifications";

export const notificationService = {
  // Get all notifications
  getNotifications: async (params?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
  }) => {
    const response = await axiosInstance.get<NotificationsResponse>(
      "/notifications",
      {
        params,
      },
    );
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await axiosInstance.get<{ count: number }>(
      "/notifications/unread/count",
    );
    return response.data;
  },

  // Mark single notification as read
  markAsRead: async (id: string) => {
    const response = await axiosInstance.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await axiosInstance.put("/notifications/read/all");
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: string) => {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  },

  // Delete all read notifications
  deleteAllRead: async () => {
    const response = await axiosInstance.delete("/notifications/read/all");
    return response.data;
  },
};
