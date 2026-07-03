"use client"

import * as React from "react"
import { Package, Tag, CreditCard, User, Circle } from "lucide-react"
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

const mockNotifications: Notification[] = [
  {
    id: "1",
    category: "ORDERS",
    title: "Order Delivered",
    body: "Your order #ORD-00231 has been delivered. Enjoy!",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: "2",
    category: "OFFERS",
    title: "Save 50% Today",
    body: "Use code SAVE50 at checkout for 50% off on your next order above ₹500.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  }
]

export function NotificationList({ initialNotifications }: { initialNotifications?: any[] }) {
  const [notifications, setNotifications] = React.useState<any[]>(initialNotifications || mockNotifications)

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center text-neutral-500">
        <BellIcon className="mb-2 h-8 w-8 opacity-20" />
        <p className="text-sm">No new notifications</p>
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
                {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
