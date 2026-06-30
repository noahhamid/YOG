"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SellerOnboarding from "@/components/SellerOnboarding";

export default function SellerApplyPage() {
  const router = useRouter();
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login?redirect=/seller/apply");
    return null;
  }

  return <SellerOnboarding />;
}
