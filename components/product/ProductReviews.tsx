"use client";

import { useEffect, useState } from "react";
import { Star, User, X } from "lucide-react";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
}

interface Props {
  productId: string;
}

export default function ProductReviews({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("yog_user");
    if (userStr) setUser(JSON.parse(userStr));
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to leave a review");
      return;
    }

    setIsSubmitting(true);
    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr || "",
        },
        body: JSON.stringify({
          productId,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Review submitted successfully!");
        setShowForm(false);
        setReviewForm({ rating: 5, comment: "" });
        fetchReviews();
      } else {
        alert(`❌ ${data.error || "Failed to submit review"}`);
      }
    } catch (error) {
      alert("❌ Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="border-t border-gray-200 pt-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Customer Reviews
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-800 text-sm"
        >
          Write a Review
        </button>
      </div>

      {/* Stats */}
      {stats && stats.totalReviews > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={
                      star <= Math.round(stats.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Based on {stats.totalReviews} reviews
              </p>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${(stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {
                      stats.ratingDistribution[
                        rating as keyof typeof stats.ratingDistribution
                      ]
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{review.userName}</p>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Star size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 mb-4">No reviews yet</p>
            <p className="text-sm text-gray-500">
              Be the first to review this product
            </p>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Write a Review</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={
                          star <= reviewForm.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Your Review
                </label>
                <textarea
                  required
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  placeholder="Tell us about your experience..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 disabled:bg-gray-400"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
