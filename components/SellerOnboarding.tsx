"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

// ── Icons ──────────────────────────────────────────────────────────────────
const StoreIcon = () => (
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
const UserIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
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
const MailIcon = () => (
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
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const InstagramIcon = () => (
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
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const MapPinIcon = () => (
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
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ShirtIcon = () => (
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
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
  </svg>
);
const BriefcaseIcon = () => (
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
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const ClockIcon = () => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const TextIcon = () => (
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
    <line x1="17" y1="10" x2="3" y2="10" />
    <line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" />
    <line x1="17" y1="18" x2="3" y2="18" />
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
const AlertIcon = () => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
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
const SparkIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3L9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5z" />
  </svg>
);
const DollarIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const ZapIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const BagIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

// ── Types ──────────────────────────────────────────────────────────────────
const clothingTypes = [
  "Streetwear",
  "Casual Wear",
  "Formal Wear",
  "Athletic Wear",
  "Traditional Wear",
  "Accessories",
  "Mixed Collection",
];
const businessTypes = [
  "Individual Designer",
  "Small Business",
  "Established Brand",
  "Wholesaler",
];

const inputClass = (err?: string) =>
  `w-full px-4 py-3 rounded-[11px] text-[13px] font-medium text-[#1a1714] bg-white placeholder:text-[#c4c0bb] focus:outline-none transition-all ${
    err ? "border-red-400" : "border-[#e8e4de] focus:border-[#1a1714]"
  }`;

const LabelRow = ({
  icon,
  label,
  optional,
}: {
  icon: React.ReactNode;
  label: string;
  optional?: boolean;
}) => (
  <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.9px] mb-1.5">
    <span className="text-[#b8b4ae]">{icon}</span>
    {label}
    {optional && (
      <span className="font-normal normal-case tracking-normal text-[#c4c0bb] ml-1">
        optional
      </span>
    )}
  </label>
);

const ErrMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1.5">
      <AlertIcon />
      {msg}
    </p>
  ) : null;

// ── Main component ─────────────────────────────────────────────────────────
export default function SellerOnboarding() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    brandName: "",
    ownerName: "",
    phone: "",
    email: "",
    instagram: "",
    location: "",
    clothingType: "",
    businessType: "",
    experience: "",
    description: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("yog_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      setFormData((p) => ({ ...p, email: user.email, ownerName: user.name }));
    }
  }, []);

  const set = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.brandName.trim()) e.brandName = "Brand name is required";
    if (!formData.ownerName.trim()) e.ownerName = "Owner name is required";
    if (!formData.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[0-9+\-\s()]+$/.test(formData.phone))
      e.phone = "Invalid phone number";
    if (!formData.email.trim()) e.email = "Email is required";
    if (!formData.location.trim()) e.location = "Location is required";
    if (!formData.clothingType) e.clothingType = "Select a clothing type";
    if (!formData.businessType) e.businessType = "Select a business type";
    if (!formData.termsAccepted) e.termsAccepted = "You must accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!currentUser) {
      router.push("/login?redirect=/seller/apply");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/seller/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem(
          "yog_user",
          JSON.stringify({ ...currentUser, role: "SELLER" }),
        );
        setSubmitSuccess(true);
      } else {
        alert(data.error || "Failed to submit");
      }
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (submitSuccess) {
    return (
      <>
        <Navbar />
        <div
          className="min-h-screen bg-[#f6f5f3] flex items-center justify-center px-4 py-20"
          style={{ fontFamily: "'Sora',sans-serif" }}
        >
          <div className="w-full max-w-md">
            <div
              className="bg-white rounded-3xl p-8 text-center mb-4"
              style={{ border: "1px solid #e8e4de" }}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#1a1714] flex items-center justify-center mx-auto mb-5 text-white">
                <CheckIcon />
              </div>
              <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.2px] mb-1">
                Submitted
              </p>
              <h2 className="text-[24px] font-extrabold text-[#1a1714] tracking-tight mb-2">
                Application received!
              </h2>
              <p className="text-[13px] text-[#9e9890] leading-relaxed max-w-xs mx-auto">
                Our team will review your application and contact you within 2–3
                business days.
              </p>
            </div>

            <div
              className="bg-white rounded-2xl p-5 mb-4"
              style={{ border: "1px solid #e8e4de" }}
            >
              <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.2px] mb-3">
                Next steps
              </p>
              {[
                [
                  <MailIcon />,
                  "Check your email",
                  `Confirmation sent to ${formData.email}`,
                ],
                [
                  <PhoneIcon />,
                  "Stay reachable",
                  `We may call ${formData.phone} for verification`,
                ],
              ].map(([icon, title, desc], i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${i > 0 ? "mt-3 pt-3" : ""}`}
                  style={i > 0 ? { borderTop: "1px solid #e8e4de" } : {}}
                >
                  <div
                    className="w-8 h-8 rounded-[9px] bg-[#f6f5f3] flex items-center justify-center text-[#1a1714] shrink-0"
                    style={{ border: "1px solid #e8e4de" }}
                  >
                    {icon as React.ReactNode}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1a1714]">
                      {title as string}
                    </p>
                    <p className="text-[11px] text-[#9e9890]">
                      {desc as string}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                router.push("/");
                router.refresh();
              }}
              className="w-full bg-[#1a1714] text-white py-3.5 rounded-[12px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-all cursor-pointer hover:-translate-y-px hover:shadow-lg"
            >
              Back to Home <ArrowIcon />
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Section header helper ────────────────────────────────────────────────
  const SectionHead = ({ label, step }: { label: string; step: number }) => (
    <div
      className="flex items-center gap-3 mb-5 pb-4"
      style={{ borderBottom: "1px solid #e8e4de" }}
    >
      <div className="w-6 h-6 rounded-full bg-[#1a1714] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
        {step}
      </div>
      <p className="text-[14px] font-extrabold text-[#1a1714]">{label}</p>
    </div>
  );

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen bg-[#f6f5f3] pt-28 pb-20 px-4"
        style={{ fontFamily: "'Sora',sans-serif" }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <p className="text-[11px] font-bold text-[#9e9890] uppercase tracking-[1.2px] mb-1.5">
              Become a seller
            </p>
            <h1 className="text-[30px] font-extrabold text-[#1a1714] tracking-tight leading-tight mb-2">
              Apply to sell on Yog
            </h1>
            <p className="text-[13px] text-[#9e9890] max-w-lg leading-relaxed">
              Join Ethiopia's premier fashion marketplace. We review each
              application to ensure quality for our buyers.
            </p>
          </div>

          {/* Benefits strip */}
          <div className="grid grid-cols-3 gap-3 mb-7">
            {[
              [<DollarIcon />, "Zero listing fees", "Only pay when you sell"],
              [<ZapIcon />, "Fast payments", "Paid within 24 hrs"],
              [<BagIcon />, "Marketing support", "Featured placements"],
            ].map(([icon, title, desc], i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 flex flex-col gap-2"
                style={{ border: "1px solid #e8e4de" }}
              >
                <div
                  className="w-8 h-8 rounded-[9px] bg-[#f6f5f3] flex items-center justify-center text-[#1a1714]"
                  style={{ border: "1px solid #e8e4de" }}
                >
                  {icon as React.ReactNode}
                </div>
                <p className="text-[12px] font-bold text-[#1a1714] leading-tight">
                  {title as string}
                </p>
                <p className="text-[11px] text-[#9e9890]">{desc as string}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* ─ Business Info ─ */}
            <div
              className="bg-white rounded-2xl p-6"
              style={{ border: "1px solid #e8e4de" }}
            >
              <SectionHead label="Business Information" step={1} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <LabelRow icon={<StoreIcon />} label="Brand Name" />
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={set}
                    placeholder="e.g., UrbanStyle Co."
                    className={inputClass(errors.brandName)}
                    style={{
                      border: `1px solid ${errors.brandName ? "#f87171" : "#e8e4de"}`,
                    }}
                  />
                  <ErrMsg msg={errors.brandName} />
                </div>
                <div>
                  <LabelRow icon={<UserIcon />} label="Owner Name" />
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={set}
                    placeholder="Your full name"
                    className={inputClass(errors.ownerName)}
                    style={{
                      border: `1px solid ${errors.ownerName ? "#f87171" : "#e8e4de"}`,
                    }}
                  />
                  <ErrMsg msg={errors.ownerName} />
                </div>
                <div>
                  <LabelRow icon={<BriefcaseIcon />} label="Business Type" />
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={set}
                    className={`${inputClass(errors.businessType)} cursor-pointer`}
                    style={{
                      border: `1px solid ${errors.businessType ? "#f87171" : "#e8e4de"}`,
                    }}
                  >
                    <option value="">Select type</option>
                    {businessTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ErrMsg msg={errors.businessType} />
                </div>
                <div>
                  <LabelRow icon={<ShirtIcon />} label="Clothing Type" />
                  <select
                    name="clothingType"
                    value={formData.clothingType}
                    onChange={set}
                    className={`${inputClass(errors.clothingType)} cursor-pointer`}
                    style={{
                      border: `1px solid ${errors.clothingType ? "#f87171" : "#e8e4de"}`,
                    }}
                  >
                    <option value="">Select type</option>
                    {clothingTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ErrMsg msg={errors.clothingType} />
                </div>
              </div>
            </div>

            {/* ─ Contact Info ─ */}
            <div
              className="bg-white rounded-2xl p-6"
              style={{ border: "1px solid #e8e4de" }}
            >
              <SectionHead label="Contact Information" step={2} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <LabelRow icon={<PhoneIcon />} label="Phone Number" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={set}
                    placeholder="+251 912 345 678"
                    className={inputClass(errors.phone)}
                    style={{
                      border: `1px solid ${errors.phone ? "#f87171" : "#e8e4de"}`,
                    }}
                  />
                  <ErrMsg msg={errors.phone} />
                </div>
                <div>
                  <LabelRow icon={<MailIcon />} label="Email" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={set}
                    readOnly
                    placeholder="your@email.com"
                    className={`${inputClass(errors.email)} bg-[#f6f5f3] text-[#9e9890] cursor-not-allowed`}
                    style={{
                      border: `1px solid ${errors.email ? "#f87171" : "#e8e4de"}`,
                    }}
                  />
                  <ErrMsg msg={errors.email} />
                </div>
                <div>
                  <LabelRow
                    icon={<InstagramIcon />}
                    label="Instagram"
                    optional
                  />
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={set}
                    placeholder="@yourbrand"
                    className={inputClass()}
                    style={{ border: "1px solid #e8e4de" }}
                  />
                </div>
                <div>
                  <LabelRow icon={<MapPinIcon />} label="Location" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={set}
                    placeholder="City, Ethiopia"
                    className={inputClass(errors.location)}
                    style={{
                      border: `1px solid ${errors.location ? "#f87171" : "#e8e4de"}`,
                    }}
                  />
                  <ErrMsg msg={errors.location} />
                </div>
              </div>
            </div>

            {/* ─ About your brand ─ */}
            <div
              className="bg-white rounded-2xl p-6"
              style={{ border: "1px solid #e8e4de" }}
            >
              <SectionHead label="About Your Brand" step={3} />
              <div className="flex flex-col gap-4">
                <div>
                  <LabelRow
                    icon={<ClockIcon />}
                    label="Years of Experience"
                    optional
                  />
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={set}
                    placeholder="e.g., 2 years"
                    className={inputClass()}
                    style={{ border: "1px solid #e8e4de" }}
                  />
                </div>
                <div>
                  <LabelRow
                    icon={<TextIcon />}
                    label="Brand Description"
                    optional
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={set}
                    rows={4}
                    placeholder="Tell us about your brand, products, and what makes you unique…"
                    className={`${inputClass()} resize-none`}
                    style={{ border: "1px solid #e8e4de" }}
                  />
                </div>
              </div>
            </div>

            {/* ─ Review notice ─ */}
            <div
              className="rounded-xl px-4 py-3.5 flex items-start gap-3"
              style={{ background: "#f0ede9", border: "1px solid #e8e4de" }}
            >
              <div className="w-7 h-7 rounded-[8px] bg-[#1a1714] flex items-center justify-center text-white shrink-0 mt-0.5">
                <SparkIcon />
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#1a1714]">
                  Application review
                </p>
                <p className="text-[11px] text-[#9e9890] mt-0.5 leading-relaxed">
                  We review applications within{" "}
                  <strong className="text-[#1a1714]">2–3 business days</strong>{" "}
                  and will contact you via phone and email with next steps.
                </p>
              </div>
            </div>

            {/* ─ Terms ─ */}
            <div
              className="bg-white rounded-2xl px-5 py-4"
              style={{
                border: `1px solid ${errors.termsAccepted ? "#f87171" : "#e8e4de"}`,
              }}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={set}
                    className="sr-only peer"
                  />
                  <div
                    className="w-5 h-5 rounded-[5px] border flex items-center justify-center transition-all peer-checked:bg-[#1a1714] peer-checked:border-[#1a1714] text-white"
                    style={{
                      border: formData.termsAccepted
                        ? "1px solid #1a1714"
                        : "1px solid #e8e4de",
                      background: formData.termsAccepted ? "#1a1714" : "#fff",
                    }}
                  >
                    {formData.termsAccepted && <CheckIcon />}
                  </div>
                </div>
                <p className="text-[12px] text-[#9e9890] leading-relaxed">
                  I agree to Yog's{" "}
                  <a
                    href="/seller-terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1a1714] font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    Terms & Seller Agreement
                  </a>
                  . I understand my application will be reviewed and I may be
                  contacted for additional information.{" "}
                  <span className="text-red-400">*</span>
                </p>
              </label>
              <ErrMsg msg={errors.termsAccepted} />
            </div>

            {/* ─ Submit ─ */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1a1714] text-white py-4 rounded-[12px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-all cursor-pointer hover:-translate-y-px hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Submitting…
                </>
              ) : (
                <>
                  Apply to Sell on Yog <ArrowIcon />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
