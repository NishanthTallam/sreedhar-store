import * as React from "react"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  trend?: number // percentage
  trendLabel?: string
  className?: string
}

export function KpiCard({ title, value, trend, trendLabel, className }: KpiCardProps) {
  const isPositive = trend && trend > 0
  const isNegative = trend && trend < 0

  return (
    <Card className={cn("flex flex-col gap-2 p-5", className)}>
      <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
      <div className="flex items-end gap-3">
        <p className="text-2xl font-bold text-neutral-900 md:text-3xl">{value}</p>
        
        {trend !== undefined && (
          <div className="flex items-center gap-1 mb-1">
            <span
              className={cn(
                "flex items-center text-xs font-medium",
                isPositive ? "text-success-500" : isNegative ? "text-danger-500" : "text-neutral-500"
              )}
            >
              {isPositive ? (
                <ArrowUpIcon className="h-3 w-3 mr-0.5" />
              ) : isNegative ? (
                <ArrowDownIcon className="h-3 w-3 mr-0.5" />
              ) : null}
              {Math.abs(trend)}%
            </span>
            {trendLabel && (
              <span className="text-xs text-neutral-400">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
