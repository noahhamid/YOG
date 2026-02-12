"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Store,
  Instagram,
  Building2,
  Shirt,
  Calendar,
  User,
  TrendingUp,
  AlertCircle,
  Eye,
  Check,
  X,
} from "lucide-react";

interface Seller {
  id: string;
  userId: string;
  brandName: string;
  ownerName: string;
  phone: string;
  email: string;
  instagram: string | null;
  location: string;
  clothingType: string;
  businessType: string;
  experience: string | null;
  description: string | null;
  approved: boolean;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminSellersPage() {
  const router = useRouter();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Check if user is admin
  useEffect(() => {
    const userStr = localStorage.getItem("yog_user");
    if (!userStr) {
      router.push("/login?redirect=/admin/sellers");
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== "ADMIN") {
      alert("Access denied. Admin only.");

      router.push("/");
      return;
    }

    setIsAuthenticated(true);
    fetchSellers();
  }, [router]);

  const fetchSellers = async () => {
    try {
      const response = await fetch("/api/admin/sellers");
      const data = await response.json();

      if (response.ok) {
        setSellers(data.sellers);
        setFilteredSellers(data.sellers);
      } else {
        alert(data.error || "Failed to fetch sellers");
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
      alert("Failed to fetch sellers");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter sellers based on status and search
  useEffect(() => {
    let filtered = sellers;

    // Filter by status
    if (filter === "pending") {
      filtered = filtered.filter(
        (s) => s.approved === false && !s.rejectionReason,
      );
    } else if (filter === "approved") {
      filtered = filtered.filter((s) => s.approved === true);
    } else if (filter === "rejected") {
      filtered = filtered.filter((s) => s.rejectionReason !== null);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredSellers(filtered);
  }, [filter, searchQuery, sellers]);

  const handleApprove = async (sellerId: string) => {
    if (!confirm("Are you sure you want to approve this seller?")) return;

    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/approve`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Seller approved successfully!");
        fetchSellers();
        setShowModal(false);
      } else {
        alert(data.error || "Failed to approve seller");
      }
    } catch (error) {
      console.error("Error approving seller:", error);
      alert("Failed to approve seller");
    }
  };

  const handleReject = async (sellerId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    if (!confirm("Are you sure you want to reject this seller?")) return;

    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Seller rejected successfully!");
        fetchSellers();
        setShowModal(false);
        setRejectionReason("");
      } else {
        alert(data.error || "Failed to reject seller");
      }
    } catch (error) {
      console.error("Error rejecting seller:", error);
      alert("Failed to reject seller");
    }
  };

  const getStatusBadge = (seller: Seller) => {
    if (seller.approved) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
          <CheckCircle size={14} />
          Approved
        </span>
      );
    } else if (seller.rejectionReason) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
          <XCircle size={14} />
          Rejected
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
          <Clock size={14} />
          Pending
        </span>
      );
    }
  };

  const stats = {
    total: sellers.length,
    pending: sellers.filter((s) => !s.approved && !s.rejectionReason).length,
    approved: sellers.filter((s) => s.approved).length,
    rejected: sellers.filter((s) => s.rejectionReason !== null).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Seller Management
            </h1>
            <p className="text-gray-600">
              Review and manage seller applications
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Store className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.approved}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.rejected}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="text-red-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by brand name, owner, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    filter === "all"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    filter === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending ({stats.pending})
                </button>
                <button
                  onClick={() => setFilter("approved")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    filter === "approved"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Approved ({stats.approved})
                </button>
                <button
                  onClick={() => setFilter("rejected")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    filter === "rejected"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Rejected ({stats.rejected})
                </button>
              </div>
            </div>
          </div>

          {/* Sellers List */}
          <div className="space-y-4">
            {filteredSellers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-md border border-gray-100 text-center">
                <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 text-lg">No sellers found</p>
              </div>
            ) : (
              filteredSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                        <Store className="text-purple-600" size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {seller.brandName}
                        </h3>
                        <p className="text-gray-600 mb-2">{seller.ownerName}</p>
                        {getStatusBadge(seller)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSeller(seller);
                        setShowModal(true);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center gap-2"
                    >
                      <Eye size={18} />
                      View Details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} className="text-gray-400" />
                      {seller.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="text-gray-400" />
                      {seller.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="text-gray-400" />
                      {seller.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-gray-400" />
                      {seller.businessType}
                    </div>
                    <div className="flex items-center gap-2">
                      <Shirt size={16} className="text-gray-400" />
                      {seller.clothingType}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      Applied {new Date(seller.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {seller.rejectionReason && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-700">
                        <strong>Rejection Reason:</strong>{" "}
                        {seller.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {showModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Seller Details
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setRejectionReason("");
                }}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Business Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 size={20} />
                  Business Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Brand Name</p>
                    <p className="font-semibold text-gray-900">
                      {selectedSeller.brandName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Business Type</p>
                    <p className="font-semibold text-gray-900">
                      {selectedSeller.businessType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Clothing Type</p>
                    <p className="font-semibold text-gray-900">
                      {selectedSeller.clothingType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold text-gray-900">
                      {selectedSeller.experience || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} />
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Owner Name</p>
                    <p className="font-semibold text-gray-900">
                      {selectedSeller.ownerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">
                      {selectedSeller.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">
                      {selectedSeller.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">
                      {selectedSeller.location}
                    </p>
                  </div>
                  {selectedSeller.instagram && (
                    <div>
                      <p className="text-sm text-gray-600">Instagram</p>
                      <p className="font-semibold text-gray-900">
                        {selectedSeller.instagram}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedSeller.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedSeller.description}
                  </p>
                </div>
              )}

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Status
                </h3>
                {getStatusBadge(selectedSeller)}
              </div>

              {/* Actions (only for pending sellers) */}
              {!selectedSeller.approved && !selectedSeller.rejectionReason && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Actions
                  </h3>

                  {/* Rejection Reason Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rejection Reason (optional if rejecting)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black resize-none"
                      placeholder="Explain why this application is being rejected..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(selectedSeller.id)}
                      className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={20} />
                      Approve Seller
                    </button>
                    <button
                      onClick={() => handleReject(selectedSeller.id)}
                      className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      <X size={20} />
                      Reject Application
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
