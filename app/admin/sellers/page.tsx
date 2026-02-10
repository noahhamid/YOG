"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Eye,
  Clock,
  Store,
  MapPin,
  Instagram,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface SellerApplication {
  id: string;
  brandName: string;
  location: string;
  instagram: string | null;
  clothingType: string | null;
  businessType: string | null;
  experience: string | null;
  description: string | null;
  approved: boolean;
  rejectionReason: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string;
  };
}

export default function AdminSellersPage() {
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<SellerApplication | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/sellers?filter=${filter}`);
      const data = await response.json();
      setApplications(data.sellers || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId: string) => {
    if (!confirm("Approve this seller application?")) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/approve`, {
        method: "PATCH",
      });

      if (response.ok) {
        alert("Seller approved successfully!");
        fetchApplications();
        setSelectedApp(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to approve seller");
      }
    } catch (error) {
      alert("Error approving seller");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (sellerId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    if (!confirm("Reject this seller application?")) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (response.ok) {
        alert("Seller rejected");
        fetchApplications();
        setSelectedApp(null);
        setRejectionReason("");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to reject seller");
      }
    } catch (error) {
      alert("Error rejecting seller");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApps = applications;

  const stats = {
    pending: applications.filter((a) => !a.approved && !a.rejectionReason)
      .length,
    approved: applications.filter((a) => a.approved).length,
    rejected: applications.filter((a) => a.rejectionReason).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Seller Applications
          </h1>
          <p
            className="text-gray-600"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Review and manage seller applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border-2 border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-semibold mb-1">
                  Pending Review
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="text-orange-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-semibold mb-1">
                  Approved
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-red-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-semibold mb-1">
                  Rejected
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <XCircle className="text-red-600" size={40} />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl p-2 mb-6 flex gap-2 border border-gray-200">
          {["all", "pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as typeof filter)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold capitalize transition-all ${
                filter === tab
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">No applications found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Store className="text-white" size={28} />
                    </div>
                    <div>
                      <h3
                        className="text-xl font-bold text-gray-900 mb-1"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {app.brandName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {app.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {app.approved ? (
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                        ✓ Approved
                      </span>
                    ) : app.rejectionReason ? (
                      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                        ✗ Rejected
                      </span>
                    ) : (
                      <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                        ⏱ Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-gray-50 rounded-xl p-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Owner</p>
                    <p className="font-semibold text-gray-900">
                      {app.user.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">
                      {app.user.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Business Type</p>
                    <p className="font-semibold text-gray-900">
                      {app.businessType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Clothing Type</p>
                    <p className="font-semibold text-gray-900">
                      {app.clothingType || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={18} />
                    View Details
                  </button>

                  {!app.approved && !app.rejectionReason && (
                    <>
                      <button
                        onClick={() => handleApprove(app.id)}
                        disabled={actionLoading}
                        className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300"
                      >
                        <Check size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <X size={18} />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-3xl font-bold"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {selectedApp.brandName}
              </h2>
              <button
                onClick={() => {
                  setSelectedApp(null);
                  setRejectionReason("");
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Owner Info */}
              <div>
                <h3 className="font-semibold mb-3">Owner Information</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold">{selectedApp.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{selectedApp.user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">
                      {selectedApp.user.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Instagram</p>
                    <p className="font-semibold">
                      {selectedApp.instagram || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div>
                <h3 className="font-semibold mb-3">Business Information</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                  <div>
                    <p className="text-sm text-gray-500">Business Type</p>
                    <p className="font-semibold">{selectedApp.businessType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Clothing Type</p>
                    <p className="font-semibold">{selectedApp.clothingType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-semibold">
                      {selectedApp.experience || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{selectedApp.location}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedApp.description && (
                <div>
                  <h3 className="font-semibold mb-3">Brand Description</h3>
                  <p className="bg-gray-50 rounded-xl p-4 text-gray-700">
                    {selectedApp.description}
                  </p>
                </div>
              )}

              {/* Rejection Section */}
              {!selectedApp.approved && !selectedApp.rejectionReason && (
                <div>
                  <h3 className="font-semibold mb-3">
                    Rejection Reason (Optional)
                  </h3>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                    rows={4}
                    placeholder="Why are you rejecting this application?"
                  />
                </div>
              )}

              {/* Action Buttons */}
              {!selectedApp.approved && !selectedApp.rejectionReason && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedApp.id)}
                    disabled={actionLoading}
                    className="flex-1 bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300"
                  >
                    ✓ Approve Seller
                  </button>
                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    disabled={actionLoading || !rejectionReason.trim()}
                    className="flex-1 bg-red-500 text-white py-4 rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-300"
                  >
                    ✗ Reject Seller
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
