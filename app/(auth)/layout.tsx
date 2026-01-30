"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Layout = ({ children }: { children: ReactNode }) => {

  return (
    <main className="root-container min-h-screen flex flex-col relative">
      <div
        className={`mx-auto flex-1 w-full h-full `}
      >
        <Header />
        {children}
        <Footer variant="landing" />
      </div>
    </main>
  );
};

export default Layout;
