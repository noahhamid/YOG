"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SellerOnboarding from "@/components/SellerOnboarding";

export default function SellerApplyPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("yog_user");

    if (!userStr) {
      // Not logged in - redirect to login
      router.push("/login?redirect=/seller/apply");
    } else {
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, [router]);

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Show the seller onboarding form
  return <SellerOnboarding />;
}
