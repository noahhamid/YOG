"use client";
import { useEffect, useState } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  @keyframes pr-in { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:none} }
  @keyframes pr-spin { to{transform:rotate(360deg)} }
  @keyframes pr-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  .pr-wrap { font-family:'Sora',sans-serif; padding-top:24px; border-top:1px solid #e8e4de; }

  .pr-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; }
  .pr-title { font-size:20px; font-weight:800; color:#1a1714; letter-spacing:-0.5px; margin:0; }
  .pr-write-btn {
    padding:8px 18px; background:#1a1714; color:#fff; border:none; border-radius:20px;
    font-size:12px; font-weight:700; cursor:pointer; transition:all 0.15s;
    font-family:'Sora',sans-serif;
  }
  .pr-write-btn:hover { background:#333; transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,0.15); }

  /* Stats */
  .pr-stats { background:#f5f3f0; border-radius:16px; padding:22px; margin-bottom:22px; border:1px solid #e8e4de; }
  .pr-stats-grid { display:grid; grid-template-columns:auto 1fr; gap:24px; align-items:center; }
  .pr-avg-block { text-align:center; }
  .pr-avg-num { font-size:48px; font-weight:800; color:#1a1714; line-height:1; letter-spacing:-2px; }
  .pr-avg-stars { display:flex; justify-content:center; gap:3px; color:#eab308; margin:6px 0 4px; }
  .pr-avg-count { font-size:12px; color:#9e9890; }
  .pr-bars { display:flex; flex-direction:column; gap:7px; }
  .pr-bar-row { display:flex; align-items:center; gap:8px; }
  .pr-bar-label { display:flex; align-items:center; gap:3px; font-size:12px; font-weight:600; color:#9e9890; width:28px; flex-shrink:0; }
  .pr-bar-track { flex:1; height:7px; background:#e8e4de; border-radius:4px; overflow:hidden; }
  .pr-bar-fill { height:100%; background:#eab308; border-radius:4px; transition:width 0.5s ease; }
  .pr-bar-count { font-size:11px; color:#9e9890; width:18px; text-align:right; flex-shrink:0; }

  /* Review card */
  .pr-list { display:flex; flex-direction:column; gap:12px; }
  .pr-card { background:#fff; border:1px solid #e8e4de; border-radius:14px; padding:18px; transition:opacity 0.2s; }
  .pr-card.deleting { opacity:0.4; }
  .pr-card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; }
  .pr-card-left { display:flex; align-items:center; gap:11px; }
  .pr-avatar { width:38px; height:38px; border-radius:50%; background:#e8e4de; display:flex; align-items:center; justify-content:center; color:#9e9890; flex-shrink:0; font-size:14px; font-weight:700; color:#1a1714; text-transform:uppercase; }
  .pr-user-name { font-size:14px; font-weight:700; color:#1a1714; }
  .pr-verified { font-size:10px; font-weight:700; background:#dcfce7; color:#16a34a; padding:2px 8px; border-radius:10px; margin-left:6px; }
  .pr-date { font-size:11px; color:#9e9890; margin-top:2px; }
  .pr-card-right { display:flex; align-items:center; gap:6px; }
  .pr-stars { display:flex; gap:2px; color:#eab308; }
  .pr-actions-btns { display:flex; gap:4px; margin-left:4px; }
  .pr-action-btn { width:28px; height:28px; border-radius:7px; border:none; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; color:#9e9890; }
  .pr-action-btn:hover { background:#f5f3f0; color:#1a1714; }
  .pr-action-btn.delete:hover { background:#fef2f2; color:#dc2626; }
  .pr-comment { font-size:13px; color:#4a4540; line-height:1.65; }

  /* Empty */
  .pr-empty { text-align:center; padding:60px 24px; background:#f5f3f0; border-radius:16px; border:1.5px dashed #e8e4de; }
  .pr-empty-icon { width:56px; height:56px; background:#e8e4de; border-radius:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; color:#9e9890; }
  .pr-empty-title { font-size:16px; font-weight:700; color:#1a1714; margin:0 0 6px; }
  .pr-empty-sub { font-size:13px; color:#9e9890; margin:0; }

  /* Skeleton */
  .pr-skel { height:100px; background:linear-gradient(90deg,#f5f3f0 25%,#ede9e4 50%,#f5f3f0 75%); background-size:200% 100%; border-radius:14px; animation:pr-pulse 1.4s ease-in-out infinite; }

  /* Modal */
  .pr-modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.48); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(3px); }
  .pr-modal { background:#fff; border-radius:20px; max-width:420px; width:100%; padding:28px; animation:pr-in 0.25s cubic-bezier(0.22,1,0.36,1); }
  .pr-modal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; }
  .pr-modal-title { font-size:18px; font-weight:800; color:#1a1714; margin:0; letter-spacing:-0.4px; }
  .pr-modal-close { width:32px; height:32px; border-radius:50%; border:1.5px solid #e8e4de; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#9e9890; transition:all 0.15s; }
  .pr-modal-close:hover { border-color:#1a1714; color:#1a1714; }
  .pr-modal-label { font-size:12px; font-weight:700; color:#1a1714; display:block; margin-bottom:8px; }
  .pr-star-row { display:flex; gap:8px; margin-bottom:16px; }
  .pr-star-pick { background:none; border:none; cursor:pointer; padding:2px; transition:transform 0.1s; color:#e8e4de; }
  .pr-star-pick:hover { transform:scale(1.15); }
  .pr-star-pick.lit { color:#eab308; }
  .pr-modal-textarea { width:100%; padding:12px 14px; border:1.5px solid #e8e4de; border-radius:10px; font-family:'Sora',sans-serif; font-size:13px; color:#1a1714; outline:none; resize:none; transition:border-color 0.15s; box-sizing:border-box; }
  .pr-modal-textarea:focus { border-color:#1a1714; }
  .pr-modal-textarea::placeholder { color:#c4bfb8; }
  .pr-modal-submit { width:100%; padding:13px; border-radius:11px; border:none; background:#1a1714; color:#fff; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.15s; margin-top:16px; font-family:'Sora',sans-serif; display:flex; align-items:center; justify-content:center; gap:8px; }
  .pr-modal-submit:hover:not(:disabled) { background:#333; }
  .pr-modal-submit:disabled { background:#e8e4de; color:#9e9890; cursor:not-allowed; }
  .pr-spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:pr-spin 0.7s linear infinite; }
`;

const StarIco = ({
  filled,
  size = 14,
}: {
  filled?: boolean;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const XIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const EditIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const StarBigIco = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
}
interface Stats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
}
interface Props {
  productId: string;
  onReviewChange?: (r: number, c: number) => void;
}

function ReviewForm({
  title,
  rating,
  comment,
  onRating,
  onComment,
  onSubmit,
  onClose,
  submitting,
}: any) {
  return (
    <div className="pr-modal-backdrop" onClick={onClose}>
      <div className="pr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pr-modal-header">
          <h3 className="pr-modal-title">{title}</h3>
          <button className="pr-modal-close" onClick={onClose}>
            <XIcon />
          </button>
        </div>
        <label className="pr-modal-label">Your Rating</label>
        <div className="pr-star-row">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              className={`pr-star-pick ${s <= rating ? "lit" : ""}`}
              onClick={() => onRating(s)}
            >
              <StarIco size={28} filled={s <= rating} />
            </button>
          ))}
        </div>
        <label className="pr-modal-label">Your Review</label>
        <textarea
          className="pr-modal-textarea"
          rows={5}
          placeholder="Tell us about your experience…"
          value={comment}
          onChange={(e) => onComment(e.target.value)}
          required
        />
        <button
          className="pr-modal-submit"
          onClick={onSubmit}
          disabled={submitting || !comment.trim()}
        >
          {submitting ? (
            <>
              <div className="pr-spinner" />
              Submitting…
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </div>
  );
}

export default function ProductReviews({ productId, onReviewChange }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const u = localStorage.getItem("yog_user");
    if (u) setUser(JSON.parse(u));
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const r = await fetch(`/api/reviews?productId=${productId}`);
      const d = await r.json();
      if (r.ok) {
        setReviews(d.reviews);
        setStats(d.stats);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const notify = (s: Stats) => {
    if (onReviewChange)
      onReviewChange(
        s.totalReviews > 0 ? Number(s.averageRating.toFixed(1)) : 0,
        s.totalReviews,
      );
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please sign in to leave a review");
      return;
    }
    setSubmitting(true);
    try {
      const u = localStorage.getItem("yog_user") || "";
      const r = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-data": u },
        body: JSON.stringify({
          productId,
          rating: form.rating,
          comment: form.comment,
        }),
      });
      const d = await r.json();
      if (r.ok) {
        const newReview: Review = {
          id: d.review.id,
          userName: user.name,
          rating: form.rating,
          comment: form.comment,
          verified: false,
          createdAt: new Date().toISOString(),
        };
        const newTotal = (stats?.totalReviews || 0) + 1;
        const newAvg = stats
          ? (stats.averageRating * stats.totalReviews + form.rating) / newTotal
          : form.rating;
        const newDist = stats
          ? { ...stats.ratingDistribution }
          : { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        newDist[form.rating as keyof typeof newDist]++;
        const newStats: Stats = {
          totalReviews: newTotal,
          averageRating: newAvg,
          ratingDistribution: newDist,
        };
        setReviews([newReview, ...reviews]);
        setStats(newStats);
        notify(newStats);
        setShowForm(false);
        setForm({ rating: 5, comment: "" });
      } else {
        alert(d.error || "Failed to submit");
      }
    } catch {
      alert("Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editingReview) return;
    setEditing(true);
    try {
      const u = localStorage.getItem("yog_user") || "";
      const r = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-user-data": u },
        body: JSON.stringify({
          reviewId: editingReview.id,
          rating: editForm.rating,
          comment: editForm.comment,
        }),
      });
      const d = await r.json();
      if (r.ok) {
        const updated = reviews.map((rv) =>
          rv.id === editingReview.id
            ? { ...rv, rating: editForm.rating, comment: editForm.comment }
            : rv,
        );
        setReviews(updated);
        if (stats) {
          const nd = { ...stats.ratingDistribution };
          nd[editingReview.rating as keyof typeof nd]--;
          nd[editForm.rating as keyof typeof nd]++;
          const na =
            (stats.averageRating * stats.totalReviews -
              editingReview.rating +
              editForm.rating) /
            stats.totalReviews;
          const ns: Stats = {
            ...stats,
            averageRating: na,
            ratingDistribution: nd,
          };
          setStats(ns);
          notify(ns);
        }
        setEditingReview(null);
      } else {
        alert(d.error || "Failed to update");
      }
    } catch {
      alert("Failed to update");
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async (reviewId: string, rating: number) => {
    if (!confirm("Delete this review?")) return;
    setDeletingId(reviewId);
    try {
      const u = localStorage.getItem("yog_user") || "";
      const r = await fetch(`/api/reviews?reviewId=${reviewId}`, {
        method: "DELETE",
        headers: { "x-user-data": u },
      });
      if (r.ok) {
        const updated = reviews.filter((rv) => rv.id !== reviewId);
        setReviews(updated);
        if (stats) {
          const newTotal = stats.totalReviews - 1;
          const nd = { ...stats.ratingDistribution };
          nd[rating as keyof typeof nd]--;
          const na =
            newTotal > 0
              ? (stats.averageRating * stats.totalReviews - rating) / newTotal
              : 0;
          const ns: Stats = {
            totalReviews: newTotal,
            averageRating: na,
            ratingDistribution: nd,
          };
          setStats(ns);
          notify(ns);
        }
      } else {
        const d = await r.json();
        alert(d.error || "Failed");
      }
    } catch {
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  if (loading)
    return (
      <>
        <style>{CSS}</style>
        <div className="pr-wrap">
          <div className="pr-header">
            <div className="pr-title">Reviews</div>
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="pr-skel" style={{ marginBottom: 10 }} />
          ))}
        </div>
      </>
    );

  return (
    <>
      <style>{CSS}</style>
      <div className="pr-wrap">
        <div className="pr-header">
          <h2 className="pr-title">
            Reviews{" "}
            {stats && stats.totalReviews > 0 && (
              <span style={{ color: "#9e9890", fontWeight: 500, fontSize: 16 }}>
                ({stats.totalReviews})
              </span>
            )}
          </h2>
          <button className="pr-write-btn" onClick={() => setShowForm(true)}>
            Write a Review
          </button>
        </div>

        {stats && stats.totalReviews > 0 && (
          <div className="pr-stats">
            <div className="pr-stats-grid">
              <div className="pr-avg-block">
                <div className="pr-avg-num">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="pr-avg-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIco
                      key={s}
                      filled={s <= Math.round(stats.averageRating)}
                      size={16}
                    />
                  ))}
                </div>
                <div className="pr-avg-count">
                  {stats.totalReviews} review
                  {stats.totalReviews !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="pr-bars">
                {[5, 4, 3, 2, 1].map((r) => (
                  <div key={r} className="pr-bar-row">
                    <div className="pr-bar-label">
                      <StarIco filled size={11} />
                      <span style={{ marginLeft: 2 }}>{r}</span>
                    </div>
                    <div className="pr-bar-track">
                      <div
                        className="pr-bar-fill"
                        style={{
                          width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[r as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <div className="pr-bar-count">
                      {
                        stats.ratingDistribution[
                          r as keyof typeof stats.ratingDistribution
                        ]
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="pr-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className={`pr-card ${deletingId === review.id ? "deleting" : ""}`}
              >
                <div className="pr-card-top">
                  <div className="pr-card-left">
                    <div className="pr-avatar">{initials(review.userName)}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span className="pr-user-name">{review.userName}</span>
                        {review.verified && (
                          <span className="pr-verified">Verified</span>
                        )}
                      </div>
                      <div className="pr-date">{fmtDate(review.createdAt)}</div>
                    </div>
                  </div>
                  <div className="pr-card-right">
                    <div className="pr-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIco key={s} filled={s <= review.rating} />
                      ))}
                    </div>
                    {user && review.userName === user.name && (
                      <div className="pr-actions-btns">
                        <button
                          className="pr-action-btn"
                          onClick={() => {
                            setEditingReview(review);
                            setEditForm({
                              rating: review.rating,
                              comment: review.comment,
                            });
                          }}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="pr-action-btn delete"
                          onClick={() => handleDelete(review.id, review.rating)}
                          disabled={deletingId === review.id}
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="pr-comment">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="pr-empty">
              <div className="pr-empty-icon">
                <StarBigIco />
              </div>
              <p className="pr-empty-title">No reviews yet</p>
              <p className="pr-empty-sub">
                Be the first to review this product
              </p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ReviewForm
          title="Write a Review"
          rating={form.rating}
          comment={form.comment}
          onRating={(r: number) => setForm({ ...form, rating: r })}
          onComment={(c: string) => setForm({ ...form, comment: c })}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
          submitting={submitting}
        />
      )}
      {editingReview && (
        <ReviewForm
          title="Edit Review"
          rating={editForm.rating}
          comment={editForm.comment}
          onRating={(r: number) => setEditForm({ ...editForm, rating: r })}
          onComment={(c: string) => setEditForm({ ...editForm, comment: c })}
          onSubmit={handleEditSubmit}
          onClose={() => setEditingReview(null)}
          submitting={editing}
        />
      )}
    </>
  );
}
