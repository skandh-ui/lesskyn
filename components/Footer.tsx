"use client";

import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/public/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface FooterProps {
  variant?: "default" | "landing";
}

const Footer = ({ variant = "default" }: FooterProps) => {
  const isLanding = variant === "landing";
  const [showToast, setShowToast] = useState(false);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <section className="relative">
      {/* ⭐ GRID OVERLAY (DISABLED FOR LANDING) */}
      {!isLanding && (
        <div className="absolute inset-0 pointer-events-none z-10 opacity-100">
          <div className="absolute inset-0 grid grid-cols-[repeat(10,1fr)] sm:grid-cols-[repeat(20,1fr)]">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={`v-${i}`} className="border-r border-white/[0.03]" />
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-[repeat(10,1fr)] sm:grid-rows-[repeat(6,1fr)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`h-${i}`} className="border-b border-white/[0.03]" />
            ))}
          </div>
        </div>
      )}

      {/* ⭐ FOOTER CONTENT PC*/}
      <footer
        className={`
          relative z-10
          hidden md:block
          ${isLanding ? "bg-black" : "bg-[#2C2C2C]"}
          text-white
          px-6
          ${isLanding ? "py-12" : "py-8"}
        `}
      >
        <div
          className={`
            grid
            grid-cols-1 gap-16
            sm:grid-cols-3
            max-w-7xl mx-auto
          `}
        >
          {/* ---------------- BRAND ---------------- */}
          <div className="space-y-6">
            <div className="flex sm:flex-col justify-between items-center sm:items-start">
              <div className="flex items-center gap-4">
                <Image
                  src={logo}
                  alt="LesSkyn"
                  className={`${isLanding ? "h-16 w-14" : "h-12 w-10"}`}
                />
                <h3
                  className={`
                    font-garamond
                    ${isLanding ? "text-5xl" : "text-3xl"}
                    font-medium
                  `}
                >
                  LesSkyn
                </h3>
              </div>

              <div className="flex items-center gap-6 sm:mt-6">
                <Instagram className="h-6 w-6" />
                <Twitter className="h-6 w-6" />
                <Facebook className="h-6 w-6" />
              </div>
            </div>

            <p
              className={`
                max-w-sm
                ${isLanding ? "text-lg" : "text-sm"}
                leading-relaxed
                text-white/50
              `}
            >
              AI-powered skincare assistant creating clarity in skincare chaos
              for Indian consumers.
            </p>

            <a
              href="mailto:skandh@lesskyn.in"
              onClick={handleContactClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/20 bg-transparent text-white hover:bg-white/10 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact Us
            </a>
          </div>

          {/* ---------------- QUICK LINKS ---------------- */}
          <div className="space-y-6">
            <h4 className="font-garamond text-2xl">Quick Links</h4>
            <ul
              className={`${
                isLanding ? "text-lg" : "text-sm"
              } space-y-4 text-white/60`}
            >
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about-us">About Us</Link>
              </li>
              <li>
                <Link href="/features">Features</Link>
              </li>
              <li>
                <Link href="/community">Community</Link>
              </li>
            </ul>
          </div>

          {/* ---------------- RESOURCES ---------------- */}
          <div className="space-y-6">
            <h4 className="font-garamond text-2xl">Resources</h4>
            <ul
              className={`${
                isLanding ? "text-lg" : "text-sm"
              } space-y-4 text-white/60`}
            >
              <li>
                <Link href="/quiz">Take the quiz</Link>
              </li>
              <li>
                <Link href="/dermat">Book Consultation</Link>
              </li>
              <li>
                <Link href="/booking">Talk to Skin Bestie</Link>
              </li>
              <li>
                <a
                  href="https://wa.me/917977937648"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Send a Message
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* ⭐ FOOTER CONTENT MOBILE */}
      <footer
        className={`
    md:hidden
    bg-black
    text-white
    px-6
    py-8
  `}
      >
        <div className="flex flex-col items-center text-center gap-8 max-w-sm mx-auto">
          {/* BRAND */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-5">
              <Image src={logo} alt="LesSkyn" className="h-14 w-10" />
              <h3 className="font-garamond mt-[10px] text-[32px] font-medium">
                LesSkyn
              </h3>
            </div>

            <p className="text-[14px] text-white/50 w-[80%] leading-relaxed max-w-xs">
              AI-powered skincare assistant creating clarity in skincare chaos
              for Indian consumers.
            </p>
          </div>

          {/* SOCIALS */}
          <div className="flex items-center gap-6">
            <Instagram className="h-5 w-5" />
            <Twitter className="h-5 w-5 " />
            <Facebook className="h-5 w-5" />
          </div>

          {/* CONTACT BUTTON */}
          <a
            href="mailto:skandh@lesskyn.in"
            onClick={handleContactClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-white/20 bg-transparent text-white hover:bg-white/10 transition-colors w-full max-w-[200px]"
          >
            <Mail className="h-4 w-4" />
            Contact Us
          </a>

          <div className="grid grid-cols-2 gap-x-8 gap-y-8 w-full max-w-[320px] mx-auto">
            {/* QUICK LINKS */}
            <div className="flex flex-col gap-4 items-start">
              <h4 className="font-garamond text-xl text-white">Quick Links</h4>
              <ul className="list-none space-y-2 text-[14px] text-white/50">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/about-us">About Us</Link>
                </li>
                <li>
                  <Link href="/features">Features</Link>
                </li>
                <li>
                  <Link href="/community">Community</Link>
                </li>
              </ul>
            </div>

            {/* RESOURCES */}
            <div className="flex flex-col gap-4 items-start">
              <h4 className="font-garamond text-xl text-white">Resources</h4>
              <ul className="list-none space-y-2 text-[14px] text-white/50">
                <li>
                  <Link href="/quiz">Take the quiz</Link>
                </li>
                <li>
                  <Link href="/dermat">Book Consultation</Link>
                </li>
                <li>
                  <Link href="/booking">Talk to Skin Bestie</Link>
                </li>
                <li>
                  <a
                    href="https://wa.me/917977937648"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Send a Message
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-400" />
            <span className="font-medium">
              Please email at: skandh@lesskyn.in
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default Footer;
