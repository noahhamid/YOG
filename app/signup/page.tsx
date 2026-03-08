"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
const LockIcon = () => (
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
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
const BackIcon = () => (
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
const EyeIcon = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
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
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const GoogleLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) setStep("otp");
      else setError(data.error || "Failed to send OTP");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem("yog_user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userLoggedIn"));
        router.push("/");
      } else setError(data.error || "Invalid OTP");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    "w-full pl-10 pr-4 py-3 rounded-[11px] text-[13px] font-medium text-[#1a1714] bg-[#f6f5f3] placeholder:text-[#c4c0bb] focus:outline-none focus:bg-white transition-all";
  const Lbl = ({
    icon,
    text,
    optional,
  }: {
    icon: React.ReactNode;
    text: string;
    optional?: boolean;
  }) => (
    <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.9px] mb-1.5">
      <span className="text-[#b8b4ae]">{icon}</span>
      {text}
      {optional && (
        <span className="font-normal normal-case tracking-normal text-[#c4c0bb] ml-0.5">
          optional
        </span>
      )}
    </label>
  );

  return (
    <div
      className="min-h-screen bg-[#f6f5f3] flex items-center justify-center px-4 py-12"
      style={{ fontFamily: "'Sora',sans-serif" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span
              className="text-[42px] font-black cursor-pointer hover:opacity-70 transition-opacity text-[#1a1714]"
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                letterSpacing: "0.18em",
              }}
            >
              YOG
            </span>
          </Link>
          <p className="text-[12px] text-[#9e9890] mt-1 font-medium">
            {step === "details" ? "Create your account" : "Verify your email"}
          </p>
        </div>

        <div
          className="bg-white rounded-2xl p-6"
          style={{ border: "1px solid #e8e4de" }}
        >
          {step === "details" ? (
            <>
              {/* Google */}
              <button
                onClick={() => alert("Google Sign In coming soon!")}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-[11px] text-[13px] font-semibold text-[#1a1714] bg-[#f6f5f3] hover:bg-[#edeae6] transition-colors cursor-pointer mb-5"
                style={{ border: "1px solid #e8e4de" }}
              >
                <GoogleLogo /> Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-[#e8e4de]" />
                <span className="text-[11px] text-[#b8b4ae] font-medium">
                  or with email
                </span>
                <div className="flex-1 h-px bg-[#e8e4de]" />
              </div>

              {error && (
                <div
                  className="mb-4 px-3 py-2.5 rounded-[10px] text-[12px] text-red-600 bg-red-50"
                  style={{ border: "1px solid #fecaca" }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSendOTP} className="flex flex-col gap-3">
                <div>
                  <Lbl icon={<UserIcon />} text="Full Name" />
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8b4ae]">
                      <UserIcon />
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className={inputBase}
                      style={{ border: "1px solid #e8e4de" }}
                    />
                  </div>
                </div>
                <div>
                  <Lbl icon={<MailIcon />} text="Email" />
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8b4ae]">
                      <MailIcon />
                    </span>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className={inputBase}
                      style={{ border: "1px solid #e8e4de" }}
                    />
                  </div>
                </div>
                <div>
                  <Lbl icon={<LockIcon />} text="Password" />
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8b4ae]">
                      <LockIcon />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="At least 6 characters"
                      className={`${inputBase} pr-10`}
                      style={{ border: "1px solid #e8e4de" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b8b4ae] hover:text-[#9e9890] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                <div>
                  <Lbl icon={<PhoneIcon />} text="Phone" optional />
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8b4ae]">
                      <PhoneIcon />
                    </span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+251 9XX XXX XXX"
                      className={inputBase}
                      style={{ border: "1px solid #e8e4de" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-1 bg-[#1a1714] text-white py-3.5 rounded-[12px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-all cursor-pointer hover:-translate-y-px hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Sending code…
                    </>
                  ) : (
                    <>
                      Continue <ArrowIcon />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* OTP step */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#1a1714] flex items-center justify-center mx-auto mb-4 text-white">
                  <MailIcon />
                </div>
                <h2 className="text-[16px] font-extrabold text-[#1a1714] mb-1">
                  Check your email
                </h2>
                <p className="text-[12px] text-[#9e9890]">
                  We sent a 6-digit code to
                  <br />
                  <span className="font-bold text-[#1a1714]">
                    {formData.email}
                  </span>
                </p>
              </div>

              {error && (
                <div
                  className="mb-4 px-3 py-2.5 rounded-[10px] text-[12px] text-red-600 bg-red-50"
                  style={{ border: "1px solid #fecaca" }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="flex flex-col gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.9px] mb-1.5 text-center">
                    Verification code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full px-4 py-4 rounded-[11px] text-center text-[26px] font-black tracking-[12px] text-[#1a1714] bg-[#f6f5f3] focus:outline-none focus:bg-white transition-all"
                    style={{
                      border: "1px solid #e8e4de",
                      fontFamily: "'Courier New',monospace",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full mt-1 bg-[#1a1714] text-white py-3.5 rounded-[12px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-all cursor-pointer hover:-translate-y-px hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Verifying…
                    </>
                  ) : (
                    <>
                      Verify &amp; Create Account <ArrowIcon />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="flex items-center justify-center gap-1.5 mx-auto text-[12px] font-semibold text-[#9e9890] hover:text-[#1a1714] transition-colors cursor-pointer mt-1"
                >
                  <BackIcon /> Back to sign up
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-[12px] text-[#9e9890] mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#1a1714] hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
