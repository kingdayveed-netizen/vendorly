import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { notificationService } from "@/app/services/notification.service";
import { Notification } from "@/types/notifications";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  total: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (params?: { limit?: number; offset?: number; unreadOnly?: boolean }) => {
    const response = await notificationService.getNotifications(params);
    return response;
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async () => {
    const response = await notificationService.getUnreadCount();
    return response.count;
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markRead",
  async (id: string) => {
    await notificationService.markAsRead(id);
    return id;
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllRead",
  async () => {
    await notificationService.markAllAsRead();
    return true;
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id: string) => {
    await notificationService.deleteNotification(id);
    return id;
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.total = 0;
    },
    addNewNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      state.total += 1;
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.total = action.payload.total;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      })
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
        });
        state.unreadCount = 0;
      })
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deleted = state.notifications.find((n) => n.id === action.payload);
        if (deleted && !deleted.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter((n) => n.id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { clearNotifications, addNewNotification } = notificationSlice.actions;
export default notificationSlice.reducer;