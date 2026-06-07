"use client";

import { useState } from "react";
import { Bell, Check, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotification";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteOne,
  } = useNotifications();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteOne(id);
    setDeletingId(null);
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    if (notification.metadata?.orderId) {
      window.location.href = `/dashboard/orders/${notification.metadata.orderId}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  const readNotifications = notifications.filter((n) => n.isRead);
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-600">
                You have {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Unread */}
      {unreadNotifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">NEW</h2>
          <div className="space-y-2">
            {unreadNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                onClick={handleNotificationClick}
                isDeleting={deletingId === notification.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Read */}
      {readNotifications.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">EARLIER</h2>
          <div className="space-y-2">
            {readNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                onClick={handleNotificationClick}
                isDeleting={deletingId === notification.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {notifications.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No notifications yet</p>
          <p className="text-sm text-gray-400 mt-1">
            When you receive notifications, they will appear here
          </p>
        </div>
      )}
    </div>
  );
}

// Card Component
function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
  isDeleting,
}: {
  notification: any;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (notification: any) => void;
  isDeleting: boolean;
}) {
  return (
    <div
      onClick={() => onClick(notification)}
      className={`
        bg-white rounded-lg shadow-sm border transition-all cursor-pointer
        hover:shadow-md
        ${!notification.isRead ? "border-l-4 border-l-green-500 bg-blue-50/30" : "border-gray-200"}
        ${isDeleting ? "opacity-50" : ""}
      `}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3
              className={`text-sm ${!notification.isRead ? "font-semibold" : "font-normal"} text-gray-900`}
            >
              {notification.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            <p className="text-xs text-gray-400 mt-2">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {!notification.isRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
                className="text-green-600 hover:text-green-700 text-xs flex items-center gap-1"
              >
                <Check className="h-3.5 w-3.5" />
                Mark read
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              disabled={isDeleting}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}