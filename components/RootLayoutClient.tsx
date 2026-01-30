"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface RootLayoutClientProps {
  children: ReactNode;
  isAdmin: boolean;
}

export default function RootLayoutClient({
  children,
  isAdmin,
}: RootLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Redirect admins to /admin page if they try to access any other page
  useEffect(() => {
    if (isAdmin && !pathname?.startsWith("/admin")) {
      router.push("/admin");
    }
  }, [isAdmin, pathname, router]);

  // If admin is being redirected, show loading or nothing
  if (isAdmin && !pathname?.startsWith("/admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Redirecting to admin dashboard...</p>
      </div>
    );
  }

  // Check if current page should hide footer
  const isQuiz =
    pathname?.includes("/quiz") || pathname?.includes("/booking/success");
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <main className="root-container min-h-screen flex flex-col relative">
      <div className="mx-auto flex-1 w-full h-full">
        <Header />
        {children}
        {!isQuiz && !isAdminPage && <Footer variant="landing" />}
      </div>
    </main>
  );
}
