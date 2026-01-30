import React, { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RootLayoutClient from "@/components/RootLayoutClient";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  // If user is admin, redirect to admin page unless already there
  if (session?.user?.role === "admin") {
    // We'll handle this in the client component to check pathname
    return <RootLayoutClient isAdmin={true}>{children}</RootLayoutClient>;
  }

  return <RootLayoutClient isAdmin={false}>{children}</RootLayoutClient>;
}
