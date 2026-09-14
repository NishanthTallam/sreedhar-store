"use client"

import * as React from "react"
import { Package, Tag, CreditCard, User, Circle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
  ORDERS: Package,
  OFFERS: Tag,
  PAYMENTS: CreditCard,
  ACCOUNT: User,
  RESTOCK: Package,
  PRICE_DROP: Tag,
}

interface Notification {
  id: string
  category: keyof typeof iconMap
  title: string
  body: string
  isRead: boolean
  createdAt: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export function NotificationList({ initialNotifications }: { initialNotifications?: Notification[] }) {
  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications || [])
  const [loading, setLoading] = React.useState(!initialNotifications)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch from API if no initial data was provided (client-side render, e.g. in a drawer)
  React.useEffect(() => {
    if (initialNotifications) return
    const fetchNotifications = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/notifications")
        if (!res.ok) throw new Error("Failed to load")
        const json = await res.json()
        setNotifications(json.data || [])
      } catch (err) {
        setError("Could not load notifications.")
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [initialNotifications])

  const markAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      })
    } catch {
      // silently fail – optimistic update stays
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 text-neutral-400">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <p className="text-sm">Loading notifications…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-40 flex-col items-center justify-center text-red-500">
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center text-neutral-500">
        <BellIcon className="mb-2 h-8 w-8 opacity-20" />
        <p className="text-sm">No notifications yet</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {notifications.map((notification) => {
        const Icon = iconMap[notification.category as keyof typeof iconMap] || BellIcon

        return (
          <button
            key={notification.id}
            onClick={() => !notification.isRead && markAsRead(notification.id)}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-500",
              !notification.isRead ? "bg-brand-50/50" : "bg-transparent"
            )}
          >
            <div className={cn(
              "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              !notification.isRead ? "bg-brand-100 text-brand-600" : "bg-neutral-100 text-neutral-500"
            )}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className={cn("text-sm font-semibold", !notification.isRead ? "text-neutral-900" : "text-neutral-700")}>
                {notification.title}
              </h4>
              <p className="mt-0.5 line-clamp-2 text-sm text-neutral-600">
                {notification.body}
              </p>
              <span className="mt-1 block text-xs text-neutral-400">
                {timeAgo(notification.createdAt)}
              </span>
            </div>
            {!notification.isRead && (
              <Circle className="mt-2 h-2.5 w-2.5 fill-brand-500 text-brand-500" />
            )}
          </button>
        )
      })}
    </div>
  )
}

function BellIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}
