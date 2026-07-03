import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "stock" | "discount" | "status" | "role"
  statusColor?: "success" | "warning" | "danger" | "info" | "neutral"
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", statusColor, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          {
            "bg-neutral-100 text-neutral-900": variant === "default",
            "bg-accent-500 text-white": variant === "discount",
            "bg-neutral-800 text-white": variant === "role",
            "bg-success-500 text-white": statusColor === "success" || (variant === "stock" && statusColor !== "warning" && statusColor !== "danger"),
            "bg-warning-500 text-white": statusColor === "warning",
            "bg-danger-500 text-white": statusColor === "danger",
            "bg-info-500 text-white": statusColor === "info",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"
