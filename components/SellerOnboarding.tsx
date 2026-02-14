"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import {
  Store,
  User,
  Phone,
  Instagram,
  MapPin,
  Shirt,
  Mail,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  ArrowRight,
  ShoppingBag,
  TrendingUp,
  Zap,
  Award,
  DollarSign,
  Users,
  Sparkles,
} from "lucide-react";

export default function SellerOnboarding() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    brandName: "",
    ownerName: "",
    phone: "",
    email: "",
    instagram: "",
    location: "",
    clothingType: "",
    businessType: "",
    experience: "",
    description: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const clothingTypes = [
    "Streetwear",
    "Casual Wear",
    "Formal Wear",
    "Athletic Wear",
    "Traditional Wear",
    "Accessories",
    "Mixed Collection",
  ];

  const businessTypes = [
    "Individual Designer",
    "Small Business",
    "Established Brand",
    "Wholesaler",
  ];

  // Load user data on mount
  useEffect(() => {
    const userStr = localStorage.getItem("yog_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      // Pre-fill email from logged-in user
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        ownerName: user.name,
      }));
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.brandName.trim())
      newErrors.brandName = "Brand name is required";
    if (!formData.ownerName.trim())
      newErrors.ownerName = "Owner name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9+\-\s()]+$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.clothingType)
      newErrors.clothingType = "Please select clothing type";
    if (!formData.businessType)
      newErrors.businessType = "Please select business type";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check if user is logged in
    if (!currentUser) {
      alert("Please sign in first");
      router.push("/login?redirect=/seller/apply");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/seller/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName: formData.brandName,
          ownerName: formData.ownerName,
          phone: formData.phone,
          email: formData.email,
          instagram: formData.instagram,
          location: formData.location,
          clothingType: formData.clothingType,
          businessType: formData.businessType,
          experience: formData.experience,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Seller application submitted:", data);

        // Update user in localStorage to SELLER role
        const updatedUser = { ...currentUser, role: "SELLER" };
        localStorage.setItem("yog_user", JSON.stringify(updatedUser));

        setSubmitSuccess(true);
      } else {
        alert(data.error || "Failed to submit application");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit application. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center px-4 pt-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white rounded-3xl p-12 text-center border-2 border-gray-100 shadow-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <CheckCircle2 size={48} className="text-white" />
            </motion.div>
            <h2
              className="text-4xl font-light text-gray-900 mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Application Submitted!
            </h2>
            <p
              className="text-gray-600 mb-6 leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: "16px" }}
            >
              Thank you for applying to sell on YOG. Our team will review your
              application and contact you within 2-3 business days.
            </p>

            <div className="space-y-3 mb-8 text-left">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Mail
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Check Your Email
                    </p>
                    <p className="text-xs text-blue-700">
                      We've sent a confirmation to {formData.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-start gap-3">
                  <Phone
                    className="text-purple-600 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-semibold text-purple-900">
                      Stay Available
                    </p>
                    <p className="text-xs text-purple-700">
                      We may call {formData.phone} for verification
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                router.push("/");
                router.refresh();
              }}
              className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Back to Home
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-3 rounded-full mb-6 shadow-lg"
            >
              <Store className="text-white" size={20} />
              <span
                className="text-white font-semibold text-sm uppercase tracking-wider"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Seller Application
              </span>
            </motion.div>

            <h1
              className="text-gray-900 text-5xl md:text-6xl font-light mb-6"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Apply to Sell on YOG
            </h1>
            <p
              className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-8"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Join Ethiopia's premier fashion marketplace. We carefully review
              each application to maintain quality standards.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <Users className="text-blue-600 mx-auto mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-900">5,000+</p>
                <p className="text-xs text-gray-600">Active Buyers</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <Award className="text-green-600 mx-auto mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-900">98%</p>
                <p className="text-xs text-gray-600">Satisfaction</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <Zap className="text-purple-600 mx-auto mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-xs text-gray-600">Support</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Business Information */}
              <div>
                <h3
                  className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building2 size={22} className="text-blue-600" />
                  </div>
                  Business Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Brand Name */}
                  <div className="group">
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <Store size={16} className="text-gray-500" />
                      Brand Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="brandName"
                        value={formData.brandName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all group-hover:border-gray-300 ${
                          errors.brandName
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="e.g., UrbanStyle Co."
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                    {errors.brandName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.brandName}
                      </p>
                    )}
                  </div>

                  {/* Owner Name */}
                  <div className="group">
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <User size={16} className="text-gray-500" />
                      Owner Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all group-hover:border-gray-300 ${
                          errors.ownerName
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Your full name"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      />
                    </div>
                    {errors.ownerName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.ownerName}
                      </p>
                    )}
                  </div>

                  {/* Business Type */}
                  <div className="group">
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <Building2 size={16} className="text-gray-500" />
                      Business Type *
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all group-hover:border-gray-300 cursor-pointer ${
                        errors.businessType
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.businessType && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.businessType}
                      </p>
                    )}
                  </div>

                  {/* Clothing Type */}
                  <div className="group">
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <Shirt size={16} className="text-gray-500" />
                      Clothing Type *
                    </label>
                    <select
                      name="clothingType"
                      value={formData.clothingType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all group-hover:border-gray-300 cursor-pointer ${
                        errors.clothingType
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <option value="">Select type</option>
                      {clothingTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.clothingType && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.clothingType}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3
                  className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Phone size={22} className="text-green-600" />
                  </div>
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="group">
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <Phone size={16} className="text-gray-500" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all group-hover:border-gray-300 ${
                        errors.phone ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="+251 912 345 678"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <Mail size={16} className="text-gray-500" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all group-hover:border-gray-300 ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="your@email.com"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      readOnly
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Instagram */}
                  <div className="group">
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <Instagram size={16} className="text-gray-500" />
                      Instagram
                      <span className="text-xs text-gray-500 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all group-hover:border-gray-300"
                      placeholder="@yourbrand"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  {/* Location */}
                  <div className="group">
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <MapPin size={16} className="text-gray-500" />
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all group-hover:border-gray-300 ${
                        errors.location ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="City, Ethiopia"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3
                  className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FileText size={22} className="text-purple-600" />
                  </div>
                  Tell Us More
                </h3>

                {/* Years of Experience */}
                <div className="mb-6 group">
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <TrendingUp size={16} className="text-gray-500" />
                    Years of Experience
                    <span className="text-xs text-gray-500 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all group-hover:border-gray-300"
                    placeholder="e.g., 2 years"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>

                {/* Description */}
                <div className="group">
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <Sparkles size={16} className="text-gray-500" />
                    Brand Description
                    <span className="text-xs text-gray-500 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all resize-none group-hover:border-gray-300"
                    placeholder="Tell us about your brand, products, and what makes you unique..."
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>
              </div>

              {/* Info Box - Application Review */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="text-white" size={24} />
                    </div>
                  </div>
                  <div>
                    <h4
                      className="font-bold text-blue-900 mb-2 text-base"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Application Review Process
                    </h4>
                    <p
                      className="text-sm text-blue-800 leading-relaxed"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Your application will be carefully reviewed within{" "}
                      <strong>2-3 business days</strong>. We'll contact you via
                      phone and email with the next steps. Make sure to keep
                      your contact information accessible!
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 rounded border-2 border-gray-300 checked:bg-black checked:border-black focus:ring-2 focus:ring-black cursor-pointer transition-all"
                  />
                  <span
                    className="text-sm text-gray-700 leading-relaxed"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    I agree to YOG's seller terms and conditions. I understand
                    that my application will be reviewed and I may be contacted
                    for additional information. *
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 ml-8">
                    <AlertCircle size={14} />
                    {errors.termsAccepted}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-5 rounded-full font-bold text-base uppercase tracking-wider hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl group"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Application...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Apply to Sell on YOG
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>

              {/* Info Note */}
              <p
                className="text-center text-sm text-gray-500"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Applications are reviewed within 2-3 business days. We'll
                contact you at the provided email.
              </p>
            </form>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            <div className="text-center p-8 bg-white rounded-2xl border-2 border-gray-100 hover:shadow-xl transition-all hover:border-purple-200 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <DollarSign className="text-purple-600" size={28} />
              </div>
              <h3
                className="font-bold text-gray-900 mb-2 text-lg"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Zero Listing Fees
              </h3>
              <p
                className="text-sm text-gray-600 leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                List unlimited products at no cost. Only pay when you make a
                sale.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl border-2 border-gray-100 hover:shadow-xl transition-all hover:border-green-200 group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="text-green-600" size={28} />
              </div>
              <h3
                className="font-bold text-gray-900 mb-2 text-lg"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Fast Payments
              </h3>
              <p
                className="text-sm text-gray-600 leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Get paid within 24 hours of successful delivery confirmation.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl border-2 border-gray-100 hover:shadow-xl transition-all hover:border-blue-200 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="text-blue-600" size={28} />
              </div>
              <h3
                className="font-bold text-gray-900 mb-2 text-lg"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Marketing Support
              </h3>
              <p
                className="text-sm text-gray-600 leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Featured placements and promotion for top-performing sellers.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
