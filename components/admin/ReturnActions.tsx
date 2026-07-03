"use client";

import { useState, useTransition } from "react";
import { updateReturnStatus } from "@/app/(admin)/admin/actions";

export function ReturnActions({ returnId, currentStatus }: { returnId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  if (currentStatus !== "REQUESTED") {
    return <span className="text-sm font-medium text-neutral-500">Processed</span>;
  }

  const handleAction = (status: "APPROVED" | "REJECTED") => {
    if (confirm(`Are you sure you want to ${status.toLowerCase()} this return?`)) {
      startTransition(async () => {
        await updateReturnStatus(returnId, status);
      });
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction("APPROVED")}
        disabled={isPending}
        className="px-3 py-1.5 text-xs font-medium text-white bg-success-600 rounded-md hover:bg-success-700 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => handleAction("REJECTED")}
        disabled={isPending}
        className="px-3 py-1.5 text-xs font-medium text-white bg-danger-600 rounded-md hover:bg-danger-700 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
