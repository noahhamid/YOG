import Link from "next/link";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  .sc-card {
    background:#fff; border:1px solid #e8e4de; border-radius:16px;
    padding:18px 20px; display:flex; align-items:center;
    justify-content:space-between; gap:14px; font-family:'Sora',sans-serif;
    transition:box-shadow 0.2s, border-color 0.2s;
  }
  .sc-card:hover { box-shadow:0 4px 18px rgba(0,0,0,0.07); border-color:rgba(0,0,0,0.1); }
  .sc-left { display:flex; align-items:center; gap:14px; min-width:0; }
  .sc-avatar {
    width:52px; height:52px; border-radius:14px; overflow:hidden;
    background:#f5f3f0; flex-shrink:0; border:1.5px solid #e8e4de;
  }
  .sc-avatar img { width:100%; height:100%; object-fit:cover; }
  .sc-avatar-fallback {
    width:100%; height:100%; display:flex; align-items:center;
    justify-content:center; background:linear-gradient(135deg,#1a1714,#4a4540); color:#fff;
  }
  .sc-info { min-width:0; }
  .sc-name-row { display:flex; align-items:center; gap:7px; margin-bottom:3px; }
  .sc-name { font-size:15px; font-weight:700; color:#1a1714; letter-spacing:-0.2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .sc-verified { width:18px; height:18px; background:#2563eb; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sc-rating-row { display:flex; align-items:center; gap:5px; margin-bottom:3px; }
  .sc-stars { display:flex; gap:2px; color:#eab308; }
  .sc-rating-val { font-size:12px; font-weight:700; color:#1a1714; }
  .sc-rating-count { font-size:11px; color:#9e9890; }
  .sc-no-rating { font-size:12px; color:#9e9890; margin-bottom:3px; }
  .sc-followers { font-size:11px; color:#9e9890; font-weight:500; }
  .sc-btn {
    padding:8px 18px; border:1.5px solid #1a1714; border-radius:20px;
    font-size:12px; font-weight:700; color:#1a1714; background:#fff;
    cursor:pointer; transition:all 0.15s; white-space:nowrap;
    font-family:'Sora',sans-serif; text-decoration:none; display:inline-block;
  }
  .sc-btn:hover { background:#1a1714; color:#fff; }
`;

const StoreIco = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const CheckIco = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const StarIco = ({ filled }: { filled?: boolean }) => (
  <svg
    width="12"
    height="12"
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

export default function SellerCard({ seller }: { seller: any }) {
  const logoSrc =
    (seller.logo && seller.logo.trim()) ||
    (seller.image && seller.image.trim()) ||
    null;

  return (
    <>
      <style>{CSS}</style>
      <div className="sc-card">
        <div className="sc-left">
          <div className="sc-avatar">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={seller.name}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  (e.currentTarget.parentElement as HTMLElement).classList.add(
                    "sc-avatar-fallback",
                  );
                  (e.currentTarget.parentElement as HTMLElement).innerHTML =
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
                }}
              />
            ) : (
              <div className="sc-avatar-fallback">
                <StoreIco />
              </div>
            )}
          </div>
          <div className="sc-info">
            <div className="sc-name-row">
              <span className="sc-name">{seller.name}</span>
              {seller.verified && (
                <div className="sc-verified">
                  <CheckIco />
                </div>
              )}
            </div>
            {seller.rating && seller.reviewCount > 0 ? (
              <div className="sc-rating-row">
                <div className="sc-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIco key={s} filled={s <= Math.round(seller.rating)} />
                  ))}
                </div>
                <span className="sc-rating-val">{seller.rating}</span>
                <span className="sc-rating-count">({seller.reviewCount})</span>
              </div>
            ) : (
              <p className="sc-no-rating">No reviews yet</p>
            )}
            <p className="sc-followers">
              {(seller.followers || 0).toLocaleString()} followers
            </p>
          </div>
        </div>
        {seller.slug && (
          <Link href={`/stores/${seller.slug}`} className="sc-btn">
            View Store
          </Link>
        )}
      </div>
    </>
  );
}
