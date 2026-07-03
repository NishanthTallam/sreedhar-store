import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 mb-4">
        <Icon className="h-10 w-10 text-neutral-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-neutral-900">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-neutral-500">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
