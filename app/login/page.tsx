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
const AlertIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
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

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [deletionData, setDeletionData] = useState<any>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.scheduledForDeletion) {
          setDeletionData(data);
          setShowDeletionModal(true);
          setIsLoading(false);
          return;
        }

        if (data.user) {
          localStorage.setItem("yog_user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("userLoggedIn"));
          router.push("/");
        }
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDeletion = async () => {
    if (!deletionData) return;

    setIsCancelling(true);
    setError("");

    try {
      const res = await fetch("/api/user/cancel-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: deletionData.user.id }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        localStorage.setItem("yog_user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userLoggedIn"));
        router.push("/");
      } else {
        setError(data.error || "Failed to cancel deletion");
        setShowDeletionModal(false);
      }
    } catch {
      setError("An error occurred. Please try again.");
      setShowDeletionModal(false);
    } finally {
      setIsCancelling(false);
    }
  };

  const inputBase =
    "w-full pl-10 pr-4 py-3 rounded-[11px] text-[13px] font-medium text-[#1a1714] bg-[#f6f5f3] placeholder:text-[#c4c0bb] focus:outline-none focus:bg-white transition-all";

  return (
    <>
      <div
        className="min-h-screen bg-[#f6f5f3] flex items-center justify-center px-4 py-12"
        style={{ fontFamily: "'Sora',sans-serif" }}
      >
        <div className="w-full max-w-sm">
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
              Welcome back
            </p>
          </div>

          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: "1px solid #e8e4de" }}
          >
            <button
              onClick={() => alert("Google Sign In coming soon!")}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-[11px] text-[13px] font-semibold text-[#1a1714] bg-[#f6f5f3] hover:bg-[#edeae6] transition-colors cursor-pointer mb-5"
              style={{ border: "1px solid #e8e4de" }}
            >
              <GoogleLogo /> Continue with Google
            </button>

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

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.9px] mb-1.5">
                  Email
                </label>
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.9px]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-bold text-[#1a1714] hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8b4ae]">
                    <LockIcon />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter your password"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 bg-[#1a1714] text-white py-3.5 rounded-[12px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-all cursor-pointer hover:-translate-y-px hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in…
                  </>
                ) : (
                  <>
                    Log In <ArrowIcon />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-[12px] text-[#9e9890] mt-5">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-[#1a1714] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showDeletionModal && deletionData && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isCancelling && setShowDeletionModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              <div
                className="p-6 bg-gradient-to-br from-red-50 to-orange-50"
                style={{ borderBottom: "1px solid #fecaca" }}
              >
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                  <AlertIcon />
                </div>
                <h3
                  className="text-xl font-bold text-[#1a1714] mb-2"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Account Scheduled for Deletion
                </h3>
                <p className="text-sm text-[#991b1b] leading-relaxed font-medium">
                  Your account will be permanently deleted in{" "}
                  <span className="font-bold">
                    {deletionData.daysRemaining} day
                    {deletionData.daysRemaining !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>

              <div className="p-6">
                <div
                  className="bg-red-50 rounded-xl p-4 mb-5"
                  style={{ border: "1px solid #fecaca" }}
                >
                  <p className="text-xs text-[#991b1b] leading-relaxed">
                    <span className="font-bold block mb-1">Deletion Date:</span>
                    {new Date(deletionData.deletionDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>

                <p className="text-sm text-[#1a1714] leading-relaxed mb-6">
                  Would you like to <strong>cancel the deletion</strong> and
                  keep your account? All your data, orders, and reviews will be
                  preserved.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeletionModal(false)}
                    disabled={isCancelling}
                    className="flex-1 px-4 py-3 border-2 border-[#e8e4de] rounded-xl text-sm font-bold text-[#1a1714] hover:bg-[#f6f5f3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleCancelDeletion}
                    disabled={isCancelling}
                    className="flex-1 px-4 py-3 bg-[#1a1714] text-white rounded-xl text-sm font-bold hover:bg-[#333] transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCancelling ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      "Cancel Deletion"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
