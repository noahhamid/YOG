"use client";

import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TrashIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const MinusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const BagIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
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
);
const ShieldIcon = () => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const TruckIcon = () => (
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
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const RefreshIcon = () => (
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
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div
          className="min-h-screen flex flex-col items-center justify-center bg-[#f6f5f3] px-4"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#e8e4de] flex items-center justify-center mx-auto mb-6 text-[#9e9890]">
              <BagIcon />
            </div>
            <h1 className="text-3xl font-extrabold text-[#1a1714] tracking-tight mb-2">
              Your cart is empty
            </h1>
            <p className="text-[#9e9890] text-[14px] mb-8 max-w-xs mx-auto">
              Looks like you haven't added anything yet. Browse our collections
              and find something you love.
            </p>
            <Link href="/shop">
              <button className="inline-flex items-center gap-2 bg-[#1a1714] text-white px-7 py-3.5 rounded-[12px] text-[13px] font-bold hover:bg-[#333] transition-all hover:-translate-y-px hover:shadow-lg">
                Start Shopping <ArrowIcon />
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-[#f6f5f3] pt-28 pb-20 px-4"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.2px] mb-1">
                Your Bag
              </p>
              <h1 className="text-[28px] font-extrabold text-[#1a1714] tracking-tight leading-none">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </h1>
            </div>
            <button
              onClick={clearCart}
              className="text-[12px] font-semibold text-[#9e9890] hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 flex gap-4"
                  style={{ border: "1px solid #e8e4de" }}
                >
                  {/* Image */}
                  <Link href={`/product/${item.productId}`}>
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-[#f6f5f3] shrink-0 hover:opacity-80 transition-opacity">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link href={`/product/${item.productId}`}>
                          <p className="text-[14px] font-bold text-[#1a1714] leading-snug hover:underline cursor-pointer truncate">
                            {item.title}
                          </p>
                        </Link>
                        <p className="text-[11px] text-[#9e9890] mt-0.5">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.size && item.color && <span> · </span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </p>
                        <p className="text-[11px] text-[#b8b4ae] mt-0.5">
                          by {item.sellerName}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[#9e9890] hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                      >
                        <TrashIcon />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Qty controls on the LEFT cards */}
                      <div
                        className="flex items-center gap-0 bg-[#f6f5f3] rounded-[10px] overflow-hidden cursor-pointer"
                        style={{ border: "1px solid #e8e4de" }}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-[#1a1714] hover:bg-[#e8e4de] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                          <MinusIcon />
                        </button>
                        <span className="w-8 text-center text-[13px] font-bold text-[#1a1714]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.maxStock}
                          className="w-8 h-8 flex items-center justify-center text-[#1a1714] hover:bg-[#e8e4de] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                          <PlusIcon />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-[17px] font-extrabold text-[#1a1714] tracking-tight">
                          {(item.price * item.quantity).toLocaleString()}{" "}
                          <span className="text-[12px] font-semibold">ETB</span>
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[11px] text-[#9e9890]">
                            {item.quantity} × {item.price.toLocaleString()} ETB
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="bg-white rounded-2xl p-5 sticky top-28"
                style={{ border: "1px solid #e8e4de" }}
              >
                <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.2px] mb-4">
                  Order Summary
                </p>

                {/* Item list mini */}
                <div
                  className="flex flex-col gap-3 mb-4 pb-4"
                  style={{ borderBottom: "1px solid #e8e4de" }}
                >
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#f6f5f3] shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-[#1a1714] truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#9e9890]">
                          {item.size && `Size: ${item.size} · `}qty{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <p className="text-[12px] font-bold text-[#1a1714] shrink-0">
                        {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2.5 mb-5">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#9e9890]">Subtotal</span>
                    <span className="font-semibold text-[#1a1714]">
                      {getCartTotal().toLocaleString()} ETB
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#9e9890]">Delivery</span>
                    <span className="font-semibold text-[#9e9890]">
                      At checkout
                    </span>
                  </div>
                  <div
                    className="flex justify-between pt-3"
                    style={{ borderTop: "1px solid #e8e4de" }}
                  >
                    <span className="text-[15px] font-bold text-[#1a1714]">
                      Total
                    </span>
                    <span className="text-[17px] font-extrabold text-[#1a1714] tracking-tight">
                      {getCartTotal().toLocaleString()}{" "}
                      <span className="text-[12px] font-semibold">ETB</span>
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-[#1a1714] text-white py-3.5 rounded-[12px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-all hover:-translate-y-px hover:shadow-lg mb-2.5 cursor-pointer"
                >
                  Proceed to Checkout <ArrowIcon />
                </button>
                <Link href="/shop">
                  <button
                    className="w-full py-3 rounded-[12px] text-[13px] font-semibold text-[#1a1714] hover:bg-[#f6f5f3] transition-colors cursor-pointer"
                    style={{ border: "1px solid #e8e4de" }}
                  >
                    Continue Shopping
                  </button>
                </Link>

                {/* Trust badges */}
                <div
                  className="mt-5 pt-4 flex flex-col gap-2.5"
                  style={{ borderTop: "1px solid #e8e4de" }}
                >
                  {[
                    [<ShieldIcon />, "Secure checkout"],
                    [<TruckIcon />, "Fast delivery"],
                    [<RefreshIcon />, "Easy returns within 7 days"],
                  ].map(([icon, text], i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-[12px] text-[#9e9890]"
                    >
                      <span className="text-[#1a1714]">
                        {icon as React.ReactNode}
                      </span>
                      {text as string}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
