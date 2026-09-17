"use client";

import { usePusher } from "@/hooks/usePusher";
import { useRouter } from "next/navigation";

export function OrderRealtimeListener({ orderId }: { orderId: string }) {
  const router = useRouter();

  usePusher(`private-order-${orderId}`, "status_updated", () => {
    // Automatically re-fetch the Server Component data in the background
    router.refresh();
  });

  return null;
}
