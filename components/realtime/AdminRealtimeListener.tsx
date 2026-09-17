"use client";

import { usePusher } from "@/hooks/usePusher";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/useToast";

export function AdminRealtimeListener() {
  const router = useRouter();

  usePusher("private-admin", "new_order", (data: any) => {
    // Show a toast and refresh the page (dashboard/orders list)
    toast({
      title: "New Order",
      description: `New order received! #${data.orderNumber}`,
    });
    router.refresh();
  });

  usePusher("private-admin", "order_updated", (data: any) => {
    // Refresh for any status changes happening elsewhere
    router.refresh();
  });

  usePusher("store-public", "stock_updated", (data: any) => {
    // Refresh inventory lists
    router.refresh();
  });

  return null;
}
