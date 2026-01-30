import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ExpertDetailClient from "@/components/ExpertDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExpertDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const { id } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ExpertDetailClient expertId={id} />
      </div>
    </div>
  );
}
