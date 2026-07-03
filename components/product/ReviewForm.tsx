"use client"

import * as React from "react"
import { RatingStars } from "@/components/ui/RatingStars"
import { Button } from "@/components/ui/Button"

interface ReviewFormProps {
  productId: string
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>
}

export function ReviewForm({ productId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = React.useState(0)
  const [comment, setComment] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      await onSubmit({ rating, comment })
      setIsSuccess(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-lg bg-brand-50 p-6 text-center">
        <h4 className="text-sm font-semibold text-brand-700">Review Submitted!</h4>
        <p className="mt-1 text-xs text-brand-600">
          Thank you for your feedback. It will be visible once approved.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
      <div>
        <h4 className="text-sm font-semibold text-neutral-900">Rate this product</h4>
        <div className="mt-2">
          <RatingStars rating={rating} size="lg" interactive onRatingChange={setRating} />
        </div>
      </div>
      
      <div>
        <label htmlFor="comment" className="mb-2 block text-sm font-medium text-neutral-700">
          Write a review (optional)
        </label>
        <textarea
          id="comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="What did you like or dislike?"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={rating === 0 || isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  )
}
