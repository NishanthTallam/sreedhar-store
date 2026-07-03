"use client";

import { Bell, Check, CheckCircle2 } from "lucide-react";
import { useTransition } from "react";
import { markAsRead, markAllAsRead } from "./actions";

interface Notification {
  id: string;
  title: string;
  body: string;
  category: string;
  isRead: boolean;
  createdAt: Date;
}

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  const [isPending, startTransition] = useTransition();

  const handleMarkAsRead = (id: string) => {
    startTransition(() => {
      markAsRead(id);
    });
  };

  const handleMarkAll = () => {
    startTransition(() => {
      markAllAsRead();
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          All Notifications {unreadCount > 0 && <span className="ml-2 bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">{unreadCount} new</span>}
        </h2>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAll}
            disabled={isPending}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
            No notifications available.
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id} 
              className={`p-4 rounded-xl border flex gap-4 ${notif.isRead ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'}`}
            >
              <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${notif.isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-sm font-semibold ${notif.isRead ? 'text-gray-900' : 'text-blue-900'}`}>
                      {notif.title}
                    </h3>
                    <p className={`text-sm mt-1 ${notif.isRead ? 'text-gray-500' : 'text-blue-800'}`}>
                      {notif.body}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-medium text-gray-400">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {notif.category}
                      </span>
                    </div>
                  </div>
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      disabled={isPending}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
