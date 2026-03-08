"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ArrowLeftIcon = () => (
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
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const UserIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const TruckIcon = () => (
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
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const NotesIcon = () => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const PlusIcon = () => (
  <svg
    width="12"
    height="12"
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
    width="12"
    height="12"
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
const MapPinIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const HandshakeIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
  </svg>
);
const CashIcon = () => (
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
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const inputClass =
  "w-full px-4 py-3 rounded-[11px] text-[13px] font-medium text-[#1a1714] bg-white placeholder:text-[#b8b4ae] focus:outline-none transition-all";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    deliveryMethod: "delivery",
    address: "",
    notes: "",
  });

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
      return;
    }
    const userStr = localStorage.getItem("yog_user");
    if (userStr) {
      const u = JSON.parse(userStr);
      setFormData((p) => ({ ...p, name: u.name || "", email: u.email || "" }));
    }
  }, [cart, router]);

  const deliveryFee = formData.deliveryMethod === "delivery" ? 50 : 0;
  const total = getCartTotal() + deliveryFee;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    try {
      const ordersBySeller = cart.reduce((acc: any, item) => {
        if (!acc[item.sellerId])
          acc[item.sellerId] = { sellerId: item.sellerId, items: [] };
        acc[item.sellerId].items.push(item);
        return acc;
      }, {});

      await Promise.all(
        Object.values(ordersBySeller).flatMap((so: any) =>
          so.items.map((item: any) =>
            fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId: item.productId,
                customerName: formData.name,
                customerPhone: formData.phone,
                customerEmail: formData.email || null,
                quantity: item.quantity,
                selectedSize: item.size,
                selectedColor: item.color,
                deliveryMethod: formData.deliveryMethod.toUpperCase(),
                deliveryAddress:
                  formData.deliveryMethod === "delivery"
                    ? formData.address
                    : null,
                unitPrice: item.price,
                deliveryFee: deliveryFee / cart.length,
              }),
            }).then((r) => {
              if (!r.ok) throw new Error("Failed");
              return r.json();
            }),
          ),
        ),
      );

      clearCart();
      router.push("/checkout/success");
    } catch (err: any) {
      alert(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) return null;

  const field = (
    label: string,
    required: boolean,
    children: React.ReactNode,
  ) => (
    <div>
      <label className="block text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.9px] mb-1.5">
        {label}
        {required && " *"}
      </label>
      {children}
    </div>
  );

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-[#f6f5f3] pt-28 pb-20 px-4"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Back + title */}
          <div className="mb-7">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#9e9890] hover:text-[#1a1714] transition-colors mb-3 no-underline"
            >
              <ArrowLeftIcon /> Back to Cart
            </Link>
            <div>
              <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.2px] mb-0.5">
                Almost there
              </p>
              <h1 className="text-[26px] font-extrabold text-[#1a1714] tracking-tight leading-none">
                Checkout
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* LEFT — form */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {/* Customer Info */}
                <div
                  className="bg-white rounded-2xl p-5"
                  style={{ border: "1px solid #e8e4de" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-[8px] bg-[#f6f5f3] flex items-center justify-center text-[#1a1714]">
                      <UserIcon />
                    </div>
                    <h2 className="text-[14px] font-bold text-[#1a1714]">
                      Customer Information
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {field(
                      "Full Name",
                      true,
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        className={inputClass}
                        style={{ border: "1px solid #e8e4de" }}
                      />,
                    )}
                    {field(
                      "Phone Number",
                      true,
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+251 9XX XXX XXX"
                        className={inputClass}
                        style={{ border: "1px solid #e8e4de" }}
                      />,
                    )}
                    {field(
                      "Email",
                      false,
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="your@email.com (optional)"
                        className={inputClass}
                        style={{ border: "1px solid #e8e4de" }}
                      />,
                    )}
                  </div>
                </div>

                {/* Delivery Method */}
                <div
                  className="bg-white rounded-2xl p-5"
                  style={{ border: "1px solid #e8e4de" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-[8px] bg-[#f6f5f3] flex items-center justify-center text-[#1a1714]">
                      <TruckIcon />
                    </div>
                    <h2 className="text-[14px] font-bold text-[#1a1714]">
                      Delivery Method
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {(
                      [
                        {
                          val: "delivery",
                          label: "Delivery",
                          sub: "50 ETB",
                          Icon: MapPinIcon,
                        },
                        {
                          val: "meetup",
                          label: "Meet-up",
                          sub: "Free",
                          Icon: HandshakeIcon,
                        },
                      ] as const
                    ).map(({ val, label, sub, Icon }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, deliveryMethod: val })
                        }
                        className="p-5 rounded-xl flex flex-col items-center gap-2 transition-all"
                        style={{
                          border:
                            formData.deliveryMethod === val
                              ? "1.5px solid #1a1714"
                              : "1.5px solid #e8e4de",
                          background:
                            formData.deliveryMethod === val
                              ? "#1a1714"
                              : "#fff",
                          color:
                            formData.deliveryMethod === val
                              ? "#fff"
                              : "#1a1714",
                        }}
                      >
                        <Icon />
                        <p className="text-[13px] font-bold">{label}</p>
                        <p className="text-[11px] opacity-70">{sub}</p>
                      </button>
                    ))}
                  </div>

                  {formData.deliveryMethod === "delivery" && (
                    <div>
                      <label className="block text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.9px] mb-1.5">
                        Delivery Address *
                      </label>
                      <textarea
                        required
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Enter your full delivery address"
                        rows={3}
                        className={`${inputClass} resize-none`}
                        style={{ border: "1px solid #e8e4de" }}
                      />
                    </div>
                  )}

                  {formData.deliveryMethod === "meetup" && (
                    <div
                      className="rounded-xl px-4 py-3 text-[12px] text-[#9e9890]"
                      style={{
                        background: "#f6f5f3",
                        border: "1px solid #e8e4de",
                      }}
                    >
                      The seller will contact you to arrange a meeting location.
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div
                  className="bg-white rounded-2xl p-5"
                  style={{ border: "1px solid #e8e4de" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-[8px] bg-[#f6f5f3] flex items-center justify-center text-[#1a1714]">
                      <NotesIcon />
                    </div>
                    <h2 className="text-[14px] font-bold text-[#1a1714]">
                      Order Notes{" "}
                      <span className="text-[#9e9890] font-normal">
                        (optional)
                      </span>
                    </h2>
                  </div>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Any special instructions for the seller?"
                    rows={3}
                    className={`${inputClass} resize-none`}
                    style={{ border: "1px solid #e8e4de" }}
                  />
                </div>

                {/* Payment notice */}
                <div
                  className="rounded-xl px-4 py-3.5 flex items-center gap-3"
                  style={{ background: "#f0ede9", border: "1px solid #e8e4de" }}
                >
                  <div className="w-7 h-7 rounded-[8px] bg-[#1a1714] flex items-center justify-center text-white shrink-0">
                    <CashIcon />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#1a1714]">
                      Payment on Delivery
                    </p>
                    <p className="text-[11px] text-[#9e9890] mt-0.5">
                      Pay with cash when your order arrives. Inspect before
                      paying.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT — summary */}
              <div className="lg:col-span-1">
                <div
                  className="bg-white rounded-2xl p-5 sticky top-28"
                  style={{ border: "1px solid #e8e4de" }}
                >
                  <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.2px] mb-4">
                    Order Summary
                  </p>

                  {/* Items with qty controls */}
                  <div
                    className="flex flex-col gap-3 mb-4 pb-4"
                    style={{ borderBottom: "1px solid #e8e4de" }}
                  >
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#f6f5f3] shrink-0">
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
                          {item.size && (
                            <p className="text-[10px] text-[#9e9890]">
                              {item.size}
                              {item.color ? ` · ${item.color}` : ""}
                            </p>
                          )}
                        </div>
                        {/* Qty controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 flex items-center justify-center rounded-md bg-[#f6f5f3] text-[#1a1714] hover:bg-[#e8e4de] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            style={{ border: "1px solid #e8e4de" }}
                          >
                            <MinusIcon />
                          </button>
                          <span className="w-5 text-center text-[12px] font-bold text-[#1a1714]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxStock}
                            className="w-6 h-6 flex items-center justify-center rounded-md bg-[#f6f5f3] text-[#1a1714] hover:bg-[#e8e4de] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            style={{ border: "1px solid #e8e4de" }}
                          >
                            <PlusIcon />
                          </button>
                        </div>
                        <p className="text-[12px] font-bold text-[#1a1714] shrink-0 w-14 text-right">
                          {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="flex flex-col gap-2 mb-5">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#9e9890]">Subtotal</span>
                      <span className="font-semibold text-[#1a1714]">
                        {getCartTotal().toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#9e9890]">Delivery</span>
                      <span className="font-semibold text-[#1a1714]">
                        {deliveryFee === 0 ? "Free" : `${deliveryFee} ETB`}
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
                        {total.toLocaleString()}{" "}
                        <span className="text-[12px] font-semibold">ETB</span>
                      </span>
                    </div>
                  </div>

                  {/* Place order */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1a1714] text-white py-3.5 rounded-[12px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-all hover:-translate-y-px hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Placing Order…
                      </>
                    ) : (
                      <>
                        <CheckIcon /> Place Order
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-[#b8b4ae] text-center mt-3">
                    By placing this order you agree to our terms and conditions.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
