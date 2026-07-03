"use client";

import { useTransition } from "react";
import { updateReviewStatus } from "@/app/(admin)/admin/actions";

export function ReviewActions({ reviewId, currentStatus }: { reviewId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (status: "APPROVED" | "REJECTED" | "PENDING") => {
    if (status === currentStatus) return;
    
    startTransition(async () => {
      await updateReviewStatus(reviewId, status);
    });
  };

  return (
    <div className="flex gap-2 justify-end">
      {currentStatus !== "APPROVED" && (
        <button
          onClick={() => handleAction("APPROVED")}
          disabled={isPending}
          className="px-3 py-1.5 text-xs font-medium text-white bg-success-600 rounded-md hover:bg-success-700 disabled:opacity-50"
        >
          Approve
        </button>
      )}
      {currentStatus !== "REJECTED" && (
        <button
          onClick={() => handleAction("REJECTED")}
          disabled={isPending}
          className="px-3 py-1.5 text-xs font-medium text-white bg-danger-600 rounded-md hover:bg-danger-700 disabled:opacity-50"
        >
          Reject
        </button>
      )}
      {currentStatus !== "PENDING" && (
        <button
          onClick={() => handleAction("PENDING")}
          disabled={isPending}
          className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-200 rounded-md hover:bg-neutral-300 disabled:opacity-50"
        >
          Reset
        </button>
      )}
    </div>
  );
}
