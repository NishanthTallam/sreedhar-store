"use client"

import * as React from "react"
import { RatingStars } from "@/components/ui/RatingStars"

interface Review {
  id: string
  userName: string
  rating: number
  comment?: string | null
  createdAt: string
}

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-neutral-500">
        No reviews yet. Be the first to review this product!
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {reviews.map((review) => (
        <div key={review.id} className="flex flex-col gap-2 border-b border-neutral-100 pb-6 last:border-0 last:pb-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-900">{review.userName}</span>
            <span className="text-xs text-neutral-400">
              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <RatingStars rating={review.rating} size="sm" />
          {review.comment && (
            <p className="text-sm text-neutral-600 leading-relaxed mt-1">
              {review.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
