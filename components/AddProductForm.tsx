"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  Image as ImageIcon,
  AlertCircle,
  Check,
  Upload,
  Loader2,
  Sparkles,
} from "lucide-react";
import { CustomDropdown } from "./ui/custom-dropdown";

interface Variant {
  size: string;
  color: string;
  quantity: number;
}

interface AddProductFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

// Compression helper
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

export default function AddProductForm({
  onClose,
  onSubmit,
}: AddProductFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    compareAtPrice: "",
    category: "",
    clothingType: "",
    occasion: "",
    material: "",
    status: "PUBLISHED",
  });

  const [variants, setVariants] = useState<Variant[]>([
    { size: "S", color: "Black", quantity: 0 },
  ]);

  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL"];

  const categoryOptions = [
    { value: "MEN", label: "Men's", description: "For men" },
    { value: "WOMEN", label: "Women's", description: "For women" },
    { value: "UNISEX", label: "Unisex", description: "For everyone" },
  ];

  const clothingTypeOptions = [
    { value: "TOP", label: "Tops", description: "T-shirts, Shirts, Blouses" },
    { value: "BOTTOM", label: "Bottoms", description: "Jeans, Pants, Skirts" },
    { value: "DRESS", label: "Dresses", description: "All dress styles" },
    { value: "OUTERWEAR", label: "Outerwear", description: "Jackets, Coats" },
    {
      value: "UNDERWEAR",
      label: "Underwear",
      description: "Intimates & Loungewear",
    },
    { value: "SHOES", label: "Footwear", description: "Shoes & Accessories" },
    {
      value: "ACCESSORIES",
      label: "Accessories",
      description: "Bags, Hats, Jewelry",
    },
    {
      value: "ACTIVEWEAR",
      label: "Activewear",
      description: "Sports & Fitness",
    },
  ];

  const occasionOptions = [
    { value: "CASUAL", label: "Casual", description: "Everyday wear" },
    { value: "FORMAL", label: "Formal", description: "Business & Events" },
    {
      value: "SPORTSWEAR",
      label: "Sportswear",
      description: "Athletic activities",
    },
    { value: "STREETWEAR", label: "Streetwear", description: "Urban fashion" },
    {
      value: "WORKWEAR",
      label: "Workwear",
      description: "Professional attire",
    },
  ];

  useEffect(() => {
    const userStr = localStorage.getItem("yog_user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const addVariant = () => {
    setVariants([...variants, { size: "S", color: "Black", quantity: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string | number,
  ) => {
    const updated = [...variants];
    if (field === "quantity") {
      updated[index][field] = value as number;
    } else {
      updated[index][field] = value as string;
    }
    setVariants(updated);
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File too large (max 10MB)");
      return;
    }

    setIsUploadingImage(true);
    setUploadProgress(0);

    try {
      const userStr = localStorage.getItem("yog_user");
      if (!userStr) {
        alert("Please sign in first");
        return;
      }

      setUploadProgress(30);
      const compressed = await compressImage(file, 1200, 1200, 0.85);
      setUploadProgress(60);

      const formData = new FormData();
      formData.append("file", compressed, file.name);
      formData.append("type", "product");

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-user-data": userStr },
        body: formData,
      });

      const data = await response.json();
      setUploadProgress(100);

      if (response.ok && data.url) {
        setImages([...images, data.url]);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.clothingType)
      newErrors.clothingType = "Clothing type is required";
    if (images.length < 2) newErrors.images = "At least 2 images required";
    if (variants.length === 0)
      newErrors.variants = "At least one variant required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!currentUser) {
      alert("Please sign in first");
      window.location.href = "/login?redirect=/seller/dashboard";
      return;
    }

    if (currentUser.role !== "SELLER" && currentUser.role !== "ADMIN") {
      alert("You need to be a seller to add products");
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice
          ? parseFloat(formData.compareAtPrice)
          : null,
        clothingType: formData.clothingType || null,
        occasion: formData.occasion || null,
        material: formData.material || null,
        variants,
        images,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": JSON.stringify(currentUser),
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Product added successfully!");
        onSubmit(data.product);
      } else {
        alert(data.error || "Failed to add product");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-5xl w-full my-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-black to-gray-800 text-white z-20 px-6 py-5 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="text-yellow-400" size={24} />
                <h2 className="text-2xl font-bold">Add New Product</h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all ${
                      errors.title
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-black"
                    }`}
                    placeholder="e.g., Oversized Vintage Hoodie"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-2.5 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 resize-none transition-all ${
                      errors.description
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-black"
                    }`}
                    placeholder="Describe your product..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Price (ETB) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all ${
                      errors.price
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-black"
                    }`}
                    placeholder="1000"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* Compare Price */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Compare At Price
                  </label>
                  <input
                    type="number"
                    name="compareAtPrice"
                    value={formData.compareAtPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    placeholder="1500"
                  />
                  <p className="text-xs text-gray-500 mt-1">For discounts</p>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category *
                  </label>
                  <CustomDropdown
                    options={categoryOptions}
                    value={formData.category}
                    onChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    placeholder="Select category"
                    error={!!errors.category}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Clothing Type Dropdown */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Clothing Type *
                  </label>
                  <CustomDropdown
                    options={clothingTypeOptions}
                    value={formData.clothingType}
                    onChange={(value) =>
                      setFormData({ ...formData, clothingType: value })
                    }
                    placeholder="Select type"
                    error={!!errors.clothingType}
                  />
                  {errors.clothingType && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.clothingType}
                    </p>
                  )}
                </div>

                {/* Occasion Dropdown */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Occasion
                  </label>
                  <CustomDropdown
                    options={occasionOptions}
                    value={formData.occasion}
                    onChange={(value) =>
                      setFormData({ ...formData, occasion: value })
                    }
                    placeholder="Select occasion"
                  />
                </div>

                {/* Material */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    placeholder="e.g., Cotton, Polyester"
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Variants
                </h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-3 py-1.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 text-xs"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl"
                  >
                    <select
                      value={variant.size}
                      onChange={(e) =>
                        updateVariant(index, "size", e.target.value)
                      }
                      className="px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black"
                    >
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) =>
                        updateVariant(index, "color", e.target.value)
                      }
                      placeholder="Color"
                      className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black"
                    />

                    <input
                      type="number"
                      value={variant.quantity}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="Qty"
                      min="0"
                      className="w-20 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black"
                    />

                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="w-8 h-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.variants && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.variants}
                </p>
              )}
            </div>

            {/* Images */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Images (Min. 2)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {/* File Upload */}
                <label
                  className={`flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    isUploadingImage
                      ? "bg-gray-50 border-gray-300"
                      : "border-gray-300 hover:border-black hover:bg-gray-50"
                  }`}
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 size={20} className="animate-spin text-black" />
                      <span className="text-xs font-medium">
                        {uploadProgress < 30
                          ? "Preparing..."
                          : uploadProgress < 60
                            ? "Compressing..."
                            : "Uploading..."}
                      </span>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      <span className="text-xs font-medium">Upload Image</span>
                      <span className="text-xs text-gray-500">Max 10MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                </label>

                {/* URL Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste URL"
                    className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="px-4 py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {images.length === 0 && (
                  <div className="col-span-4 sm:col-span-6 flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <ImageIcon className="text-gray-400 mb-2" size={32} />
                    <p className="text-gray-500 text-xs">No images yet</p>
                  </div>
                )}
              </div>
              {errors.images && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.images}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
