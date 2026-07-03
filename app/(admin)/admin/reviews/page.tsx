import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { ReviewActions } from "@/components/admin/ReviewActions";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'fill-current' : 'fill-transparent stroke-current text-neutral-300'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Review Moderation</h1>
          <p className="text-sm text-neutral-500 mt-1">Approve or reject customer product reviews.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Rating</th>
              <th className="px-6 py-4 font-medium w-1/3">Comment</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-neutral-900">{review.user.name}</div>
                  <div className="text-xs text-neutral-500">{review.user.email}</div>
                </td>
                <td className="px-6 py-4 font-medium text-neutral-900">{review.product.name}</td>
                <td className="px-6 py-4">
                  <StarRating rating={review.rating} />
                </td>
                <td className="px-6 py-4 text-xs">
                  {review.comment ? (
                    <p className="line-clamp-2" title={review.comment}>{review.comment}</p>
                  ) : (
                    <span className="text-neutral-400 italic">No comment provided</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Badge 
                    statusColor={
                      review.status === "APPROVED" ? "success" : 
                      review.status === "REJECTED" ? "danger" : "warning"
                    }
                  >
                    {review.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <ReviewActions reviewId={review.id} currentStatus={review.status} />
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}