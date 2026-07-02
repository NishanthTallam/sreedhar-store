"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function NotificationList({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="py-12 text-center text-surface-500 bg-white rounded-xl border border-surface-200">
        You have no notifications.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notif) => (
        <div 
          key={notif.id} 
          className={`p-4 rounded-xl border ${notif.isRead ? 'bg-surface-50 border-surface-200' : 'bg-white border-brand-200 shadow-sm'} transition-colors`}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                {!notif.isRead && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                <span className="text-xs font-semibold tracking-wider text-surface-500 uppercase">{notif.category}</span>
                <span className="text-xs text-surface-400">&bull; {formatDistanceToNow(new Date(notif.createdAt))} ago</span>
              </div>
              <h4 className={`text-base font-semibold ${notif.isRead ? 'text-surface-700' : 'text-surface-900'}`}>{notif.title}</h4>
              <p className={`text-sm ${notif.isRead ? 'text-surface-500' : 'text-surface-700'}`}>{notif.body}</p>
            </div>
            
            {!notif.isRead && (
              <button 
                onClick={() => markAsRead(notif.id)}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 whitespace-nowrap"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
