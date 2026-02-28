"use client";

import { useEffect, useState } from "react";
import { Star, User, X, Pencil, Trash2 } from "lucide-react";

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
  onReviewChange?: (newRating: number, newCount: number) => void;
}

export default function ProductReviews({ productId, onReviewChange }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Delete state
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

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

  // Helper: notify parent of rating change
  const notifyParent = (updatedStats: ReviewStats) => {
    if (onReviewChange) {
      onReviewChange(
        updatedStats.totalReviews > 0
          ? Number(updatedStats.averageRating.toFixed(1))
          : 0,
        updatedStats.totalReviews,
      );
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
        const newReview: Review = {
          id: data.review.id,
          userName: user.name,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          verified: false,
          createdAt: new Date().toISOString(),
        };

        const newTotalReviews = (stats?.totalReviews || 0) + 1;
        const newAverageRating = stats
          ? (stats.averageRating * stats.totalReviews + reviewForm.rating) /
            newTotalReviews
          : reviewForm.rating;

        const newRatingDistribution = stats
          ? { ...stats.ratingDistribution }
          : { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        newRatingDistribution[
          reviewForm.rating as keyof typeof newRatingDistribution
        ]++;

        const newStats: ReviewStats = {
          totalReviews: newTotalReviews,
          averageRating: newAverageRating,
          ratingDistribution: newRatingDistribution,
        };

        setReviews([newReview, ...reviews]);
        setStats(newStats);
        notifyParent(newStats); // ✅ instantly update ProductInfo rating

        setShowForm(false);
        setReviewForm({ rating: 5, comment: "" });
      } else {
        alert(`❌ ${data.error || "Failed to submit review"}`);
      }
    } catch (error) {
      alert("❌ Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditOpen = (review: Review) => {
    setEditingReview(review);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    setIsEditing(true);

    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr || "",
        },
        body: JSON.stringify({
          reviewId: editingReview.id,
          rating: editForm.rating,
          comment: editForm.comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const updatedReviews = reviews.map((r) =>
          r.id === editingReview.id
            ? { ...r, rating: editForm.rating, comment: editForm.comment }
            : r,
        );
        setReviews(updatedReviews);

        // Recalculate stats
        if (stats) {
          const oldRating = editingReview.rating;
          const newRating = editForm.rating;
          const newDistribution = { ...stats.ratingDistribution };
          newDistribution[oldRating as keyof typeof newDistribution]--;
          newDistribution[newRating as keyof typeof newDistribution]++;
          const newAverage =
            (stats.averageRating * stats.totalReviews - oldRating + newRating) /
            stats.totalReviews;

          const newStats: ReviewStats = {
            ...stats,
            averageRating: newAverage,
            ratingDistribution: newDistribution,
          };
          setStats(newStats);
          notifyParent(newStats); // ✅ instantly update ProductInfo rating
        }

        setEditingReview(null);
      } else {
        alert(`❌ ${data.error || "Failed to update review"}`);
      }
    } catch (error) {
      alert("❌ Failed to update review");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async (reviewId: string, reviewRating: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setDeletingReviewId(reviewId);

    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch(`/api/reviews?reviewId=${reviewId}`, {
        method: "DELETE",
        headers: { "x-user-data": userStr || "" },
      });

      if (res.ok) {
        const updatedReviews = reviews.filter((r) => r.id !== reviewId);
        setReviews(updatedReviews);

        // Recalculate stats
        if (stats) {
          const newTotal = stats.totalReviews - 1;
          const newDistribution = { ...stats.ratingDistribution };
          newDistribution[reviewRating as keyof typeof newDistribution]--;
          const newAverage =
            newTotal > 0
              ? (stats.averageRating * stats.totalReviews - reviewRating) /
                newTotal
              : 0;

          const newStats: ReviewStats = {
            totalReviews: newTotal,
            averageRating: newAverage,
            ratingDistribution: newDistribution,
          };
          setStats(newStats);
          notifyParent(newStats); // ✅ instantly update ProductInfo rating
        }
      } else {
        const data = await res.json();
        alert(`❌ ${data.error || "Failed to delete review"}`);
      }
    } catch (error) {
      alert("❌ Failed to delete review");
    } finally {
      setDeletingReviewId(null);
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
                Based on {stats.totalReviews} review
                {stats.totalReviews !== 1 ? "s" : ""}
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
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (stats.ratingDistribution[
                            rating as keyof typeof stats.ratingDistribution
                          ] /
                            stats.totalReviews) *
                          100
                        }%`,
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
              className={`border border-gray-200 rounded-xl p-4 transition-opacity ${
                deletingReviewId === review.id ? "opacity-50" : "opacity-100"
              }`}
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

                <div className="flex items-center gap-2">
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

                  {/* Edit & Delete — only on user's own reviews */}
                  {user && review.userName === user.name && (
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        onClick={() => handleEditOpen(review)}
                        className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black transition-colors"
                        title="Edit review"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id, review.rating)}
                        disabled={deletingReviewId === review.id}
                        className="p-1.5 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete review"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Star size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 mb-2 font-semibold">No reviews yet</p>
            <p className="text-sm text-gray-500">
              Be the first to review this product
            </p>
          </div>
        )}
      </div>

      {/* Write Review Modal */}
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

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Review</h2>
              <button
                onClick={() => setEditingReview(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={
                          star <= editForm.rating
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
                  value={editForm.comment}
                  onChange={(e) =>
                    setEditForm({ ...editForm, comment: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isEditing}
                className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 disabled:bg-gray-400"
              >
                {isEditing ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
