"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import {
  Camera,
  Save,
  Eye,
  MapPin,
  Instagram,
  Link as LinkIcon,
  Store,
  FileText,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function SellerSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    brandName: "",
    storeSlug: "",
    storeLogo: "",
    storeCover: "",
    storeDescription: "",
    instagram: "",
    location: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== "SELLER" && user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    try {
      const res = await fetch("/api/seller/settings", {
        headers: { "x-user-data": userStr },
      });

      const data = await res.json();

      if (res.ok && data.seller) {
        setFormData({
          brandName: data.seller.brandName || "",
          storeSlug: data.seller.storeSlug || "",
          storeLogo: data.seller.storeLogo || "",
          storeCover: data.seller.storeCover || "",
          storeDescription: data.seller.storeDescription || "",
          instagram: data.seller.instagram || "",
          location: data.seller.location || "",
        });
      }
    } catch (err) {
      setError("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ NEW: UPLOAD TO CLOUDINARY
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const userStr = localStorage.getItem("yog_user");
    if (!userStr) return;

    // Set loading state
    if (type === "logo") setIsUploadingLogo(true);
    else setIsUploadingCover(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-user-data": userStr,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setFormData((prev) => ({
          ...prev,
          [type === "logo" ? "storeLogo" : "storeCover"]: data.url,
        }));
        setSuccess(`${type === "logo" ? "Logo" : "Cover"} uploaded!`);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
      setTimeout(() => setError(""), 3000);
    } finally {
      if (type === "logo") setIsUploadingLogo(false);
      else setIsUploadingCover(false);
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const userStr = localStorage.getItem("yog_user");
      const res = await fetch("/api/seller/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": userStr || "",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to save");
      }
    } catch (err) {
      setError("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32">
          <Loader2 className="w-12 h-12 animate-spin text-black" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/seller/dashboard"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4 font-medium transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </Link>
              <h1 className="text-4xl font-black mb-2">Store Settings</h1>
              <p className="text-gray-600">Customize your store profile</p>
            </div>
            {formData.storeSlug && (
              <Link
                href={`/store/${formData.storeSlug}`}
                target="_blank"
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-black rounded-full font-bold hover:bg-black hover:text-white transition-all"
              >
                <Eye size={18} />
                View Store
              </Link>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Cover Image - ✅ USE NEXT IMAGE */}
            <div className="relative h-72 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 group">
              {formData.storeCover ? (
                <Image
                  src={formData.storeCover}
                  alt="Cover"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/80">
                    <Camera size={56} className="mx-auto mb-3" />
                    <p className="text-lg font-semibold">Add Cover Image</p>
                  </div>
                </div>
              )}

              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {isUploadingCover ? (
                  <div className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-xl flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  <>
                    <div className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-xl">
                      Change Cover
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "cover")}
                      className="hidden"
                      disabled={isUploadingCover}
                    />
                  </>
                )}
              </label>
            </div>

            {/* Logo - ✅ USE NEXT IMAGE */}
            <div className="px-10 -mt-20 relative z-10 mb-8">
              <div className="relative w-40 h-40 group">
                {formData.storeLogo ? (
                  <Image
                    src={formData.storeLogo}
                    alt="Logo"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover rounded-3xl border-8 border-white shadow-2xl"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-black to-gray-700 rounded-3xl border-8 border-white shadow-2xl flex items-center justify-center">
                    <Store size={56} className="text-white" />
                  </div>
                )}

                <label className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                  {isUploadingLogo ? (
                    <Loader2 size={32} className="text-white animate-spin" />
                  ) : (
                    <>
                      <Camera size={32} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "logo")}
                        className="hidden"
                        disabled={isUploadingLogo}
                      />
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Form - SAME AS BEFORE */}
            <div className="px-10 pb-10 space-y-6">
              {/* Store Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-2">
                  <Store size={18} />
                  Store Name
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) =>
                    setFormData({ ...formData, brandName: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                  placeholder="Your Store Name"
                />
              </div>

              {/* Store URL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-2">
                  <LinkIcon size={18} />
                  Store URL
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium">
                    yog.com/store/
                  </span>
                  <input
                    type="text"
                    value={formData.storeSlug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        storeSlug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, ""),
                      })
                    }
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                    placeholder="your-store"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-2">
                  <FileText size={18} />
                  Description
                </label>
                <textarea
                  value={formData.storeDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      storeDescription: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors resize-none"
                  placeholder="Tell customers about your store..."
                />
              </div>

              {/* Location & Instagram */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-2">
                    <MapPin size={18} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                    placeholder="Addis Ababa"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-2">
                    <Instagram size={18} />
                    Instagram
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">@</span>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instagram: e.target.value.replace("@", ""),
                        })
                      }
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                      placeholder="yourhandle"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-3 shadow-xl"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
