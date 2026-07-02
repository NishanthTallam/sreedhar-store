"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BellIcon } from "@heroicons/react/24/outline";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/notifications?unread=true");
        if (res.ok) {
          const json = await res.json();
          setUnreadCount(json.data?.length || 0);
        }
      } catch (err) {
        console.error("Failed to fetch unread notifications", err);
      }
    };
    
    fetchUnread();
    
    // Optional: poll every 60s
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/account/notifications" className="relative p-2 text-surface-500 hover:text-surface-900 transition-colors">
      <BellIcon className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
