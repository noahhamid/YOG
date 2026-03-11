"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
const CheckIcon = () => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const KeyIcon = () => (
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
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("OTP sent to your email!");
        setStep("otp");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Password reset successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    "w-full pl-10 pr-4 py-3 rounded-[11px] text-[13px] font-medium text-[#1a1714] bg-[#f6f5f3] placeholder:text-[#c4c0bb] focus:outline-none focus:bg-white transition-all";

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
              className="text-[42px] font-black tracking-[6px] text-[#1a1714] cursor-pointer hover:opacity-70 transition-opacity"
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                letterSpacing: "0.18em",
              }}
            >
              YOG
            </span>
          </Link>
          <p className="text-[12px] text-[#9e9890] mt-1 font-medium">
            Reset your password
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-2xl p-6"
          style={{ border: "1px solid #e8e4de" }}
        >
          {/* Success */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 px-3 py-2.5 rounded-[10px] text-[12px] text-green-600 bg-green-50 flex items-center gap-2"
                style={{ border: "1px solid #bbf7d0" }}
              >
                <CheckIcon />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <div
              className="mb-4 px-3 py-2.5 rounded-[10px] text-[12px] text-red-600 bg-red-50"
              style={{ border: "1px solid #fecaca" }}
            >
              {error}
            </div>
          )}

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleSendOTP} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.9px] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8b4ae]">
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputBase}
                    style={{ border: "1px solid #e8e4de" }}
                  />
                </div>
                <p className="text-[11px] text-[#9e9890] mt-1.5">
                  We'll send a 6-digit code to this email
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 bg-[#1a1714] text-white py-3.5 rounded-[12px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-all cursor-pointer hover:-translate-y-px hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending OTP…
                  </>
                ) : (
                  <>
                    Send OTP <ArrowIcon />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP + New Password */}
          {step === "otp" && (
            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-3"
            >
              <div>
                <label className="block text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.9px] mb-1.5">
                  Verification Code
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8b4ae]">
                    <KeyIcon />
                  </span>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit code"
                    className={inputBase}
                    style={{ border: "1px solid #e8e4de" }}
                    maxLength={6}
                  />
                </div>
                <p className="text-[11px] text-[#9e9890] mt-1.5">
                  Check your email for the code
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.9px] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8b4ae]">
                    <LockIcon />
                  </span>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={inputBase}
                    style={{ border: "1px solid #e8e4de" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.9px] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8b4ae]">
                    <LockIcon />
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
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
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resetting…
                  </>
                ) : (
                  <>
                    Reset Password <ArrowIcon />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="text-[12px] text-[#9e9890] hover:text-[#1a1714] font-semibold transition-colors"
              >
                ← Back to email
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[12px] text-[#9e9890] mt-5">
          Remember your password?{" "}
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
