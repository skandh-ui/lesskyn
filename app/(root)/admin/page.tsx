import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export default async function AdminPage() {
  const session = await auth();

  // Check if user is authenticated and has admin role
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen mt-8 bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage experts, bookings, and platform settings
          </p>
        </div>

        <AdminDashboardClient />
      </div>
    </div>
  );
}
