import * as React from "react"
import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  max?: number
  className?: string
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export function RatingStars({
  rating,
  max = 5,
  className,
  size = "sm",
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null)
  
  const currentRating = hoverRating !== null ? hoverRating : rating

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const renderStar = (index: number) => {
    const isFull = currentRating >= index
    const isHalf = currentRating >= index - 0.5 && currentRating < index

    if (interactive) {
      return (
        <button
          key={index}
          type="button"
          onClick={() => onRatingChange?.(index)}
          onMouseEnter={() => setHoverRating(index)}
          onMouseLeave={() => setHoverRating(null)}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-sm"
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors",
              isFull ? "fill-warning-500 text-warning-500" : "fill-neutral-200 text-neutral-200 hover:fill-warning-300 hover:text-warning-300"
            )}
          />
        </button>
      )
    }

    return (
      <div key={index}>
        {isHalf ? (
          <StarHalf className={cn(sizeClasses[size], "fill-warning-500 text-warning-500")} />
        ) : (
          <Star
            className={cn(
              sizeClasses[size],
              isFull ? "fill-warning-500 text-warning-500" : "fill-neutral-200 text-neutral-200"
            )}
          />
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => renderStar(i + 1))}
    </div>
  )
}
