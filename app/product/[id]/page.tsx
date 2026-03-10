import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCategory } from "@prisma/client";
import ProductDetailClient from "@/components/ProductDetailClient";
import { Suspense, cache } from "react";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { status: "PUBLISHED", seller: { approved: true } },
      select: { id: true },
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });
    return products.map((product) => ({ id: product.id }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

const getCachedProduct = cache(async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      compareAtPrice: true,
      category: true,
      brand: true,
      status: true,
      createdAt: true,
      images: {
        select: { url: true, position: true },
        orderBy: { position: "asc" },
      },
      variants: {
        select: { size: true, color: true, quantity: true },
        orderBy: { size: "asc" },
      },
      seller: {
        select: {
          id: true,
          brandName: true,
          storeSlug: true,
          location: true,
          storeLogo: true,
          instagram: true,
          approved: true,
          createdAt: true,
          _count: { select: { followersList: true } },
        },
      },
      reviews: { select: { rating: true } },
    },
  });
});

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getCachedProduct(id);

  if (!product || product.status !== "PUBLISHED" || !product.seller.approved) {
    notFound();
  }

  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.map((v) => v.color))];
  const totalStock = product.variants.reduce((sum, v) => sum + v.quantity, 0);
  const reviewCount = product.reviews.length;
  const averageRating =
    reviewCount > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 4.5;

  const transformedProduct = {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    discount: product.compareAtPrice
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : 0,
    category: product.category,
    brand: product.brand || product.seller.brandName,
    images: product.images.map((img) => img.url),
    variants: product.variants.map((v) => ({
      size: v.size,
      color: v.color,
      quantity: v.quantity,
      available: v.quantity > 0,
    })),
    sizes: sizes.map((size) => ({
      value: size,
      available: product.variants.some(
        (v) => v.size === size && v.quantity > 0,
      ),
    })),
    colors: colors.map((color) => ({
      name: color.charAt(0).toUpperCase() + color.slice(1),
      value: color.toLowerCase(),
      hex: getColorHex(color),
    })),
    totalStock,
    inStock: totalStock > 0,
    seller: {
      id: product.seller.id,
      name: product.seller.brandName,
      slug: product.seller.storeSlug,
      verified: product.seller.approved,
      logo:
        product.seller.storeLogo ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(product.seller.brandName)}&size=200&background=000&color=fff&bold=true`,
      followers: product.seller._count.followersList,
      location: product.seller.location,
      instagram: product.seller.instagram,
      rating: 4.8,
      responseRate: 98,
      responseTime: "within hours",
      joinedDate: product.seller.createdAt.getFullYear().toString(),
    },
    createdAt: product.createdAt.toISOString(),
    rating: Number(averageRating.toFixed(1)),
    reviewCount,
    sold: 0,
  };

  return (
    <>
      <ProductDetailClient product={transformedProduct} />

      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProducts productId={product.id} category={product.category} />
      </Suspense>
    </>
  );
}

// ─── Related Products ─────────────────────────────────────────────────────────
async function RelatedProducts({
  productId,
  category,
}: {
  productId: string;
  category: string;
}) {
  const products = await prisma.product.findMany({
    where: {
      category: category as any,
      id: { not: productId },
      status: "PUBLISHED",
      seller: { approved: true },
    },
    select: {
      id: true,
      title: true,
      price: true,
      compareAtPrice: true,
      category: true,
      createdAt: true,
      images: {
        select: { url: true },
        orderBy: { position: "asc" },
        take: 2,
      },
      variants: {
        select: { size: true, color: true, quantity: true },
      },
      seller: {
        select: { brandName: true, approved: true },
      },
      _count: { select: { reviews: true } },
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) return null;

  // Shape products for the card renderer
  const shaped = products.map((p) => {
    const sizes = [...new Set(p.variants.map((v) => v.size))];
    const colors = [...new Set(p.variants.map((v) => v.color))];
    const stock = p.variants.reduce((s, v) => s + v.quantity, 0);
    const discount =
      p.compareAtPrice && p.compareAtPrice > p.price
        ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
        : 0;
    const categoryLabel =
      p.category.charAt(0) + p.category.slice(1).toLowerCase();
    const isNew =
      Date.now() - new Date(p.createdAt).getTime() < 1000 * 60 * 60 * 24 * 14;
    return {
      id: p.id,
      title: p.title,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      discount,
      category: categoryLabel,
      image: p.images[0]?.url || "",
      image2: p.images[1]?.url || "",
      sizes,
      colors,
      stock,
      isNew,
      sellerName: p.seller.brandName,
      sellerApproved: p.seller.approved,
    };
  });

  // color hex lookup
  const COLOR_HEX: Record<string, string> = {
    black: "#1a1714",
    white: "#f8f8f8",
    gray: "#9ca3af",
    grey: "#9ca3af",
    blue: "#3b82f6",
    red: "#ef4444",
    green: "#10b981",
    yellow: "#f59e0b",
    orange: "#f97316",
    purple: "#8b5cf6",
    pink: "#ec4899",
    brown: "#a16207",
    khaki: "#c4b5a0",
    navy: "#1e3a5f",
    beige: "#e8dcc8",
    cream: "#fef3c7",
  };
  const dotColor = (c: string) => {
    const k = c.toLowerCase().split(" ").pop() || "";
    return COLOR_HEX[k] || COLOR_HEX[c.toLowerCase()] || "#e8e4de";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

        .rp-wrap {
          max-width:1200px; margin:0 auto;
          padding:36px 20px 72px;
          font-family:'Sora',sans-serif;
          background:#f6f5f3;
        }
        .rp-head {
          display:flex; align-items:flex-end; justify-content:space-between;
          margin-bottom:22px; gap:12px;
        }
        .rp-eyebrow {
          font-size:11px; font-weight:700; color:#9e9890;
          text-transform:uppercase; letter-spacing:1.2px; margin:0 0 5px;
        }
        .rp-title {
          font-size:22px; font-weight:800; color:#1a1714;
          letter-spacing:-0.6px; margin:0; line-height:1.1;
        }
        .rp-see-all {
          display:inline-flex; align-items:center; gap:5px;
          font-size:12px; font-weight:700; color:#9e9890; text-decoration:none;
          border:1.5px solid #e8e4de; padding:7px 14px; border-radius:10px;
          white-space:nowrap; transition:all 0.15s; flex-shrink:0;
        }
        .rp-see-all:hover { border-color:#1a1714; color:#1a1714; background:#fff; }

        .rp-grid {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:14px;
        }
        @media(max-width:1000px){ .rp-grid { grid-template-columns:repeat(3,1fr); } }
        @media(max-width:700px)  { .rp-grid { grid-template-columns:repeat(2,1fr); gap:10px; } }

        .rp-card {
          background:#fff; border-radius:14px; overflow:hidden;
          border:1px solid #e8e4de; display:block; text-decoration:none;
          cursor:pointer;
          transition:box-shadow 0.22s, transform 0.22s, border-color 0.22s;
        }
        .rp-card:hover {
          box-shadow:0 12px 36px rgba(0,0,0,0.10);
          transform:translateY(-3px); border-color:rgba(0,0,0,0.1);
        }

        .rp-img-wrap {
          position:relative; aspect-ratio:3/4;
          overflow:hidden; background:#f5f3f0;
        }
        .rp-img {
          position:absolute; inset:0; width:100%; height:100%;
          object-fit:cover;
          transition:transform 0.45s ease;
        }
        .rp-card:hover .rp-img { transform:scale(1.04); }

        .rp-overlay {
          position:absolute; inset:0; z-index:2;
          background:linear-gradient(to top,rgba(0,0,0,0.44) 0%,rgba(0,0,0,0.04) 50%,transparent 72%);
          opacity:0; transition:opacity 0.22s;
        }
        .rp-card:hover .rp-overlay { opacity:1; }

        .rp-badge {
          position:absolute; z-index:4; top:8px; left:8px;
          padding:3px 9px; border-radius:20px; pointer-events:none;
          font-size:10px; font-weight:800; letter-spacing:0.2px;
        }
        .rp-badge.sale { background:#dc2626; color:#fff; }
        .rp-badge.new  { background:#16a34a; color:#fff; }

        .rp-info { padding:12px 13px 14px; display:flex; flex-direction:column; }
        .rp-seller {
          font-size:10px; font-weight:600; color:#9e9890;
          text-transform:uppercase; letter-spacing:0.5px;
          margin:0 0 3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
          display:flex; align-items:center; gap:4px;
        }
        .rp-seller-check {
          display:inline-flex; align-items:center;
          padding:1px 5px; border-radius:20px; flex-shrink:0;
          font-size:9px; font-weight:700; letter-spacing:0.2px;
          background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd;
        }
        .rp-name {
          font-size:13px; font-weight:700; color:#1a1714;
          margin:0 0 7px; line-height:1.35;
          display:-webkit-box; -webkit-line-clamp:2;
          -webkit-box-orient:vertical; overflow:hidden;
        }
        .rp-meta { display:flex; align-items:center; gap:5px; margin-bottom:7px; flex-wrap:wrap; }
        .rp-cat {
          padding:2px 7px; border-radius:20px;
          font-size:9px; font-weight:600; color:#9e9890;
          background:#f5f3f0; border:1px solid #e8e4de;
        }
        .rp-stock { font-size:9px; font-weight:600; }
        .rp-stock.low  { color:#d97706; }
        .rp-stock.ok   { color:#16a34a; }
        .rp-stock.none { color:#dc2626; }

        .rp-colors { display:flex; align-items:center; gap:3px; margin-bottom:9px; }
        .rp-dot {
          width:10px; height:10px; border-radius:50%;
          border:1.5px solid rgba(0,0,0,0.1); flex-shrink:0;
        }
        .rp-more { font-size:9px; color:#9e9890; font-weight:600; }

        .rp-divider { height:1px; background:#e8e4de; margin:0 0 9px; }

        .rp-bottom { display:flex; align-items:flex-end; justify-content:space-between; gap:4px; }
        .rp-price {
          font-size:15px; font-weight:800; color:#1a1714;
          letter-spacing:-0.4px; line-height:1.1;
        }
        .rp-etb { font-size:10px; font-weight:500; color:#9e9890; margin-left:2px; }
        .rp-compare {
          font-size:10px; color:#c4bfb8; text-decoration:line-through;
          display:block; margin-top:1px;
        }
        .rp-sizes { display:flex; gap:3px; flex-wrap:wrap; justify-content:flex-end; }
        .rp-size {
          padding:2px 5px; border-radius:4px; border:1px solid #e8e4de;
          font-size:8px; font-weight:700; color:#9e9890; letter-spacing:0.2px;
        }
        .rp-card:hover .rp-size { border-color:#c4bfb8; }
      `}</style>

      <div className="rp-wrap">
        <div className="rp-head">
          <div>
            <p className="rp-eyebrow">You might also like</p>
            <h2 className="rp-title">Related products</h2>
          </div>
          <a
            href={`/shop?category=${category.toLowerCase()}`}
            className="rp-see-all"
          >
            See all
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <div className="rp-grid">
          {shaped.map((p) => {
            const stockLabel =
              p.stock === 0
                ? { text: "Out of stock", cls: "none" }
                : p.stock <= 5
                  ? { text: `Only ${p.stock} left`, cls: "low" }
                  : { text: "In stock", cls: "ok" };
            const uniqueColors = [...new Set(p.colors)];

            return (
              <a key={p.id} href={`/product/${p.id}`} className="rp-card">
                <div className="rp-img-wrap">
                  <img
                    src={p.image || "https://via.placeholder.com/400"}
                    alt={p.title}
                    className="rp-img"
                  />
                  <div className="rp-overlay" />
                  {p.discount > 0 && (
                    <span className="rp-badge sale">−{p.discount}%</span>
                  )}
                  {p.isNew && !p.discount && (
                    <span className="rp-badge new">New</span>
                  )}
                </div>

                <div className="rp-info">
                  <p className="rp-seller">
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.sellerName}
                    </span>
                    {p.sellerApproved && (
                      <span className="rp-seller-check">
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>{" "}
                        Verified
                      </span>
                    )}
                  </p>

                  <p className="rp-name">{p.title}</p>

                  <div className="rp-meta">
                    <span className="rp-cat">{p.category}</span>
                    <span className={`rp-stock ${stockLabel.cls}`}>
                      {stockLabel.text}
                    </span>
                  </div>

                  {uniqueColors.length > 0 && (
                    <div className="rp-colors">
                      {uniqueColors.slice(0, 5).map((c, i) => (
                        <span
                          key={i}
                          className="rp-dot"
                          style={{ background: dotColor(c) }}
                        />
                      ))}
                      {uniqueColors.length > 5 && (
                        <span className="rp-more">
                          +{uniqueColors.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="rp-divider" />

                  <div className="rp-bottom">
                    <div>
                      <p className="rp-price">
                        {p.price.toLocaleString()}
                        <span className="rp-etb">ETB</span>
                      </p>
                      {p.discount > 0 && (
                        <span className="rp-compare">
                          {p.compareAtPrice?.toLocaleString()} ETB
                        </span>
                      )}
                    </div>
                    {p.sizes.length > 0 && (
                      <div className="rp-sizes">
                        {p.sizes.slice(0, 3).map((s: string) => (
                          <span key={s} className="rp-size">
                            {s}
                          </span>
                        ))}
                        {p.sizes.length > 3 && (
                          <span className="rp-size">…</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function RelatedProductsSkeleton() {
  return (
    <>
      <style>{`
        @keyframes rp-sk { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        .rp-sk-wrap { max-width:1200px; margin:0 auto; padding:36px 20px 72px; background:#f6f5f3; font-family:'Sora',sans-serif; }
        .rp-sk-hd { display:flex; flex-direction:column; gap:6px; margin-bottom:22px; }
        .rp-sk-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        @media(max-width:1000px){ .rp-sk-grid { grid-template-columns:repeat(3,1fr); } }
        @media(max-width:700px)  { .rp-sk-grid { grid-template-columns:repeat(2,1fr); } }
        .rp-sk-card { border-radius:14px; overflow:hidden; border:1px solid #e8e4de;
          background:linear-gradient(90deg,#ede9e4 25%,#e4ded8 50%,#ede9e4 75%);
          background-size:1200px 100%; animation:rp-sk 1.8s ease-in-out infinite; }
        .rp-sk-img { aspect-ratio:3/4; }
        .rp-sk-body { padding:12px 13px 14px; display:flex; flex-direction:column; gap:7px; }
        .rp-sk-line { border-radius:4px; background:rgba(0,0,0,0.07); }
      `}</style>
      <div className="rp-sk-wrap">
        <div className="rp-sk-hd">
          <div className="rp-sk-line" style={{ height: 10, width: 120 }} />
          <div className="rp-sk-line" style={{ height: 22, width: 200 }} />
        </div>
        <div className="rp-sk-grid">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rp-sk-card">
              <div className="rp-sk-img" />
              <div className="rp-sk-body">
                <div
                  className="rp-sk-line"
                  style={{ height: 9, width: "40%" }}
                />
                <div
                  className="rp-sk-line"
                  style={{ height: 13, width: "78%" }}
                />
                <div
                  className="rp-sk-line"
                  style={{ height: 9, width: "55%" }}
                />
                <div className="rp-sk-line" style={{ height: 1 }} />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    className="rp-sk-line"
                    style={{ height: 14, width: "36%" }}
                  />
                  <div
                    className="rp-sk-line"
                    style={{ height: 12, width: "28%" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getColorHex(color: string): string {
  const colorMap: Record<string, string> = {
    black: "#000000",
    white: "#FFFFFF",
    gray: "#9CA3AF",
    blue: "#3B82F6",
    red: "#EF4444",
    green: "#10B981",
    khaki: "#C4B5A0",
    yellow: "#FCD34D",
    orange: "#FB923C",
    pink: "#EC4899",
    purple: "#A855F7",
    brown: "#92400E",
  };
  return colorMap[color.toLowerCase()] || "#9CA3AF";
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: "Product - YOG Marketplace",
    description: "Shop the best clothing in Ethiopia",
  };
}
