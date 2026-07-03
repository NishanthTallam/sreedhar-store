"use client"

import * as React from "react"
import { Card } from "@/components/ui/Card"

interface ChartCardProps {
  title: string
  dateRangeSelector?: React.ReactNode
  children: React.ReactNode // The Recharts component
}

export function ChartCard({ title, dateRangeSelector, children }: ChartCardProps) {
  return (
    <Card className="flex flex-col p-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
        {dateRangeSelector && (
          <div>{dateRangeSelector}</div>
        )}
      </div>
      <div className="h-[300px] w-full min-w-0 flex-1">
        {children}
      </div>
    </Card>
  )
}
