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

// ✅ COMPRESSION HELPER FUNCTION
const compressImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img"); // ✅ FIXED
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Calculate dimensions
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

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Compression failed"));
            }
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

export default function SellerSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ logo: 0, cover: 0 }); // ✅ NEW
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
      // ✅ STEP 1: COMPRESS
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

      // ✅ STEP 2: UPLOAD
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
        <div className="max-w-4xl mx-auto">
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
              <h1 className="text-4xl font-bold mb-2">Store Settings</h1>
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
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            {/* Cover Image */}
            <div className="relative h-48 bg-gradient-to-r from-gray-900 to-gray-700 rounded-t-2xl overflow-hidden group">
              {formData.storeCover ? (
                <Image
                  src={formData.storeCover}
                  alt="Cover"
                  fill
                  className="object-cover"
                  sizes="896px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/60">
                  <div className="text-center">
                    <Camera size={40} className="mx-auto mb-2" />
                    <p className="text-sm">Add Cover Image</p>
                  </div>
                </div>
              )}

              {/* ✅ PROGRESS OVERLAY FOR COVER */}
              {isUploadingCover && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
                  <p className="text-white text-sm mb-2">
                    {uploadProgress.cover < 60
                      ? "Compressing..."
                      : "Uploading..."}
                  </p>
                  <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${uploadProgress.cover}%` }}
                    />
                  </div>
                  <p className="text-white text-xs mt-2">
                    {uploadProgress.cover}%
                  </p>
                </div>
              )}

              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {!isUploadingCover && (
                  <>
                    <div className="bg-white text-black px-6 py-2 rounded-full font-semibold">
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
            <div className="px-8 -mt-16 relative z-10 mb-6">
              <div className="relative w-32 h-32 group">
                {formData.storeLogo ? (
                  <Image
                    src={formData.storeLogo}
                    alt="Logo"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover rounded-2xl border-4 border-white shadow-lg"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-black to-gray-700 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
                    <Store size={40} className="text-white" />
                  </div>
                )}

                {/* ✅ PROGRESS OVERLAY FOR LOGO */}
                {isUploadingLogo && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center rounded-2xl">
                    <Loader2 className="w-6 h-6 text-white animate-spin mb-2" />
                    <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-300"
                        style={{ width: `${uploadProgress.logo}%` }}
                      />
                    </div>
                  </div>
                )}

                <label className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                  {!isUploadingLogo && (
                    <>
                      <Camera size={24} className="text-white" />
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

            {/* Form */}
            <div className="px-8 pb-8 space-y-6">
              {/* Store Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Store size={16} />
                  Store Name *
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) =>
                    setFormData({ ...formData, brandName: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="Your Store Name"
                  required
                />
              </div>

              {/* Store URL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <LinkIcon size={16} />
                  Store URL *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium text-sm">
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
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="your-store"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2">
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
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors resize-none"
                  placeholder="Tell customers about your store..."
                />
              </div>

              {/* Location & Instagram */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <MapPin size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="Addis Ababa"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Instagram size={16} />
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
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                      placeholder="yourhandle"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving || isUploadingLogo || isUploadingCover}
                className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-3"
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
