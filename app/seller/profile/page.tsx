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
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { LumaSpin } from "@/components/ui/luma-spin";

// ✅ COMPRESSION HELPER
const compressImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Compression failed"));
          },
          "image/jpeg",
          quality,
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function SellerProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ logo: 0, cover: 0 });
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

      if (!res.ok) throw new Error("Failed to load");

      const data = await res.json();

      if (data.seller) {
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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const userStr = localStorage.getItem("yog_user");
    if (!userStr) return;

    if (type === "logo") {
      setIsUploadingLogo(true);
      setUploadProgress((prev) => ({ ...prev, logo: 0 }));
    } else {
      setIsUploadingCover(true);
      setUploadProgress((prev) => ({ ...prev, cover: 0 }));
    }

    try {
      console.log(`📦 Original size: ${(file.size / 1024).toFixed(0)}KB`);

      if (type === "logo") {
        setUploadProgress((prev) => ({ ...prev, logo: 30 }));
      } else {
        setUploadProgress((prev) => ({ ...prev, cover: 30 }));
      }

      const compressed = await compressImage(
        file,
        type === "logo" ? 800 : 1600,
        type === "logo" ? 800 : 800,
        0.85,
      );

      console.log(
        `✅ Compressed size: ${(compressed.size / 1024).toFixed(0)}KB`,
      );

      if (type === "logo") {
        setUploadProgress((prev) => ({ ...prev, logo: 60 }));
      } else {
        setUploadProgress((prev) => ({ ...prev, cover: 60 }));
      }

      const uploadFormData = new FormData();
      uploadFormData.append("file", compressed, file.name);
      uploadFormData.append("type", type);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-user-data": userStr,
        },
        body: uploadFormData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      if (type === "logo") {
        setUploadProgress((prev) => ({ ...prev, logo: 100 }));
      } else {
        setUploadProgress((prev) => ({ ...prev, cover: 100 }));
      }

      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          [type === "logo" ? "storeLogo" : "storeCover"]: data.url,
        }));
        setSuccess(`✅ ${type === "logo" ? "Logo" : "Cover"} uploaded!`);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
      setTimeout(() => setError(""), 3000);
    } finally {
      if (type === "logo") {
        setIsUploadingLogo(false);
        setUploadProgress((prev) => ({ ...prev, logo: 0 }));
      } else {
        setIsUploadingCover(false);
        setUploadProgress((prev) => ({ ...prev, cover: 0 }));
      }
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!formData.brandName.trim()) {
      setError("Store name is required");
      return;
    }

    if (!formData.storeSlug.trim()) {
      setError("Store URL is required");
      return;
    }

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center pt-32">
          <LumaSpin />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* ✅ HEADER */}
          <div className="mb-8">
            <Link
              href="/seller/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 font-medium transition-colors group"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Dashboard
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                    Store Profile
                  </h1>
                  <Sparkles className="text-yellow-500" size={28} />
                </div>
                <p className="text-gray-600 text-lg">
                  Customize your brand presence
                </p>
              </div>
              {formData.storeSlug && (
                <Link
                  href={`/store/${formData.storeSlug}`}
                  target="_blank"
                  className="group flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all hover:shadow-lg hover:scale-105"
                >
                  <Eye size={18} />
                  <span>Preview Store</span>
                </Link>
              )}
            </div>
          </div>

          {/* ✅ MESSAGES */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top">
              <CheckCircle2 size={20} className="text-green-600" />
              {success}
            </div>
          )}

          {/* ✅ MAIN CARD */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Cover Image */}
            <div className="relative h-64 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden group">
              {formData.storeCover ? (
                <Image
                  src={formData.storeCover}
                  alt="Cover"
                  fill
                  className="object-cover"
                  sizes="1024px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/60">
                  <div className="text-center">
                    <Camera size={48} className="mx-auto mb-3" />
                    <p className="text-sm font-medium">Add Cover Image</p>
                    <p className="text-xs text-white/40 mt-1">
                      1600 × 800 recommended
                    </p>
                  </div>
                </div>
              )}

              {/* Progress Overlay */}
              {isUploadingCover && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm">
                  <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
                  <p className="text-white text-sm mb-3 font-medium">
                    {uploadProgress.cover < 60
                      ? "Compressing..."
                      : "Uploading..."}
                  </p>
                  <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${uploadProgress.cover}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-xs mt-2">
                    {uploadProgress.cover}%
                  </p>
                </div>
              )}

              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                {!isUploadingCover && (
                  <>
                    <div className="bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                      <Camera size={20} />
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

            {/* Logo */}
            <div className="px-8 -mt-20 relative z-10 mb-8">
              <div className="relative w-40 h-40 group">
                {formData.storeLogo ? (
                  <Image
                    src={formData.storeLogo}
                    alt="Logo"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover rounded-3xl border-4 border-white shadow-2xl"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-black via-gray-800 to-gray-900 rounded-3xl border-4 border-white shadow-2xl flex items-center justify-center">
                    <Store size={48} className="text-white" />
                  </div>
                )}

                {/* Progress Overlay */}
                {isUploadingLogo && (
                  <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center rounded-3xl backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
                    <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${uploadProgress.logo}%` }}
                      />
                    </div>
                  </div>
                )}

                <label className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-3xl backdrop-blur-sm">
                  {!isUploadingLogo && (
                    <>
                      <div className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform">
                        <Camera size={24} />
                      </div>
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

            {/* ✅ FORM - MODERN GRID LAYOUT */}
            <div className="px-8 pb-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Store Name */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    <Store size={16} />
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) =>
                      setFormData({ ...formData, brandName: e.target.value })
                    }
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-all text-lg font-medium"
                    placeholder="Your Store Name"
                    required
                  />
                </div>

                {/* Store URL */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    <LinkIcon size={16} />
                    Store URL
                  </label>
                  <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-2xl focus-within:border-black transition-all">
                    <span className="text-gray-500 font-semibold text-sm whitespace-nowrap">
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
                      className="flex-1 outline-none text-lg font-medium"
                      placeholder="your-store"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    <FileText size={16} />
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
                    rows={5}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-all resize-none text-base"
                    placeholder="Tell customers about your brand, what makes you unique, and what you offer..."
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    <MapPin size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-all text-base"
                    placeholder="Addis Ababa, Ethiopia"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    <Instagram size={16} />
                    Instagram
                  </label>
                  <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-2xl focus-within:border-black transition-all">
                    <span className="text-gray-500 font-semibold">@</span>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instagram: e.target.value.replace("@", ""),
                        })
                      }
                      className="flex-1 outline-none text-base"
                      placeholder="yourhandle"
                    />
                  </div>
                </div>
              </div>

              {/* ✅ SAVE BUTTON */}
              <button
                onClick={handleSave}
                disabled={isSaving || isUploadingLogo || isUploadingCover}
                className="w-full mt-8 bg-gradient-to-r from-black to-gray-800 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group hover:scale-[1.02]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={22} />
                    Save Changes
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
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
