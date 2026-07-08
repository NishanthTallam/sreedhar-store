"use client";

import { useTransition } from "react";
import { markAllAsRead } from "./actions";
import { CheckCheck } from "lucide-react";
import { useNotifications } from "@/components/providers/NotificationProvider";

export function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition();
  const { refreshNotifications } = useNotifications();

  return (
    <button 
      onClick={() => {
        startTransition(async () => {
          await markAllAsRead();
          await refreshNotifications();
        });
      }}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 transition-colors"
    >
      <CheckCheck className="h-4 w-4" />
      {isPending ? "Marking..." : "Mark all as read"}
    </button>
  );
}
