"use client"

import * as React from "react"
import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/Drawer"
import { NotificationList } from "./NotificationList"

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = React.useState(3) // mock

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="relative rounded-md p-2 text-neutral-600 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full p-0 px-1 text-[10px]" 
              statusColor="danger"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </button>
      </DrawerTrigger>
      <DrawerContent side="right" className="w-full sm:w-[400px]">
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {/* Mock notifications */}
          <NotificationList />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
