"use client";

import { useState } from "react";
import { Mail, ArrowRight, ShoppingBag, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setStep("otp");
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message || "Failed to send OTP");
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const otpCode = otp.join("");

      const response = await fetch("/api/auth/send-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      console.log("✅ User saved to database:", data.user);

      // Store user in localStorage (temporary - we'll add proper sessions later)
      localStorage.setItem("yog_user", JSON.stringify(data.user));

      setStep("success");
      setIsLoading(false);

      // Redirect to home
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Invalid OTP");
      setIsLoading(false);
      setOtp(["", "", "", "", "", ""]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <ShoppingBag className="text-black" size={28} />
          </div>
          <span className="text-4xl font-bold text-white">YOG</span>
        </Link>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            {step === "email" && "Welcome to YOG"}
            {step === "otp" && "Verify Your Email"}
            {step === "success" && "You're All Set!"}
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            {step === "email" && "Enter your email to continue"}
            {step === "otp" && `We sent a code to ${email}`}
            {step === "success" && "Email verified successfully"}
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 text-center font-semibold">
                {error}
              </p>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className={`h-1.5 w-16 rounded-full transition-all ${step === "email" ? "bg-black" : "bg-gray-300"}`}
            ></div>
            <div
              className={`h-1.5 w-16 rounded-full transition-all ${step === "otp" ? "bg-black" : "bg-gray-300"}`}
            ></div>
            <div
              className={`h-1.5 w-16 rounded-full transition-all ${step === "success" ? "bg-black" : "bg-gray-300"}`}
            ></div>
          </div>

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Code...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4 text-center">
                  Enter 6-Digit Code
                </label>
                <div className="flex gap-2 justify-center mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.some((d) => !d)}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Code
                    <Check size={20} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-green-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Email Verified! ✓
              </h3>
              <p className="text-gray-600 mb-2">Welcome to YOG! 🎉</p>
              <p className="text-sm text-gray-500">
                Redirecting you to home...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
