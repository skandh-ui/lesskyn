"use client";

import { useState } from "react";
import AddExpertForm from "./AddExpertForm";
import ExpertListSection from "./ExpertListSection";

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("list")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "list"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Experts
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "add"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Add New Expert
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "list" && <ExpertListSection />}

      {activeTab === "add" && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add New Expert
          </h2>
          <AddExpertForm />
        </div>
      )}
    </div>
  );
}
