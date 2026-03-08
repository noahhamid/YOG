"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

const CheckIcon = () => (
  <svg
    width="32"
    height="32"
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
const HomeIcon = () => (
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
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const ArrowIcon = () => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const PhoneIcon = () => (
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
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
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
const CashIcon = () => (
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
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const STEPS = [
  {
    Icon: PhoneIcon,
    title: "Seller confirms",
    desc: "The seller will call you to confirm your order",
  },
  {
    Icon: TruckIcon,
    title: "Order dispatched",
    desc: "Your items are packed and on the way",
  },
  {
    Icon: CashIcon,
    title: "Pay on delivery",
    desc: "Inspect your items, then pay with cash",
  },
];

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-[#f6f5f3] flex items-center justify-center px-4 py-20"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        <div className="w-full max-w-lg">
          {/* Success card */}
          <div
            className="bg-white rounded-3xl p-8 text-center mb-4"
            style={{ border: "1px solid #e8e4de" }}
          >
            {/* Checkmark */}
            <div className="w-16 h-16 rounded-2xl bg-[#1a1714] flex items-center justify-center mx-auto mb-5 text-white">
              <CheckIcon />
            </div>

            <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.2px] mb-1">
              Order confirmed
            </p>
            <h1 className="text-[26px] font-extrabold text-[#1a1714] tracking-tight leading-tight mb-2">
              You're all set! 🎉
            </h1>
            <p className="text-[13px] text-[#9e9890] leading-relaxed max-w-sm mx-auto">
              Your order has been placed successfully. The seller will reach out
              shortly to confirm and arrange delivery.
            </p>
          </div>

          {/* What's next */}
          <div
            className="bg-white rounded-2xl p-5 mb-4"
            style={{ border: "1px solid #e8e4de" }}
          >
            <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.2px] mb-4">
              What happens next
            </p>
            <div className="flex flex-col gap-3">
              {STEPS.map(({ Icon, title, desc }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-[9px] bg-[#f6f5f3] flex items-center justify-center text-[#1a1714] shrink-0 mt-0.5"
                    style={{ border: "1px solid #e8e4de" }}
                  >
                    <Icon />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1a1714]">
                      {title}
                    </p>
                    <p className="text-[12px] text-[#9e9890]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Link href="/" className="flex-1">
              <button
                className="w-full py-3.5 rounded-[12px] text-[13px] font-bold text-[#1a1714] flex items-center justify-center gap-2 hover:bg-[#e8e4de] transition-colors"
                style={{ border: "1px solid #e8e4de", background: "#fff" }}
              >
                <HomeIcon /> Home
              </button>
            </Link>
            <Link href="/shop" className="flex-1">
              <button className="w-full bg-[#1a1714] text-white py-3.5 rounded-[12px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-all hover:-translate-y-px hover:shadow-lg">
                Shop More <ArrowIcon />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
