"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Package,
  DollarSign,
  Tag,
  FileText,
  Truck,
  MapPin,
  Sparkles,
  Plus,
} from "lucide-react";

interface ProductFormData {
  name: string;
  price: string;
  sizes: string[];
  category: string;
  description: string;
  images: File[];
  deliveryAvailable: boolean;
  meetupAvailable: boolean;
  tags: string[];
}

interface AddProductFormProps {
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
}

export default function AddProductForm({
  onClose,
  onSubmit,
}: AddProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    sizes: [],
    category: "",
    description: "",
    images: [],
    deliveryAvailable: false,
    meetupAvailable: false,
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Streetwear",
    "Casual Wear",
    "Formal Wear",
    "Athletic Wear",
    "Traditional Wear",
    "Accessories",
  ];

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Image validation
  const validateImage = async (
    file: File,
  ): Promise<{ valid: boolean; error?: string }> => {
    return new Promise((resolve) => {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        resolve({ valid: false, error: "Image must be less than 5MB" });
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        resolve({ valid: false, error: "File must be an image" });
        return;
      }

      // Check dimensions and aspect ratio
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const aspectRatio = width / height;

        // Minimum resolution: 800x800
        if (width < 800 || height < 800) {
          resolve({
            valid: false,
            error: "Image must be at least 800x800 pixels",
          });
          return;
        }

        // Must be square (allow 5% tolerance)
        if (Math.abs(aspectRatio - 1) > 0.05) {
          resolve({
            valid: false,
            error: "Image must be square (1:1 aspect ratio)",
          });
          return;
        }

        resolve({ valid: true });
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (formData.images.length + files.length > 5) {
      setErrors({ ...errors, images: "Maximum 5 images allowed" });
      return;
    }

    for (const file of files) {
      const validation = await validateImage(file);

      if (!validation.valid) {
        setErrors({ ...errors, images: validation.error || "Invalid image" });
        return;
      }
    }

    // All images valid
    const newImages = [...formData.images, ...files];
    setFormData({ ...formData, images: newImages });

    // Create previews
    const newPreviews = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }),
    );

    setImagePreviews([...imagePreviews, ...newPreviews]);
    setErrors({ ...errors, images: "" });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const toggleSize = (size: string) => {
    const newSizes = formData.sizes.includes(size)
      ? formData.sizes.filter((s) => s !== size)
      : [...formData.sizes, size];
    setFormData({ ...formData, sizes: newSizes });
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag.trim()] });
      setCurrentTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (formData.sizes.length === 0)
      newErrors.sizes = "Select at least one size";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.images.length < 3)
      newErrors.images = "Upload at least 3 images";
    if (!formData.deliveryAvailable && !formData.meetupAvailable) {
      newErrors.delivery = "Select at least one fulfillment option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-4xl my-8 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b-2 border-gray-100">
          <div>
            <h2
              className="text-3xl font-light text-gray-900 flex items-center gap-3"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              <Package size={32} />
              Add New Product
            </h2>
            <p
              className="text-gray-600 mt-2"
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px" }}
            >
              Fill in the details to list your product
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Form */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Product Name */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-900 mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-black transition-colors ${
                errors.name ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="e.g., Classic White T-Shirt"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-900 mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Price (ETB) *
            </label>
            <div className="relative">
              <DollarSign
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-black transition-colors ${
                  errors.price ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="800"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.price}
              </p>
            )}
          </div>

          {/* Sizes */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-900 mb-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Available Sizes *
            </label>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    formData.sizes.includes(size)
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {size}
                </button>
              ))}
            </div>
            {errors.sizes && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.sizes}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-900 mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-black transition-colors ${
                errors.category ? "border-red-500" : "border-gray-200"
              }`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.category}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-900 mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-black transition-colors resize-none ${
                errors.description ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Describe your product... (material, fit, style, etc.)"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.description}
              </p>
            )}
          </div>

          {/* Images Upload */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-900 mb-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Product Images * (3-5 images required)
            </label>

            {/* Image Requirements */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
              <p
                className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <Sparkles size={16} />
                Image Quality Requirements:
              </p>
              <ul
                className="text-sm text-blue-800 space-y-1 ml-6"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <li>• Square images only (1:1 aspect ratio)</li>
                <li>• Minimum 800x800 pixels</li>
                <li>• Maximum 5MB per image</li>
                <li>• JPG, PNG, or WebP format</li>
              </ul>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                    {index + 1}
                  </div>
                </div>
              ))}

              {/* Upload Button */}
              {formData.images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span
                    className="text-sm text-gray-600 font-medium"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Upload Image
                  </span>
                </label>
              )}
            </div>

            <p
              className="text-xs text-gray-500"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {formData.images.length} of 5 images uploaded (min. 3 required)
            </p>

            {errors.images && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.images}
              </p>
            )}
          </div>

          {/* Fulfillment Options */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-900 mb-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Fulfillment Options *
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.deliveryAvailable}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryAvailable: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-black checked:border-black"
                />
                <Truck size={20} className="text-gray-600" />
                <div className="flex-1">
                  <p
                    className="font-semibold text-gray-900"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Delivery Available
                  </p>
                  <p
                    className="text-sm text-gray-600"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Ship products to customers
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.meetupAvailable}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meetupAvailable: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-black checked:border-black"
                />
                <MapPin size={20} className="text-gray-600" />
                <div className="flex-1">
                  <p
                    className="font-semibold text-gray-900"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Meet-up Available
                  </p>
                  <p
                    className="text-sm text-gray-600"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Local pickup option
                  </p>
                </div>
              </label>
            </div>
            {errors.delivery && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.delivery}
              </p>
            )}
          </div>

          {/* Tags (Optional) */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-900 mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Tags (Optional)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                placeholder="e.g., nike, baggy, hoodie"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <Plus size={18} />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-8 border-t-2 border-gray-100 bg-gray-50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold hover:bg-gray-100 transition-colors border-2 border-gray-200"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding Product...
              </>
            ) : (
              <>
                <Check size={20} />
                Add Product
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
