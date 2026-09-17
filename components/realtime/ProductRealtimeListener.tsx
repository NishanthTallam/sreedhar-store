"use client";

import { usePusher } from "@/hooks/usePusher";
import { useRouter } from "next/navigation";

export function ProductRealtimeListener({ productId }: { productId?: string }) {
  const router = useRouter();

  usePusher("store-public", "product_updated", (data: any) => {
    // Refresh if it's the specific product or if we are on a listing page (no ID)
    if (!productId || data?.id === productId) {
      router.refresh();
    }
  });

  usePusher("store-public", "stock_updated", (data: any) => {
    // Stock updates only send variantId, so we just blindly refresh to get latest state
    router.refresh();
  });

  return null;
}
