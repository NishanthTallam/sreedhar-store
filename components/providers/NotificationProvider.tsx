"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { usePusher } from "@/hooks/usePusher";

interface NotificationContextType {
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refreshNotifications = useCallback(async () => {
    if (!session) {
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/notifications?unread=true");
      if (res.ok) {
        const json = await res.json();
        setUnreadCount(json.data?.length || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  usePusher(
    session ? `private-user-${session.user.id}` : "",
    "notification",
    () => {
      refreshNotifications();
    }
  );

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshNotifications, isLoading }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
