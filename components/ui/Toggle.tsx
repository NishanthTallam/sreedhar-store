import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, ...props }, ref) => {
    const id = React.useId()
    return (
      <div className="flex items-center space-x-2">
        <label
          htmlFor={id}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-neutral-200 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 has-[:checked]:bg-brand-500 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
            className
          )}
        >
          <input
            type="checkbox"
            id={id}
            className="peer sr-only"
            ref={ref}
            {...props}
          />
          <span
            className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out peer-checked:translate-x-5"
          />
        </label>
        {label && (
          <span className="text-sm font-medium text-neutral-900 cursor-pointer select-none">
            {label}
          </span>
        )}
      </div>
    )
  }
)
Toggle.displayName = "Toggle"
