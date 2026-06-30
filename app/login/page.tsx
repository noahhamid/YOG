"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";

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
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
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
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [deletionData, setDeletionData] = useState<any>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { redirectTo: "/" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Step 1: check for scheduled deletion first
      const checkRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const checkData = await checkRes.json();

      if (checkData.scheduledForDeletion) {
        setDeletionData(checkData);
        setShowDeletionModal(true);
        setIsLoading(false);
        return;
      }

      // Step 2: sign in with NextAuth
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push("/");
      router.refresh();
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
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();

      if (res.ok) {
        // Account restored — now sign in
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Account restored. Please log in.");
          setShowDeletionModal(false);
          return;
        }

        router.push("/");
        router.refresh();
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
    "w-full pl-10 pr-4 py-3 rounded-[10px] text-[13px] font-medium text-[#1a1714] bg-white placeholder:text-[#c4bfb9] focus:outline-none transition-all";

  return (
    <>
      <div
        className="min-h-screen bg-[#0D0C0A] flex items-center justify-center p-4"
        style={{ fontFamily: "'Sora',sans-serif" }}
      >
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">
          {/* LEFT — editorial brand panel */}
          <div className="hidden lg:flex relative bg-[#0D0C0A] p-11 flex-col justify-between overflow-hidden">
            {/* diagonal grain texture */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(201,168,76,0.045) 2px, rgba(201,168,76,0.045) 3px)",
              }}
            />
            {/* ambient gold glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: "-80px",
                left: "-60px",
                width: "340px",
                height: "340px",
                background:
                  "radial-gradient(circle, rgba(201,168,76,0.13) 0%, transparent 70%)",
              }}
            />

            <Link href="/" className="relative z-10">
              <span
                className="text-[38px] font-black tracking-[6px] text-[#C9A84C] cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  letterSpacing: "0.2em",
                }}
              >
                YOG
              </span>
            </Link>

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#C9A84C] mb-4">
                <span className="block w-6 h-px bg-[#C9A84C]" />
                Curated fashion
              </div>
              <h1
                className="text-[36px] leading-[1.12] italic text-[#F0EDE6] mb-5"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Style that
                <br />
                speaks before
                <br />
                you <span className="not-italic text-[#C9A84C]">do.</span>
              </h1>
              <p className="text-[13px] text-[#6B6560] leading-relaxed max-w-[240px]">
                A marketplace for people who know the difference between wearing
                clothes and wearing intention.
              </p>
            </div>

            <p className="relative z-10 text-[11px] text-[#4A4540] font-medium tracking-wide">
              Est. 2024 &nbsp;·&nbsp; Addis &nbsp;·&nbsp; The World
            </p>
          </div>

          {/* RIGHT — form panel */}
          <div className="bg-[#F0EDE6] p-8 sm:p-11 flex flex-col justify-center">
            <div className="lg:hidden text-center mb-6">
              <Link href="/">
                <span
                  className="text-[34px] font-black tracking-[6px] text-[#1a1714] cursor-pointer hover:opacity-70 transition-opacity"
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    letterSpacing: "0.18em",
                  }}
                >
                  YOG
                </span>
              </Link>
            </div>

            <div className="mb-7">
              <h2 className="text-[22px] font-semibold text-[#1a1714] tracking-tight mb-1">
                Welcome back
              </h2>
              <p className="text-[13px] text-[#9e9890]">
                Sign in to your account
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-[10px] text-[13px] font-semibold text-[#1a1714] bg-white hover:bg-[#F7F5F2] transition-colors cursor-pointer mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ border: "1px solid #D8D4CE" }}
            >
              {isGoogleLoading ? (
                <div className="w-4 h-4 border-2 border-[#1a1714] border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleLogo />
              )}
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[#D8D4CE]" />
              <span className="text-[11px] text-[#b0aba5] font-medium tracking-wide whitespace-nowrap">
                or with email
              </span>
              <div className="flex-1 h-px bg-[#D8D4CE]" />
            </div>

            {error && (
              <div
                className="mb-4 px-3 py-2.5 rounded-[8px] text-[12px] font-medium text-[#C0392B] bg-[#FFF0EF]"
                style={{ border: "1px solid #FEC9C5" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.1em] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b0aba5]">
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
                    style={{
                      border: "1px solid #D8D4CE",
                      boxShadow: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#C9A84C";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(201,168,76,0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#D8D4CE";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-[#9e9890] uppercase tracking-[0.1em]">
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
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b0aba5]">
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
                    style={{
                      border: "1px solid #D8D4CE",
                      boxShadow: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#C9A84C";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(201,168,76,0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#D8D4CE";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b0aba5] hover:text-[#6B6560] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full mt-1 bg-[#1a1714] text-white py-3.5 rounded-[10px] text-[13px] font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-[#2E2A26] transition-all cursor-pointer hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(201,168,76,0.15) 0%, transparent 60%)",
                  }}
                />
                <span className="relative flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Log in <ArrowIcon />
                    </>
                  )}
                </span>
              </button>
            </form>

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
      </div>

      <AnimatePresence>
        {showDeletionModal && deletionData && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isCancelling && setShowDeletionModal(false)}
          >
            <motion.div
              className="bg-[#F0EDE6] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              <div className="relative p-6 bg-[#1a1714]">
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: "#C9A84C" }}
                />
                <div
                  className="w-11 h-11 rounded-[10px] flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(201,168,76,0.15)",
                    border: "1px solid rgba(201,168,76,0.3)",
                    color: "#C9A84C",
                  }}
                >
                  <AlertIcon />
                </div>
                <h3
                  className="text-lg font-bold text-[#F0EDE6] mb-1"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  Account scheduled for deletion
                </h3>
                <p className="text-[12px] text-[#9e9890]">
                  Your account will be removed in{" "}
                  <span className="font-bold" style={{ color: "#C9A84C" }}>
                    {deletionData.daysRemaining} day
                    {deletionData.daysRemaining !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>

              <div className="p-6">
                <div
                  className="bg-white rounded-[10px] p-3.5 mb-4"
                  style={{ border: "1px solid #D8D4CE" }}
                >
                  <p className="text-[12px] text-[#6B6560] leading-relaxed">
                    <span className="font-bold block mb-0.5 text-[13px] text-[#1a1714]">
                      Deletion date
                    </span>
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

                <p className="text-[13px] text-[#6B6560] leading-relaxed mb-5">
                  Cancel the deletion to keep your account, orders, and reviews
                  intact.
                </p>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => setShowDeletionModal(false)}
                    disabled={isCancelling}
                    className="flex-1 px-4 py-3 rounded-[10px] text-[13px] font-bold text-[#1a1714] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ border: "1px solid #D8D4CE" }}
                  >
                    Go back
                  </button>
                  <button
                    onClick={handleCancelDeletion}
                    disabled={isCancelling}
                    className="flex-1 px-4 py-3 rounded-[10px] text-[13px] font-bold text-[#0D0C0A] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: "#C9A84C" }}
                  >
                    {isCancelling ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#0D0C0A] border-t-transparent rounded-full animate-spin" />
                        Cancelling…
                      </>
                    ) : (
                      "Keep my account"
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
