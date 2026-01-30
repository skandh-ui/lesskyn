"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditExpertForm from "./EditExpertForm";

interface Expert {
  _id: string;
  name: string;
  type: "dermatologist" | "influencer";
  email: string;
  phone: string;
  price: number;
  durations: number[];
  isActive: boolean;
  avatar?: string;
  degree?: string;
  experienceYears?: number;
  specialization?: string;
  bio?: string;
  weeklyAvailability: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  unavailabilities?: Array<{
    startDate: string;
    endDate: string;
    reason?: string;
  }>;
  socials?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

interface Booking {
  _id: string;
  status: string;
  startTime?: string;
  endTime?: string;
  price: number;
  duration: number;
  user: {
    userName: string;
    email: string;
  };
  createdAt: string;
}

export default function ExpertDetailClient({ expertId }: { expertId: string }) {
  const router = useRouter();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "bookings" | "edit">(
    "details",
  );
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    fetchExpert();
  }, [expertId]);

  useEffect(() => {
    if (activeTab === "bookings" && bookings.length === 0) {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchExpert = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/experts/${expertId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch expert");
      }

      const data = await response.json();
      setExpert(data.expert);
    } catch (error) {
      console.error("Error fetching expert:", error);
      alert("Failed to load expert details");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const response = await fetch(`/api/admin/experts/${expertId}/bookings`);

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleUpdateSuccess = () => {
    fetchExpert();
    setActiveTab("details");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Expert not found</p>
        <button
          onClick={() => router.push("/admin")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Admin
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 mt-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push("/admin")}
            className="text-blue-600 hover:text-blue-700 mb-2 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Experts
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{expert.name}</h1>
          <p className="text-gray-600 mt-2">
            {expert.type === "dermatologist" ? "Dermatologist" : "Influencer"} •{" "}
            {expert.isActive ? (
              <span className="text-green-600">Active</span>
            ) : (
              <span className="text-red-600">Inactive</span>
            )}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "bookings"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "edit"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-gray-900">{expert.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="text-gray-900">{expert.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="text-gray-900">₹{expert.price} per session</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Session Durations
                </dt>
                <dd className="text-gray-900">
                  {expert.durations.join(", ")} minutes
                </dd>
              </div>
              {expert.degree && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Degree</dt>
                  <dd className="text-gray-900">{expert.degree}</dd>
                </div>
              )}
              {expert.experienceYears !== undefined && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Experience
                  </dt>
                  <dd className="text-gray-900">
                    {expert.experienceYears} years
                  </dd>
                </div>
              )}
              {expert.specialization && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Specialization
                  </dt>
                  <dd className="text-gray-900">{expert.specialization}</dd>
                </div>
              )}
              {expert.bio && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Bio</dt>
                  <dd className="text-gray-900">{expert.bio}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Weekly Availability</h2>
            <div className="space-y-2">
              {expert.weeklyAvailability.map((slot, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span className="font-medium text-gray-700">{slot.day}</span>
                  <span className="text-gray-600">
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
              ))}
            </div>

            {expert.unavailabilities && expert.unavailabilities.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Unavailability</h3>
                <div className="space-y-2">
                  {expert.unavailabilities.map((unavail, index) => (
                    <div key={index} className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-red-900">
                        {new Date(unavail.startDate).toLocaleDateString()} -{" "}
                        {new Date(unavail.endDate).toLocaleDateString()}
                      </p>
                      {unavail.reason && (
                        <p className="text-xs text-red-700 mt-1">
                          {unavail.reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          {expert.socials && Object.keys(expert.socials).length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Social Media</h2>
              <div className="space-y-2">
                {expert.socials.facebook && (
                  <a
                    href={expert.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:underline"
                  >
                    Facebook
                  </a>
                )}
                {expert.socials.twitter && (
                  <a
                    href={expert.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:underline"
                  >
                    Twitter
                  </a>
                )}
                {expert.socials.instagram && (
                  <a
                    href={expert.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:underline"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Bookings</h2>
          {loadingBookings ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No bookings found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.user.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.startTime
                          ? new Date(booking.startTime).toLocaleString()
                          : "Not scheduled"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.duration} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{booking.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "paid"
                                ? "bg-blue-100 text-blue-800"
                                : booking.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "edit" && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Edit Expert</h2>
          <EditExpertForm expert={expert} onSuccess={handleUpdateSuccess} />
        </div>
      )}
    </div>
  );
}
