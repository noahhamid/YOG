"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

// ── Icons ──────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
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
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const ShieldIcon = () => (
  <svg
    width="20"
    height="20"
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
const CheckCircleIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const AlertTriangleIcon = () => (
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
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const UsersIcon = () => (
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
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const BanIcon = () => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);
const FileTextIcon = () => (
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
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
const GlobeIcon = () => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const ScaleIcon = () => (
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
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

// ── TOC items ──────────────────────────────────────────────────────────────
const sections = [
  { id: "platform", label: "The YOG Platform", icon: <GlobeIcon /> },
  {
    id: "seller-rules",
    label: "Seller Rules & Approval",
    icon: <ShieldIcon />,
  },
  { id: "buyers", label: "For Buyers", icon: <UsersIcon /> },
  { id: "prohibited", label: "Prohibited Items", icon: <BanIcon /> },
  { id: "content", label: "Content & Accuracy", icon: <FileTextIcon /> },
  { id: "termination", label: "Termination", icon: <AlertTriangleIcon /> },
  { id: "legal", label: "Legal & Disputes", icon: <ScaleIcon /> },
];

// ── Section wrapper ────────────────────────────────────────────────────────
const Section = ({
  id,
  number,
  title,
  icon,
  children,
  highlight,
}: {
  id: string;
  number: number;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  highlight?: boolean;
}) => (
  <section
    id={id}
    className="scroll-mt-28"
    style={{
      background: highlight ? "#f0ede9" : "white",
      border: "1px solid #e8e4de",
      borderRadius: "18px",
      padding: "28px 32px",
      marginBottom: "16px",
    }}
  >
    <div
      className="flex items-center gap-3 mb-5 pb-4"
      style={{ borderBottom: "1px solid #e8e4de" }}
    >
      <div
        className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white shrink-0"
        style={{ background: "#1a1714" }}
      >
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[11px] font-bold text-[#c4c0bb] uppercase tracking-[1px]">
          {String(number).padStart(2, "0")}
        </span>
        <h2 className="text-[17px] font-extrabold text-[#1a1714] tracking-tight">
          {title}
        </h2>
      </div>
    </div>
    <div className="text-[13px] text-[#6b6760] leading-[1.85]">{children}</div>
  </section>
);

// ── Rule row ──────────────────────────────────────────────────────────────
const Rule = ({
  good,
  children,
}: {
  good?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-2.5 mb-3">
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
      style={{
        background: good ? "#dcfce7" : "#fee2e2",
        color: good ? "#16a34a" : "#dc2626",
      }}
    >
      {good ? <CheckCircleIcon /> : <AlertTriangleIcon />}
    </div>
    <p className="text-[13px] text-[#4a4744] leading-relaxed">{children}</p>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────
export default function SellerTermsPage() {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen bg-[#f6f5f3] pt-24 pb-24 px-4"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Back link */}
          <Link
            href="/seller/apply"
            className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#9e9890] hover:text-[#1a1714] transition-colors mb-8"
          >
            <ArrowLeftIcon />
            Back to application
          </Link>

          {/* Hero header */}
          <div
            className="rounded-3xl p-8 mb-6 relative overflow-hidden"
            style={{ background: "#1a1714" }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10"
              style={{ background: "white" }}
            />
            <div
              className="absolute -right-4 -bottom-16 w-36 h-36 rounded-full opacity-5"
              style={{ background: "white" }}
            />

            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-[#1a1714]"
              style={{ background: "white" }}
            >
              <ShieldIcon />
            </div>
            <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.4px] mb-1">
              Legal Agreement
            </p>
            <h1 className="text-[28px] font-extrabold text-white tracking-tight leading-tight mb-2">
              Terms of Service &<br />
              Seller Agreement
            </h1>
            <p className="text-[13px] text-[#9e9890] leading-relaxed max-w-md">
              Please read this carefully before applying to sell on Yog. By
              submitting your application, you agree to all terms below.
            </p>
            <div
              className="mt-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "#c4c0bb",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Last Updated: May 2026
            </div>
          </div>

          {/* Main grid: TOC + content */}
          <div className="flex gap-6 items-start">
            {/* Sticky TOC */}
            <div className="hidden lg:block w-56 shrink-0 sticky top-28">
              <div
                className="rounded-2xl p-4"
                style={{ background: "white", border: "1px solid #e8e4de" }}
              >
                <p className="text-[10px] font-bold text-[#b8b4ae] uppercase tracking-[1.2px] mb-3">
                  Contents
                </p>
                {sections.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 py-2 text-[12px] font-medium text-[#9e9890] hover:text-[#1a1714] transition-colors group"
                    style={{
                      borderTop: i > 0 ? "1px solid #f0ede9" : "none",
                    }}
                  >
                    <span className="text-[#c4c0bb] group-hover:text-[#1a1714] transition-colors">
                      {s.icon}
                    </span>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="flex-1 min-w-0">
              <Section
                id="platform"
                number={1}
                title="The YOG Platform"
                icon={<GlobeIcon />}
              >
                <p className="mb-4">
                  YOG is a digital marketplace directory that connects fashion
                  stores across Ethiopia with customers. We provide the
                  infrastructure for stores to showcase products and reach
                  buyers.
                </p>
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#f6f5f3", border: "1px solid #e8e4de" }}
                >
                  <p className="text-[12px] font-bold text-[#1a1714] mb-2">
                    Important to understand:
                  </p>
                  <Rule good={false}>
                    YOG does <strong>not own, sell, or ship</strong> any items
                    listed on the platform.
                  </Rule>
                  <Rule good={true}>
                    All transactions, deliveries, and meetups are arranged
                    directly between the buyer and the seller.
                  </Rule>
                  <Rule good={true}>
                    YOG serves as the bridge — you own your customer
                    relationships.
                  </Rule>
                </div>
              </Section>

              <Section
                id="seller-rules"
                number={2}
                title="Seller Rules & Store Approval"
                icon={<ShieldIcon />}
                highlight
              >
                <p className="mb-4">
                  To maintain quality and trust on the platform, all sellers
                  must meet our standards. YOG reviews every application
                  individually.
                </p>
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-[#1a1714] uppercase tracking-[0.9px] mb-3">
                    Requirements
                  </p>
                  <Rule good={true}>
                    <strong>Application required:</strong> All sellers must
                    apply and be approved. YOG reserves the right to approve or
                    reject any application without obligation to give reason.
                  </Rule>
                  <Rule good={true}>
                    <strong>Accurate listing:</strong> Price, location,
                    availability, and product photos must reflect reality at all
                    times.
                  </Rule>
                  <Rule good={true}>
                    <strong>Responsive:</strong> Sellers must respond to buyer
                    inquiries in a timely manner.
                  </Rule>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(220,38,38,0.04)",
                    border: "1px solid rgba(220,38,38,0.12)",
                  }}
                >
                  <p className="text-[11px] font-bold text-red-600 uppercase tracking-[0.9px] mb-3">
                    Zero Tolerance Violations
                  </p>
                  <Rule good={false}>
                    <strong>Fraud or scamming</strong> — fake items, stolen
                    photos, misrepresentation of any kind. Results in{" "}
                    <strong>permanent ban</strong>.
                  </Rule>
                  <Rule good={false}>
                    <strong>Harassment</strong> of buyers or YOG staff. Results
                    in immediate suspension.
                  </Rule>
                  <Rule good={false}>
                    <strong>Multiple accounts</strong> to circumvent bans or
                    reviews. All accounts will be removed.
                  </Rule>
                </div>
              </Section>

              <Section
                id="buyers"
                number={3}
                title="For Buyers (Customers)"
                icon={<UsersIcon />}
              >
                <p className="mb-4">
                  YOG makes it easy to discover fashion stores in Ethiopia.
                  Here's how transactions work and what both parties should
                  know:
                </p>
                <Rule good={true}>
                  Buyers contact sellers directly via phone, email, or Instagram
                  provided in the listing.
                </Rule>
                <Rule good={true}>
                  For your safety, we strongly recommend{" "}
                  <strong>public meetups</strong> for item inspection before
                  payment.
                </Rule>
                <Rule good={false}>
                  YOG is not responsible for disputes regarding item quality,
                  delivery delays, or failed transactions between buyers and
                  sellers.
                </Rule>
                <Rule good={false}>
                  YOG cannot mediate payment disputes — agree on payment terms
                  before exchanging money.
                </Rule>
              </Section>

              <Section
                id="prohibited"
                number={4}
                title="Prohibited Items"
                icon={<BanIcon />}
              >
                <p className="mb-4">
                  Yog is a <strong>fashion-only</strong> marketplace. Listings
                  must fall within these categories:
                </p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {[
                    "Clothing & Apparel",
                    "Shoes & Footwear",
                    "Bags & Accessories",
                    "Traditional Wear",
                    "Athletic Wear",
                    "Formal Wear",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] text-[12px] font-medium text-[#1a1714]"
                      style={{
                        background: "#f0ede9",
                        border: "1px solid #e8e4de",
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1a1714]" />
                      {item}
                    </div>
                  ))}
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(220,38,38,0.04)",
                    border: "1px solid rgba(220,38,38,0.12)",
                  }}
                >
                  <p className="text-[11px] font-bold text-red-600 uppercase tracking-[0.9px] mb-2">
                    Prohibited — Immediate removal
                  </p>
                  <p className="text-[13px] text-[#6b6760]">
                    Illegal goods, counterfeit items, non-fashion products,
                    adult or offensive content, or anything prohibited under
                    Ethiopian law.
                  </p>
                </div>
              </Section>

              <Section
                id="content"
                number={5}
                title="Content & Accuracy"
                icon={<FileTextIcon />}
              >
                <Rule good={true}>
                  All product photos must be of your actual items — no stock
                  images or stolen photography.
                </Rule>
                <Rule good={true}>
                  Pricing must be honest and current. Hidden fees or
                  bait-and-switch pricing is prohibited.
                </Rule>
                <Rule good={true}>
                  Brand descriptions must accurately represent your business.
                  Misleading claims will result in review.
                </Rule>
                <Rule good={false}>
                  YOG may remove any listing without notice if it violates
                  accuracy standards or platform guidelines.
                </Rule>
              </Section>

              <Section
                id="termination"
                number={6}
                title="Account Termination"
                icon={<AlertTriangleIcon />}
              >
                <p className="mb-4">
                  YOG reserves the right to suspend or permanently terminate
                  seller accounts under the following circumstances:
                </p>
                <Rule good={false}>
                  Repeated violations of seller rules or policies.
                </Rule>
                <Rule good={false}>
                  Engaging in fraudulent, deceptive, or illegal activity.
                </Rule>
                <Rule good={false}>
                  Harassment of buyers, staff, or other sellers.
                </Rule>
                <Rule good={false}>
                  Failure to maintain listing accuracy after warnings.
                </Rule>
                <p className="mt-3 text-[12px] text-[#9e9890]">
                  Sellers may appeal termination decisions by contacting us
                  within 14 days via email. YOG's decision after appeal review
                  is final.
                </p>
              </Section>

              <Section
                id="legal"
                number={7}
                title="Legal & Disputes"
                icon={<ScaleIcon />}
              >
                <p className="mb-4">
                  These Terms of Service are governed by the laws of the Federal
                  Democratic Republic of Ethiopia. By using the platform, you
                  agree to resolve any disputes through negotiation first, then
                  applicable local legal channels.
                </p>
                <Rule good={true}>
                  YOG acts as a neutral platform and is not a party to any
                  transaction between buyers and sellers.
                </Rule>
                <Rule good={false}>
                  YOG assumes no liability for financial loss, damaged goods, or
                  failed meetups between users.
                </Rule>
                <Rule good={true}>
                  We reserve the right to update these terms at any time.
                  Continued use of the platform constitutes acceptance of any
                  updates.
                </Rule>
              </Section>

              {/* Agreement footer */}
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: "#1a1714" }}
              >
                <p className="text-[13px] font-semibold text-white mb-1">
                  Ready to apply?
                </p>
                <p className="text-[12px] text-[#9e9890] mb-5 leading-relaxed">
                  By submitting your seller application, you confirm that you
                  have read, understood, and agree to all of the above terms.
                </p>
                <Link
                  href="/seller/apply"
                  className="inline-flex items-center gap-2 bg-white text-[#1a1714] text-[13px] font-bold px-6 py-3 rounded-[11px] hover:bg-[#f6f5f3] transition-all hover:-translate-y-px hover:shadow-lg"
                >
                  Return to Application
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
