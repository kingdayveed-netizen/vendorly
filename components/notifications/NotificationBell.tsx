"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, BellRing, Check, X } from "lucide-react";
import { useNotifications } from "@/hooks/useNotification";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteOne,
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.metadata?.orderId) {
      router.push(`/dashboard/orders/${notification.metadata.orderId}`);
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAllAsRead();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteOne(id);
  };

  const recentNotifications = notifications.slice(0, 10);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-5 w-5 text-green-600" />
        ) : (
          <Bell className="h-5 w-5 text-gray-600" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              recentNotifications.map((notification: any) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    relative px-4 py-3 border-b border-gray-100 cursor-pointer
                    hover:bg-gray-50 transition-colors
                    ${!notification.isRead ? "bg-blue-50" : ""}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${!notification.isRead ? "font-semibold" : "font-normal"} text-gray-900`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, notification.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/dashboard/notifications");
                }}
                className="text-xs text-green-600 hover:text-green-700"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
