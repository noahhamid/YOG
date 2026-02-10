"use client";

import { useState, useEffect } from "react";
import { Mail, ArrowRight, ShoppingBag, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
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
      console.log("OTP sent successfully!");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      setError(error.message || "Failed to send OTP. Please try again.");
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
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

      console.log("✅ Email verified successfully!", data);

      // Store user in localStorage
      if (data.user) {
        localStorage.setItem("yog_user", JSON.stringify(data.user));

        // Dispatch custom event for navbar to listen
        window.dispatchEvent(new Event("userLoggedIn"));
      }

      setIsLoading(false);
      setStep("success");

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      setError(error.message || "Invalid OTP. Please try again.");
      setIsLoading(false);
      setOtp(["", "", "", "", "", ""]);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      setIsLoading(false);
      alert("New OTP sent to " + email);
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      setError("Failed to resend OTP. Please try again.");
      setIsLoading(false);
    }
  };

  // Rest of your JSX stays the same...
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-3 mb-8 group"
        >
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
            <ShoppingBag className="text-black" size={28} />
          </div>
          <span
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            YOG
          </span>
        </Link>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {step === "email" && "Welcome to YOG"}
              {step === "otp" && "Verify Your Email"}
              {step === "success" && "You're All Set!"}
            </h1>
            <p className="text-gray-600">
              {step === "email" && "Enter your email to continue"}
              {step === "otp" && `We sent a code to ${email}`}
              {step === "success" && "Email verified successfully"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
              <p className="text-sm text-red-600 text-center font-semibold">
                {error}
              </p>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className={`h-1.5 w-16 rounded-full transition-all duration-300 ${step === "email" ? "bg-black" : "bg-gray-300"}`}
            ></div>
            <div
              className={`h-1.5 w-16 rounded-full transition-all duration-300 ${step === "otp" ? "bg-black" : "bg-gray-300"}`}
            ></div>
            <div
              className={`h-1.5 w-16 rounded-full transition-all duration-300 ${step === "success" ? "bg-black" : "bg-gray-300"}`}
            ></div>
          </div>

          {/* Step 1: Email */}
          {step === "email" && (
            <form
              onSubmit={handleEmailSubmit}
              className="space-y-6 animate-fadeIn"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Mail size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all text-lg"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  📧 We'll send you a verification code
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.includes("@")}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Code...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight
                      className="group-hover:translate-x-1 transition-transform"
                      size={20}
                    />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === "otp" && (
            <form
              onSubmit={handleOtpSubmit}
              className="space-y-6 animate-fadeIn"
            >
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
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-sm text-gray-600 hover:text-black font-semibold transition-colors disabled:opacity-50"
                  >
                    Didn't receive code?{" "}
                    <span className="underline">Resend OTP</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.some((d) => !d)}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={{ fontFamily: "'Poppins', sans-serif" }}
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

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp(["", "", "", "", "", ""]);
                  setError("");
                }}
                className="w-full text-gray-600 hover:text-black transition-colors text-sm font-semibold"
              >
                ← Change email address
              </button>
            </form>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="text-center py-8 animate-fadeIn">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scaleIn">
                <Check className="text-green-600" size={40} />
              </div>
              <h3
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Email Verified! ✓
              </h3>
              <p className="text-gray-600 mb-2">Welcome to YOG! 🎉</p>
              <p className="text-sm text-gray-500">
                Redirecting you to home...
              </p>
            </div>
          )}

          {/* Footer */}
          {step !== "success" && (
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to YOG's{" "}
                <Link
                  href="/terms"
                  className="text-black font-semibold hover:underline"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-black font-semibold hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Additional Links */}
        {step === "email" && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Want to sell on YOG?{" "}
              <Link
                href="/seller/apply"
                className="text-white font-semibold hover:underline"
              >
                Apply as a Seller
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.3s ease-out;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
