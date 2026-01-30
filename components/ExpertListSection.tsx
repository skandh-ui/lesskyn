"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Expert {
  _id: string;
  name: string;
  type: "dermatologist" | "influencer";
  email: string;
  phone: string;
  price: number;
  isActive: boolean;
  avatar?: string;
  specialization?: string;
  bio?: string;
}

export default function ExpertListSection() {
  const router = useRouter();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (search) params.append("search", search);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (statusFilter !== "all") params.append("isActive", statusFilter);

      const response = await fetch(`/api/admin/experts?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch experts");
      }

      const data = await response.json();
      setExperts(data.experts);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching experts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, [page, typeFilter, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchExperts();
  };

  const handleToggleActive = async (
    expertId: string,
    currentStatus: boolean,
  ) => {
    try {
      const response = await fetch(`/api/admin/experts/${expertId}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle expert status");
      }

      // Refresh the list
      fetchExperts();
    } catch (error) {
      console.error("Error toggling expert status:", error);
      alert("Failed to update expert status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Experts</h2>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or specialization..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="dermatologist">Dermatologist</option>
                <option value="influencer">Influencer</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Expert List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : experts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No experts found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experts.map((expert) => (
            <div
              key={expert._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
              onClick={() => router.push(`/admin/experts/${expert._id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {expert.avatar ? (
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      expert.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {expert.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          expert.type === "dermatologist"
                            ? "bg-green-100 text-green-800"
                            : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        {expert.type}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          expert.isActive
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {expert.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {expert.email}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {expert.specialization || expert.bio || "No description"}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right px-4">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{expert.price}
                    </p>
                    <p className="text-xs text-gray-500">per session</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleActive(expert._id, expert.isActive);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      expert.isActive
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {expert.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/experts/${expert._id}`);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
