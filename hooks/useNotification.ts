import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/redux/slices/notificationSlice";

export const useNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount, total, isLoading } = useSelector(
    (state: RootState) => state.notifications
  );

  // Load notifications
  const loadNotifications = useCallback(
    async (params?: { limit?: number; offset?: number; unreadOnly?: boolean }) => {
      return dispatch(fetchNotifications(params)).unwrap();
    },
    [dispatch]
  );

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    return dispatch(fetchUnreadCount()).unwrap();
  }, [dispatch]);

  // Mark as read
  const markAsRead = useCallback(
    async (id: string) => {
      return dispatch(markNotificationAsRead(id)).unwrap();
    },
    [dispatch]
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    return dispatch(markAllNotificationsAsRead()).unwrap();
  }, [dispatch]);

  // Delete notification
  const deleteOne = useCallback(
    async (id: string) => {
      return dispatch(deleteNotification(id)).unwrap();
    },
    [dispatch]
  );

  // Auto-load on mount
  useEffect(() => {
    loadNotifications({ limit: 20 });
    loadUnreadCount();

    // Poll for new unread count every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadNotifications, loadUnreadCount]);

  return {
    notifications,
    unreadCount,
    total,
    isLoading,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteOne,
  };
};