"use client"

import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Badge } from "@/components/ui/Badge"

const STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REJECTED"
]

const validNextStatus: Record<string, string[]> = {
  "PLACED": ["CONFIRMED", "REJECTED"],
  "CONFIRMED": ["PACKED"],
  "PACKED": ["OUT_FOR_DELIVERY"],
  "OUT_FOR_DELIVERY": ["DELIVERED"],
  "DELIVERED": [],
  "CANCELLED": [],
  "REJECTED": []
}

interface StatusUpdateControlProps {
  currentStatus: string
  onStatusChange: (newStatus: string) => void
  disabled?: boolean
}

export function StatusUpdateControl({ currentStatus, onStatusChange, disabled }: StatusUpdateControlProps) {
  const allowedNext = validNextStatus[currentStatus] || []

  if (allowedNext.length === 0) {
    // Read only badge if no transitions allowed
    return (
      <Badge 
        variant="status" 
        statusColor={currentStatus === 'DELIVERED' ? 'success' : currentStatus === 'CANCELLED' || currentStatus === 'REJECTED' ? 'danger' : 'neutral'}
      >
        {currentStatus}
      </Badge>
    )
  }

  return (
    <Select 
      value={currentStatus} 
      onValueChange={onStatusChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px] h-8">
        <SelectValue placeholder="Update Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={currentStatus}>{currentStatus} (Current)</SelectItem>
        {allowedNext.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
